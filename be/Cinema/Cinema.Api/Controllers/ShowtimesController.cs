using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cinema.Biz.Irepo;
using Cinema.Data;
using System.ComponentModel.DataAnnotations;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/showtimes")]
public class ShowtimesController : ControllerBase
{
    private readonly IShowtimeRepository _showtimes;
    private readonly AppDbContext _db;

    public ShowtimesController(IShowtimeRepository showtimes, AppDbContext db)
    {
        _showtimes = showtimes;
        _db = db;
    }

    // GET /api/showtimes?date=2025-10-02&movieId=&cinemaId=
    [HttpGet]
    public async Task<IActionResult> Query(
        [FromQuery] DateTime? date,
        [FromQuery] int? movieId,
        [FromQuery] int? cinemaId,
        CancellationToken ct)
    {
        var data = await _showtimes.QueryAsync(date, movieId, cinemaId, ct);
        return Ok(data);
    }

    // GET /api/showtimes/123  -> seat map (ShowtimeSeats + Seat + Movie + Room + Cinema)
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
    {
        var st = await _db.Showtimes
            .Include(x => x.Movie)
            .Include(x => x.Room)!.ThenInclude(r => r.Cinema)
            .Include(x => x.Seats)!.ThenInclude(ss => ss.Seat)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (st is null) return NotFound("Showtime not found.");

        var dto = new
        {
            st.Id,
            st.StartAt, // <-- dùng StartAt theo model hiện có
            Movie = new { st.Movie!.Id, st.Movie.Title, st.Movie.DurationMin },
            Room = new
            {
                st.Room!.Id,
                st.Room.Name,
                Cinema = new { st.Room.Cinema!.Id, st.Room.Cinema.Name }
            },
            Seats = st.Seats
                .OrderBy(ss => ss.Seat!.Code)
                .Select(ss => new
                {
                    ss.Id,
                    ss.SeatId,
                    ss.ShowtimeId,
                    ss.Status,       // "Available" | "Locked" | "Booked"
                    ss.LockedUntil,  // theo model hiện có
                    ss.Price,
                    Seat = new { ss.Seat!.Id, ss.Seat.Code, ss.Seat.Type }
                })
        };

        return Ok(dto);
    }

    public record LockSeatsReq(
        [Required] int ShowtimeId,
        [Required] IReadOnlyCollection<int> SeatIds,
        int LockSeconds = 300
    );

    // POST /api/showtimes/lock-seats
    [HttpPost("lock-seats")]
    public async Task<IActionResult> LockSeats([FromBody] LockSeatsReq req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        if (req.SeatIds is null || req.SeatIds.Count == 0)
            return BadRequest("SeatIds is required.");

        var exists = await _db.Showtimes.AnyAsync(s => s.Id == req.ShowtimeId, ct);
        if (!exists) return NotFound("Showtime not found.");

        var lockSeconds = Math.Max(30, req.LockSeconds);

        // Repo hiện tại trả bool
        var ok = await _showtimes.LockSeatsAsync(req.ShowtimeId, req.SeatIds, lockSeconds, ct);

        if (!ok)
            return Conflict("Cannot lock selected seats.");

        return Ok(new
        {
            locked = true,
            untilUtc = DateTime.UtcNow.AddSeconds(lockSeconds)
        });
    }
}
