using Microsoft.AspNetCore.Mvc;
using Cinema.Biz.Irepo;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/cinemas")]
public class CinemasController : ControllerBase
{
    private readonly ICinemaRepository _cinemas;
    public CinemasController(ICinemaRepository cinemas) => _cinemas = cinemas;

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken ct)
        => Ok(await _cinemas.ListAsync(null, ct));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
    {
        var x = await _cinemas.GetAsync(id, ct);
        return x is null ? NotFound() : Ok(x);
    }
}
