using Microsoft.AspNetCore.Mvc;
using Cinema.Biz.Irepo;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/seats")]
public class SeatsController : ControllerBase
{
    private readonly ISeatRepository _seats;
    public SeatsController(ISeatRepository seats) => _seats = seats;

    [HttpGet("by-room/{roomId:int}")]
    public async Task<IActionResult> ByRoom(int roomId, CancellationToken ct)
        => Ok(await _seats.ListByRoomAsync(roomId, ct));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
    {
        var x = await _seats.GetAsync(id, ct);
        return x is null ? NotFound() : Ok(x);
    }
}
