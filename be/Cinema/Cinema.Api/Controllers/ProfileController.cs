using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cinema.Data;

namespace Cinema.Api.Controllers;

[ApiController]
[Authorize]                      // tạm có thể đổi thành [AllowAnonymous] để test sự tồn tại route
[Route("api/profile")]           // <-- CHÍNH XÁC: /api/profile
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _db;
    public ProfileController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken ct)
    {
        var uidStr = User.FindFirst("uid")?.Value;
        if (string.IsNullOrEmpty(uidStr)) return Unauthorized("Token missing uid claim.");
        if (!int.TryParse(uidStr, out var uid)) return Unauthorized("Invalid uid.");

        var u = await _db.Users
            .Where(x => x.Id == uid)
            .Select(x => new { x.Id, x.Email, x.FullName, x.Role })
            .FirstOrDefaultAsync(ct);

        return u is null ? NotFound() : Ok(u);
    }
}
