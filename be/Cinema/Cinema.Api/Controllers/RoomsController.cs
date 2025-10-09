using Microsoft.AspNetCore.Mvc;
using Cinema.Biz.Irepo;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/rooms")]
public class RoomsController : ControllerBase
{
    private readonly IRoomRepository _rooms;
    public RoomsController(IRoomRepository rooms) => _rooms = rooms;

    [HttpGet("by-cinema/{cinemaId:int}")]
    public async Task<IActionResult> ByCinema(int cinemaId, CancellationToken ct)
        => Ok(await _rooms.ListByCinemaAsync(cinemaId, ct));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
    {
        var x = await _rooms.GetAsync(id, ct);
        return x is null ? NotFound() : Ok(x);
    }
}
