using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cinema.Biz.Irepo;
using Cinema.Data;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/bookings")]
public class BookingsController : ControllerBase
{
    private readonly IBookingRepository _bookings;
    private readonly AppDbContext _db;

    public BookingsController(IBookingRepository bookings, AppDbContext db)
    {
        _bookings = bookings; _db = db;
    }

    public record CreateBookingReq(
            [Required, Range(1, int.MaxValue)] int ShowtimeId,
            [Required, MinLength(1)] IReadOnlyCollection<int> ShowtimeSeatIds,
            int? UserId);    
    // POST /api/bookings
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingReq req, CancellationToken ct)
    {
        var userId = req.UserId;
        if (userId is null)
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(claim, out var parsed) || parsed <= 0)
            {
                ModelState.AddModelError(nameof(CreateBookingReq.UserId), "UserId must be greater than zero");
            }
            else
            {
                userId = parsed;
            }
        }
        else if (userId <= 0)
        {
            ModelState.AddModelError(nameof(CreateBookingReq.UserId), "UserId must be greater than zero");
        }

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var userIdValue = userId.Value;
        var userExists = await _db.Users.AnyAsync(u => u.Id == userIdValue, ct); 
        if (!userExists)
            return BadRequest($"UserId {userIdValue} does not exist");

        var booking = await _bookings.CreateFromLockedSeatsAsync(userIdValue, req.ShowtimeId, req.ShowtimeSeatIds, ct);
        return Ok(new
        {
            booking.Id,
            booking.OrderCode,
            booking.Status,
            booking.Amount,
            booking.ShowtimeId,
            booking.UserId
        });
    }

    // GET /api/bookings/me?userId=123  (tạm thời)
    [HttpGet("me")]
    public async Task<IActionResult> MyBookings([FromQuery] int userId, CancellationToken ct)
    {
        if (userId <= 0) return BadRequest("userId required");
        var data = await _db.Bookings
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.Id)
            .Select(b => new {
                b.Id,
                b.OrderCode,
                b.Status,
                b.Amount,
                b.CreatedAt,
                Movie = b.Showtime!.Movie!.Title,
                StartAt = b.Showtime!.StartAt,
                Room = b.Showtime!.Room!.Name,
                Cinema = b.Showtime!.Room!.Cinema!.Name
            })
            .ToListAsync(ct);

        return Ok(data);
    }
}
