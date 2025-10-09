using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cinema.Data;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/admin/users")]
[AllowAnonymous] // TẠM THỜI; khi test xong đổi thành [Authorize(Roles = "Admin")]
public class AdminUsersController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminUsersController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken ct)
        => Ok(await _db.Users
            .OrderBy(u => u.Id)
            .Select(u => new { u.Id, u.Email, u.FullName, u.Role })
            .ToListAsync(ct));

    public record RoleReq(string Role);

    [HttpPut("{id:int}/role")]
    public async Task<IActionResult> SetRole(int id, [FromBody] RoleReq req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.Role)) return BadRequest("Role is required");
        var role = req.Role.Trim();
        if (role != "User" && role != "Admin") return BadRequest("Role must be User or Admin");

        var u = await _db.Users.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (u is null) return NotFound();

        u.Role = role;
        await _db.SaveChangesAsync(ct);
        return Ok(new { u.Id, u.Email, u.FullName, u.Role });
    }
}
