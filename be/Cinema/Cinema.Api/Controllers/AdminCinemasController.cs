using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Cinema.Data;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/admin/cinemas")]
// TẠM: [AllowAnonymous] để test 404. Khi thấy route rồi, đổi lại [Authorize(Roles = "Admin")]
[AllowAnonymous]
public class AdminCinemasController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminCinemasController(AppDbContext db) => _db = db;

    public record CinemaReq([Required] string Name, string? Address);

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken ct)
        => Ok(await _db.Cinemas
            .OrderBy(c => c.Name)
            .Select(c => new { c.Id, c.Name, c.Address })
            .ToListAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
    {
        var c = await _db.Cinemas.FindAsync([id], ct);
        return c is null ? NotFound() : Ok(new { c.Id, c.Name, c.Address });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CinemaReq req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var name = req.Name.Trim();
        if (await _db.Cinemas.AnyAsync(x => x.Name == name, ct))
            return Conflict("Cinema name already exists.");

        var c = new Cinema.Data.Model.Cinemas.Cinema { Name = name, Address = req.Address };
        _db.Cinemas.Add(c);
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(Get), new { id = c.Id }, new { c.Id, c.Name, c.Address });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CinemaReq req, CancellationToken ct)
    {
        var c = await _db.Cinemas.FindAsync([id], ct);
        if (c is null) return NotFound();

        var name = req.Name.Trim();
        if (await _db.Cinemas.AnyAsync(x => x.Id != id && x.Name == name, ct))
            return Conflict("Cinema name already exists.");

        c.Name = name;
        c.Address = req.Address;
        await _db.SaveChangesAsync(ct);
        return Ok(new { c.Id, c.Name, c.Address });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var c = await _db.Cinemas.Include(x => x.Rooms).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (c is null) return NotFound();
        if (c.Rooms.Any())
            return Conflict("Cannot delete a cinema that still has rooms.");
        _db.Cinemas.Remove(c);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }
}
