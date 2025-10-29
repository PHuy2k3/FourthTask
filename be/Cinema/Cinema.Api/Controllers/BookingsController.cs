using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Linq;
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

        var seatIds = req.ShowtimeSeatIds.Where(id => id > 0).Distinct().ToArray();
        if (seatIds.Length == 0)
        {
            ModelState.AddModelError(nameof(CreateBookingReq.ShowtimeSeatIds), "Cần ít nhất một ghế hợp lệ.");
        }

        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var userIdValue = userId.Value;
        var userExists = await _db.Users.AnyAsync(u => u.Id == userIdValue, ct);
        if (!userExists)
            return BadRequest($"UserId {userIdValue} does not exist");

        var showtimeExists = await _db.Showtimes.AnyAsync(s => s.Id == req.ShowtimeId, ct);
        if (!showtimeExists)
            return BadRequest($"Showtime {req.ShowtimeId} does not exist");

        try
        {
            var booking = await _bookings.CreateFromLockedSeatsAsync(userIdValue, req.ShowtimeId, seatIds, ct);
            return Ok(new
            {
                booking.Id,
                booking.OrderCode,
                booking.Status,
                booking.Amount,
                booking.ShowtimeId,
                booking.UserId,
                Seats = seatIds
            });
        }
        catch (InvalidOperationException ex)
        {
            return await BuildSeatConflictResponse(req.ShowtimeId, seatIds, ex.Message, ct);
        }
        catch (DbUpdateException)
        {
            return await BuildSeatConflictResponse(
                req.ShowtimeId,
                seatIds,
                "Không thể hoàn tất đặt vé vì dữ liệu không hợp lệ hoặc ghế đã được giữ.",
                ct);
        }
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

    private async Task<IActionResult> BuildSeatConflictResponse(
        int showtimeId,
        IReadOnlyCollection<int> seatIds,
        string fallbackMessage,
        CancellationToken ct)
    {
        var seatDetails = await _db.ShowtimeSeats
            .Where(s => s.ShowtimeId == showtimeId && seatIds.Contains(s.Id))
            .Select(s => new
            {
                s.Id,
                s.SeatId,
                SeatCode = s.Seat!.Code,
                s.Status
            })
            .ToListAsync(ct);

        var detailsById = seatDetails.ToDictionary(s => s.Id);

        var reasons = seatIds
            .Select(id =>
            {
                if (detailsById.TryGetValue(id, out var seat))
                {
                    var (reasonCode, reasonMessage) = MapSeatStatusToReason(seat.Status);
                    return new SeatConflictReason(
                        id,
                        seat.SeatId,
                        seat.SeatCode,
                        seat.Status,
                        reasonCode,
                        reasonMessage);
                }

                return new SeatConflictReason(
                    id,
                    null,
                    null,
                    "Missing",
                    "missing",
                    "Ghế không tồn tại trong suất chiếu.");
            })
            .ToList();

        var message = ResolveConflictMessage(reasons, fallbackMessage);

        return Conflict(new
        {
            message,
            reasons = reasons.Select(r => new
            {
                showtimeSeatId = r.ShowtimeSeatId,
                seatId = r.SeatId,
                seatCode = r.SeatCode,
                status = r.Status,
                reasonCode = r.ReasonCode,
                reasonMessage = r.ReasonMessage
            })
        });
    }

    private static (string ReasonCode, string ReasonMessage) MapSeatStatusToReason(string status)
    {
        return status switch
        {
            "Booked" => ("booked", "Ghế đã được đặt trước đó."),
            "Locked" => ("locked", "Ghế đang được giữ bởi người dùng khác."),
            "Available" => ("available", "Ghế hiện đang khả dụng. Vui lòng thử lại thao tác đặt."),
            _ => ("unknown", "Trạng thái ghế không xác định."),
        };
    }

    private static string ResolveConflictMessage(
        IReadOnlyCollection<SeatConflictReason> reasons,
        string fallbackMessage)
    {
        if (reasons.Any(r => r.ReasonCode == "booked"))
            return "Một hoặc nhiều ghế đã được đặt trước đó.";

        if (reasons.Any(r => r.ReasonCode == "locked"))
            return "Ghế đã được giữ hoặc phiên giữ ghế đã hết hạn.";

        if (reasons.Any(r => r.ReasonCode == "missing"))
            return "Một hoặc nhiều ghế không tồn tại trong suất chiếu.";

        return fallbackMessage;
    }

    private sealed record SeatConflictReason(
        int ShowtimeSeatId,
        int? SeatId,
        string? SeatCode,
        string Status,
        string ReasonCode,
        string ReasonMessage);
}