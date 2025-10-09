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

    public record CreateBookingReq(int ShowtimeId, IReadOnlyCollection<int> ShowtimeSeatIds, int? UserId);

    // POST /api/bookings
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingReq req, CancellationToken ct)
    {
        if (req.ShowtimeSeatIds is null || req.ShowtimeSeatIds.Count == 0)
            return BadRequest("ShowtimeSeatIds is required");

        // TODO: lấy userId từ JWT claims; tạm chấp nhận UserId gửi kèm cho dev nhanh
        var userId = req.UserId ?? 0;
        if (userId <= 0)
        {
            // nếu chưa có auth, có thể tạo guest user hoặc trả lỗi:
            return BadRequest("UserId is required (or enable JWT and take from claims).");
        }

        var booking = await _bookings.CreateFromLockedSeatsAsync(userId, req.ShowtimeId, req.ShowtimeSeatIds, ct);
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
