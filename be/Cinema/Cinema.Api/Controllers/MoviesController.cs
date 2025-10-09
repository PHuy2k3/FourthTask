using Microsoft.AspNetCore.Mvc;
using Cinema.Biz.Irepo;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/movies")]
public class MoviesController : ControllerBase
{
    private readonly IMovieRepository _movies;
    public MoviesController(IMovieRepository movies) => _movies = movies;

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? q, CancellationToken ct)
    {
        var data = await _movies.SearchAsync(q, ct);
        return Ok(data);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
    {
        var x = await _movies.GetAsync(id, ct);
        return x is null ? NotFound() : Ok(x);
    }
}
