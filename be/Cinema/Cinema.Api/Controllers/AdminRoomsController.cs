using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using Cinema.Data;
using Cinema.Data.Model.Seats;
using Cinema.Data.Model.Showtimes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/admin/rooms")]
[AllowAnonymous]
public class AdminRoomsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminRoomsController(AppDbContext db) => _db = db;

    public record RoomReq(
        [Required] string Name,
        [Required] int CinemaId,
        [Range(0, 1_000)] int SeatCount);

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] int cinemaId, CancellationToken ct)
    {
        var cinema = await _db.Cinemas.FindAsync([cinemaId], ct);
        if (cinema is null) return NotFound("Cinema not found.");

        var rooms = await _db.Rooms
            .Where(r => r.CinemaId == cinemaId)
            .OrderBy(r => r.Name)
            .Select(r => new
            {
                r.Id,
                r.Name,
                r.CinemaId,
                SeatCount = r.Seats.Count,
                ShowtimeCount = r.Showtimes.Count
            })
            .ToListAsync(ct);

        return Ok(rooms);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
    {
        var room = await _db.Rooms
            .Where(r => r.Id == id)
            .Select(r => new { r.Id, r.Name, r.CinemaId, SeatCount = r.Seats.Count })
            .FirstOrDefaultAsync(ct);

        return room is null ? NotFound() : Ok(room);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] RoomReq req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var cinema = await _db.Cinemas.FindAsync([req.CinemaId], ct);
        if (cinema is null) return NotFound("Cinema not found.");

        var name = req.Name.Trim();
        if (await _db.Rooms.AnyAsync(r => r.CinemaId == cinema.Id && r.Name == name, ct))
            return Conflict("Room name already exists for this cinema.");

        var room = new Cinema.Data.Model.Rooms.Room
        {
            Name = name,
            CinemaId = cinema.Id
        };

        _db.Rooms.Add(room);
        await _db.SaveChangesAsync(ct);

        if (req.SeatCount > 0)
        {
            var seats = BuildSeats(room.Id, Enumerable.Range(0, req.SeatCount));
            await _db.Seats.AddRangeAsync(seats, ct);
            await _db.SaveChangesAsync(ct);

            await EnsureShowtimeSeatsForNewSeats(room.Id, seats.Select(s => s.Id).ToArray(), ct);
        }

        return CreatedAtAction(nameof(Get), new { id = room.Id }, new { room.Id, room.Name, room.CinemaId, SeatCount = req.SeatCount });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] RoomReq req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var room = await _db.Rooms.Include(r => r.Seats).FirstOrDefaultAsync(r => r.Id == id, ct);
        if (room is null) return NotFound();

        var cinema = await _db.Cinemas.FindAsync([req.CinemaId], ct);
        if (cinema is null) return NotFound("Cinema not found.");

        var name = req.Name.Trim();
        if (await _db.Rooms.AnyAsync(r => r.Id != id && r.CinemaId == cinema.Id && r.Name == name, ct))
            return Conflict("Room name already exists for this cinema.");

        room.Name = name;
        room.CinemaId = cinema.Id;
        await _db.SaveChangesAsync(ct);

        var currentSeatCount = room.Seats.Count;
        var diff = req.SeatCount - currentSeatCount;

        if (diff > 0)
        {
            var seatsToAdd = BuildSeats(room.Id, Enumerable.Range(currentSeatCount, diff));
            await _db.Seats.AddRangeAsync(seatsToAdd, ct);
            await _db.SaveChangesAsync(ct);

            await EnsureShowtimeSeatsForNewSeats(room.Id, seatsToAdd.Select(s => s.Id).ToArray(), ct);
        }
        else if (diff < 0)
        {
            var seatsToRemove = room.Seats
                .OrderByDescending(s => s.Code)
                .Take(-diff)
                .ToList();

            var seatIds = seatsToRemove.Select(s => s.Id).ToArray();
            var relatedShowtimeSeats = await _db.ShowtimeSeats
                .Where(ss => seatIds.Contains(ss.SeatId))
                .ToListAsync(ct);

            if (relatedShowtimeSeats.Any(ss => !ShowtimeSeatStatus.IsAvailable(ss.Status)))
                return Conflict("Cannot reduce seat count: some seats have bookings or locks.");

            if (relatedShowtimeSeats.Count > 0)
                _db.ShowtimeSeats.RemoveRange(relatedShowtimeSeats);

            _db.Seats.RemoveRange(seatsToRemove);
            await _db.SaveChangesAsync(ct);
        }

        var seatCount = await _db.Seats.CountAsync(s => s.RoomId == room.Id, ct);

        return Ok(new { room.Id, room.Name, room.CinemaId, SeatCount = seatCount });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var room = await _db.Rooms
            .Include(r => r.Seats)
            .Include(r => r.Showtimes)
            .FirstOrDefaultAsync(r => r.Id == id, ct);
        if (room is null) return NotFound();
        if (room.Showtimes.Any()) return Conflict("Cannot delete a room that still has showtimes.");

        if (room.Seats.Any())
            _db.Seats.RemoveRange(room.Seats);

        _db.Rooms.Remove(room);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    private static List<Seat> BuildSeats(int roomId, IEnumerable<int> indexes)
    {
        var seats = new List<Seat>();
        foreach (var index in indexes)
        {
            seats.Add(new Seat
            {
                RoomId = roomId,
                Code = GenerateSeatCode(index),
                Type = "Standard",
                BasePrice = 0m
            });
        }

        return seats;
    }

    private static string GenerateSeatCode(int index)
    {
        const int seatsPerRow = 10;
        var rowIndex = index / seatsPerRow;
        var seatNumber = index % seatsPerRow + 1;
        return $"{ToRowLabel(rowIndex)}{seatNumber}";
    }

    private static string ToRowLabel(int rowIndex)
    {
        var sb = new StringBuilder();
        var value = rowIndex + 1;
        while (value > 0)
        {
            value--;
            sb.Insert(0, (char)('A' + (value % 26)));
            value /= 26;
        }

        return sb.ToString();
    }

    private async Task EnsureShowtimeSeatsForNewSeats(int roomId, IReadOnlyCollection<int> seatIds, CancellationToken ct)
    {
        if (seatIds.Count == 0) return;

        var showtimeInfos = await _db.Showtimes
            .Where(s => s.RoomId == roomId)
            .Select(s => new
            {
                s.Id,
                BasePrice = s.Seats.Select(x => (decimal?)x.Price).Min() ?? 0m
            })
            .ToListAsync(ct);

        if (showtimeInfos.Count == 0) return;

        var showtimeSeats = new List<ShowtimeSeat>();
        foreach (var showtime in showtimeInfos)
        {
            foreach (var seatId in seatIds)
            {
                showtimeSeats.Add(new ShowtimeSeat
                {
                    ShowtimeId = showtime.Id,
                    SeatId = seatId,
                    Status = ShowtimeSeatStatus.Available,
                    Price = showtime.BasePrice
                });
            }
        }

        if (showtimeSeats.Count == 0) return;

        await _db.ShowtimeSeats.AddRangeAsync(showtimeSeats, ct);
        await _db.SaveChangesAsync(ct);
    }
}