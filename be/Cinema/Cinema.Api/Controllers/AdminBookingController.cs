using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cinema.Data;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/admin/bookings")]
[Authorize(Roles = "Admin")]
public class AdminBookingsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminBookingsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? status, CancellationToken ct)
    {
        var query = _db.Bookings
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new
            {
                b.Id,
                b.OrderCode,
                b.Status,
                b.Amount,
                b.CreatedAt,
                User = new
                {
                    b.UserId,
                    Name = b.User.FullName,
                    b.User.Email
                },
                Showtime = new
                {
                    b.ShowtimeId,
                    Movie = b.Showtime.Movie.Title,
                    StartAt = b.Showtime.StartAt,
                    Room = b.Showtime.Room.Name,
                    Cinema = b.Showtime.Room.Cinema.Name
                },
                Seats = b.Items
                    .OrderBy(i => i.Id)
                    .Select(i => new
                    {
                        Code = i.ShowtimeSeat.Seat.Code,
                        i.Price
                    })
                    .ToArray()
            })
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(b => b.Status == status);
        }

        var data = await query.ToListAsync(ct);
        return Ok(data);
    }

    [HttpPost("{id:int}/approve")]
    public async Task<IActionResult> Approve(int id, CancellationToken ct)
    {
        var booking = await _db.Bookings.FirstOrDefaultAsync(b => b.Id == id, ct);
        if (booking is null) return NotFound();
        if (booking.Status == "Paid") return Ok(new { booking.Id, booking.Status });
        if (booking.Status != "Pending") return BadRequest("Chỉ có thể duyệt vé đang ở trạng thái chờ duyệt.");

        booking.Status = "Paid";
        await _db.SaveChangesAsync(ct);
        return Ok(new { booking.Id, booking.Status });
    }

    [HttpPost("{id:int}/reject")]
    public async Task<IActionResult> Reject(int id, CancellationToken ct)
    {
        var booking = await _db.Bookings
            .Include(b => b.Items)
                .ThenInclude(i => i.ShowtimeSeat)
            .FirstOrDefaultAsync(b => b.Id == id, ct);
        if (booking is null) return NotFound();
        if (booking.Status == "Canceled") return Ok(new { booking.Id, booking.Status });
        if (booking.Status != "Pending") return BadRequest("Chỉ có thể huỷ vé đang ở trạng thái chờ duyệt.");

        booking.Status = "Canceled";
        foreach (var item in booking.Items)
        {
            item.ShowtimeSeat.Status = "Available";
            item.ShowtimeSeat.LockedUntil = null;
        }

        await _db.SaveChangesAsync(ct);
        return Ok(new { booking.Id, booking.Status });
    }
}