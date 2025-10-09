using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cinema.Data;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/admin/movies")]
// TẠM THỜI mở ẩn danh để test 404 vs 401. Khi OK thì đổi lại [Authorize(Roles = "Admin")]
[AllowAnonymous]
public class AdminMoviesController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminMoviesController(AppDbContext db) => _db = db;

    public record MovieReq(string Title, int DurationMin, string? Genres, string? PosterUrl, string? TrailerUrl);

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken ct)
        => Ok(await _db.Movies
            .OrderBy(m => m.Id)
            .Select(m => new { m.Id, m.Title, m.DurationMin, m.Genres, m.PosterUrl, m.TrailerUrl })
            .ToListAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
    {
        var m = await _db.Movies.FindAsync([id], ct);
        return m is null ? NotFound() : Ok(new { m.Id, m.Title, m.DurationMin, m.Genres, m.PosterUrl, m.TrailerUrl });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MovieReq req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.Title)) return BadRequest("Title is required");
        var m = new Cinema.Data.Model.Movies.Movie
        {
            Title = req.Title.Trim(),
            DurationMin = req.DurationMin,
            Genres = req.Genres,
            PosterUrl = req.PosterUrl,
            TrailerUrl = req.TrailerUrl
        };
        _db.Movies.Add(m);
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(Get), new { id = m.Id }, new { m.Id, m.Title, m.DurationMin, m.Genres });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] MovieReq req, CancellationToken ct)
    {
        var m = await _db.Movies.FindAsync([id], ct);
        if (m is null) return NotFound();
        if (string.IsNullOrWhiteSpace(req.Title)) return BadRequest("Title is required");

        m.Title = req.Title.Trim();
        m.DurationMin = req.DurationMin;
        m.Genres = req.Genres;
        m.PosterUrl = req.PosterUrl;
        m.TrailerUrl = req.TrailerUrl;
        await _db.SaveChangesAsync(ct);
        return Ok(new { m.Id, m.Title, m.DurationMin, m.Genres });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var m = await _db.Movies.FindAsync([id], ct);
        if (m is null) return NotFound();
        _db.Movies.Remove(m);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }
}
