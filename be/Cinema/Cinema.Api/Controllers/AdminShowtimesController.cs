using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cinema.Data;
using Cinema.Data.Model.Showtimes;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/admin/showtimes")]
[Authorize(Roles = "Admin")] // cần token admin; để test nhanh có thể tạm đổi thành [AllowAnonymous]
public class AdminShowtimesController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminShowtimesController(AppDbContext db) => _db = db;

    // ======= DTOs =======
    public record ShowtimeReq(
        [Required] int MovieId,
        [Required] int RoomId,
        [Required] DateTime StartAt,         // gửi local VN -> mình sẽ Convert sang UTC khi lưu
        [Range(0, 1_000_000)] decimal BasePrice);

    public record BulkShowtimeItem(
        [Required] int MovieId,
        [Required] int RoomId,
        [Required] DateTime StartAt,         // local VN nếu TreatAsLocalAsiaBangkok = true
        [Range(0, 1_000_000)] decimal BasePrice);

    public record BulkReq([Required] List<BulkShowtimeItem> Items, bool TreatAsLocalAsiaBangkok = true);

    // ======= LIST =======
    [HttpGet]
    public async Task<IActionResult> List(CancellationToken ct)
    {
        var data = await _db.Showtimes
            .Include(s => s.Movie)
            .Include(s => s.Room)!.ThenInclude(r => r.Cinema)
            .Include(s => s.Seats)
            .OrderByDescending(s => s.StartAt)
            .Select(s => new {
                s.Id,
                s.MovieId,
                MovieTitle = s.Movie!.Title,
                s.RoomId,
                RoomName = s.Room!.Name,
                CinemaName = s.Room!.Cinema!.Name,
                s.StartAt,
                BasePrice = s.Seats.Select(x => (decimal?)x.Price).Min() ?? 0m,
                SeatsTotal = s.Seats.Count,
                SeatsBooked = s.Seats.Count(x => ShowtimeSeatStatus.IsBooked(x.Status))
            })
            .ToListAsync(ct);
        return Ok(data);
    }

    // ======= GET BY ID =======
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
    {
        var s = await _db.Showtimes
            .Include(x => x.Movie)
            .Include(x => x.Room)!.ThenInclude(r => r.Cinema)
            .Include(x => x.Seats)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
        if (s is null) return NotFound();
        return Ok(new
        {
            s.Id,
            s.MovieId,
            MovieTitle = s.Movie!.Title,
            s.RoomId,
            RoomName = s.Room!.Name,
            CinemaName = s.Room!.Cinema!.Name,
            s.StartAt,
            BasePrice = s.Seats.Select(x => (decimal?)x.Price).Min() ?? 0m
        });
    }

    // ======= CREATE =======
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ShowtimeReq req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var movie = await _db.Movies.FindAsync([req.MovieId], ct);
        var room = await _db.Rooms.Include(r => r.Cinema).Include(r => r.Seats)
                                   .FirstOrDefaultAsync(r => r.Id == req.RoomId, ct);
        if (movie is null) return BadRequest("Movie not found.");
        if (room is null) return BadRequest("Room not found.");

        // Convert StartAt (local VN) -> UTC để lưu nhất quán
        var tz = TimeZoneInfo.FindSystemTimeZoneById(
            OperatingSystem.IsWindows() ? "SE Asia Standard Time" : "Asia/Bangkok");
        var startLocal = DateTime.SpecifyKind(req.StartAt, DateTimeKind.Unspecified);
        var startUtc = TimeZoneInfo.ConvertTimeToUtc(startLocal, tz);

        // chống trùng suất chiếu trong cùng phòng (buffer 15’)
        var endUtc = startUtc.AddMinutes(movie.DurationMin + 15);
        var overlap = await _db.Showtimes
            .Where(s => s.RoomId == room.Id)
            .AnyAsync(s => s.StartAt < endUtc &&
                           s.StartAt.AddMinutes(s.Movie!.DurationMin + 15) > startUtc, ct);
        if (overlap) return Conflict("Showtime overlaps another show in the same room.");

        var st = new Cinema.Data.Model.Showtimes.Showtime { MovieId = movie.Id, RoomId = room.Id, StartAt = startUtc };
        _db.Showtimes.Add(st);
        await _db.SaveChangesAsync(ct);

        // seed ghế
        var seats = room.Seats.Select(seat => new Cinema.Data.Model.Showtimes.ShowtimeSeat
        {
            ShowtimeId = st.Id,
            SeatId = seat.Id,
            Status = ShowtimeSeatStatus.Available,
            Price = req.BasePrice
        });
        await _db.ShowtimeSeats.AddRangeAsync(seats, ct);
        await _db.SaveChangesAsync(ct);

        return CreatedAtAction(nameof(Get), new { id = st.Id }, new { st.Id });
    }

    // ======= UPDATE =======
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ShowtimeReq req, CancellationToken ct)
    {
        var st = await _db.Showtimes
            .Include(s => s.Movie)
            .Include(s => s.Room)!.ThenInclude(r => r.Cinema)
            .Include(s => s.Seats)
            .FirstOrDefaultAsync(s => s.Id == id, ct);
        if (st is null) return NotFound();

        var movie = await _db.Movies.FindAsync([req.MovieId], ct);
        var room = await _db.Rooms.FindAsync([req.RoomId], ct);
        if (movie is null) return BadRequest("Movie not found.");
        if (room is null) return BadRequest("Room not found.");

        var tz = TimeZoneInfo.FindSystemTimeZoneById(
            OperatingSystem.IsWindows() ? "SE Asia Standard Time" : "Asia/Bangkok");
        var startLocal = DateTime.SpecifyKind(req.StartAt, DateTimeKind.Unspecified);
        var startUtc = TimeZoneInfo.ConvertTimeToUtc(startLocal, tz);

        var endUtc = startUtc.AddMinutes(movie.DurationMin + 15);
        var overlap = await _db.Showtimes
            .Where(s => s.Id != id && s.RoomId == room.Id)
            .AnyAsync(s => s.StartAt < endUtc &&
                           s.StartAt.AddMinutes(s.Movie!.DurationMin + 15) > startUtc, ct);
        if (overlap) return Conflict("Showtime overlaps another show in the same room.");

        var oldBase = st.Seats.Select(x => (decimal?)x.Price).Min() ?? 0m;
        var priceChanged = oldBase != req.BasePrice;

        st.MovieId = movie.Id;
        st.RoomId = room.Id;
        st.StartAt = startUtc;
        await _db.SaveChangesAsync(ct);

        if (priceChanged)
        {
            foreach (var ss in st.Seats.Where(x => ShowtimeSeatStatus.IsAvailable(x.Status)))
                ss.Price = req.BasePrice;
            await _db.SaveChangesAsync(ct);
        }

        return Ok(new { st.Id });
    }

    // ======= DELETE =======
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var st = await _db.Showtimes.Include(s => s.Seats).FirstOrDefaultAsync(s => s.Id == id, ct);
        if (st is null) return NotFound();
        foreach (var ss in st.Seats.Where(x => ShowtimeSeatStatus.IsAvailable(x.Status)))
            return Conflict("Cannot delete: there are booked seats.");

        _db.ShowtimeSeats.RemoveRange(st.Seats);
        _db.Showtimes.Remove(st);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    // ======= BULK CREATE =======
    [HttpPost("bulk")]
    public async Task<IActionResult> BulkCreate([FromBody] BulkReq req, CancellationToken ct)
    {
        if (req.Items is null || req.Items.Count == 0) return BadRequest("Items is required.");

        var tz = TimeZoneInfo.FindSystemTimeZoneById(
            OperatingSystem.IsWindows() ? "SE Asia Standard Time" : "Asia/Bangkok");

        var movieIds = req.Items.Select(i => i.MovieId).Distinct().ToArray();
        var roomIds = req.Items.Select(i => i.RoomId).Distinct().ToArray();

        var movies = await _db.Movies.Where(m => movieIds.Contains(m.Id)).ToDictionaryAsync(m => m.Id, ct);
        var rooms = await _db.Rooms.Include(r => r.Cinema).Include(r => r.Seats)
                                    .Where(r => roomIds.Contains(r.Id))
                                    .ToDictionaryAsync(r => r.Id, ct);

        var existing = await _db.Showtimes.Include(s => s.Movie)
                                          .Where(s => roomIds.Contains(s.RoomId))
                                          .ToListAsync(ct);

        var created = new List<object>();
        var skipped = new List<object>();

        using var tx = await _db.Database.BeginTransactionAsync(ct);

        foreach (var (item, idx) in req.Items.Select((x, i) => (x, i)))
        {
            if (!movies.TryGetValue(item.MovieId, out var movie))
            {
                skipped.Add(new { index = idx, reason = "Movie not found", item });
                continue;
            }
            if (!rooms.TryGetValue(item.RoomId, out var room))
            {
                skipped.Add(new { index = idx, reason = "Room not found", item });
                continue;
            }
            if (item.BasePrice < 0)
            {
                skipped.Add(new { index = idx, reason = "BasePrice must be >= 0", item });
                continue;
            }

            var startUtc = TimeZoneInfo.ConvertTimeToUtc(
                DateTime.SpecifyKind(item.StartAt, DateTimeKind.Unspecified), tz);
            var endUtc = startUtc.AddMinutes(movie.DurationMin + 15);

            var overlap = existing.Any(s =>
                s.RoomId == room.Id &&
                s.StartAt < endUtc &&
                s.StartAt.AddMinutes(s.Movie!.DurationMin + 15) > startUtc);

            if (overlap)
            {
                skipped.Add(new { index = idx, reason = "Overlap", at = startUtc });
                continue;
            }

            var st = new Cinema.Data.Model.Showtimes.Showtime
            {
                MovieId = movie.Id,
                RoomId = room.Id,
                StartAt = startUtc
            };
            _db.Showtimes.Add(st);
            await _db.SaveChangesAsync(ct);

            var ss = room.Seats.Select(seat => new Cinema.Data.Model.Showtimes.ShowtimeSeat
            {
                ShowtimeId = st.Id,
                SeatId = seat.Id,
                Status = "Available",
                Price = item.BasePrice
            });
            await _db.ShowtimeSeats.AddRangeAsync(ss, ct);
            await _db.SaveChangesAsync(ct);

            existing.Add(new Cinema.Data.Model.Showtimes.Showtime
            {
                Id = st.Id,
                MovieId = movie.Id,
                RoomId = room.Id,
                StartAt = startUtc,
                Movie = movie
            });

            created.Add(new { st.Id, st.MovieId, st.RoomId, StartAtUtc = startUtc, BasePrice = item.BasePrice });
        }

        await tx.CommitAsync(ct);

        return Ok(new { createdCount = created.Count, skippedCount = skipped.Count, created, skipped });
    }

    // ======= LOOKUPS =======
    [HttpGet("/api/admin/lookups/movies")]
    public async Task<IActionResult> MoviesLookup(CancellationToken ct)
        => Ok(await _db.Movies.OrderBy(m => m.Title).Select(m => new { m.Id, m.Title, m.DurationMin }).ToListAsync(ct));

    [HttpGet("/api/admin/lookups/cinemas")]
    public async Task<IActionResult> CinemasLookup(CancellationToken ct)
        => Ok(await _db.Cinemas.OrderBy(c => c.Name).Select(c => new { c.Id, c.Name }).ToListAsync(ct));

    [HttpGet("/api/admin/lookups/rooms")]
    public async Task<IActionResult> RoomsLookup([FromQuery] int cinemaId, CancellationToken ct)
        => Ok(await _db.Rooms.Where(r => r.CinemaId == cinemaId).OrderBy(r => r.Name).Select(r => new { r.Id, r.Name }).ToListAsync(ct));
}
