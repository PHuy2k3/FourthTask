using Microsoft.AspNetCore.Mvc;
using Cinema.Biz.Irepo;
using System.ComponentModel.DataAnnotations;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/showtimes")]
public class ShowtimesController : ControllerBase
{
    private readonly IShowtimeRepository _showtimes;

    public ShowtimesController(IShowtimeRepository showtimes)
    {
        _showtimes = showtimes;
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
        var dto = await _showtimes.GetDetailsAsync(id, ct);
        if (dto is null) return NotFound("Showtime not found.");
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
        var result = await _showtimes.LockSeatsAsync(req.ShowtimeId, req.SeatIds, req.LockSeconds, ct);

        return result.Error switch
        {
            LockSeatsError.InvalidSeatSelection => BadRequest("SeatIds is required."),
            LockSeatsError.ShowtimeNotFound => NotFound("Showtime not found."),
            LockSeatsError.CannotLock => Conflict("Cannot lock selected seats."),
            _ when result.Locked && result.LockedUntilUtc.HasValue => Ok(new
            {
                locked = true,
                untilUtc = result.LockedUntilUtc.Value
            }),
            _ => Conflict("Cannot lock selected seats.")
        };
    }
}
