// Cinema.Api/Controllers/AdminCinemasController.cs
using Microsoft.AspNetCore.Mvc;
using Cinema.Biz.Admin;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/admin/cinemas")]
public class AdminCinemasController : ControllerBase
{
    private readonly ICinemaAdminRepository _biz;
    public AdminCinemasController(ICinemaAdminRepository biz) => _biz = biz;

    // Controller không dùng [Required]; để Biz validate
    public record CreateReq(string Name, string? Address);
    public record UpdateReq(string Name, string? Address);

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken ct)
        => Ok(await _biz.ListAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
        => (await _biz.GetAsync(id, ct)) is { } dto ? Ok(dto) : NotFound();

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReq req, CancellationToken ct)
    {
        try
        {
            var created = await _biz.CreateAsync(new CreateCinema(req.Name, req.Address), ct);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }
        catch (ValidationException ex) { return ValidationProblem(title: "Validation failed", detail: ex.Message); }
        catch (ConflictException ex) { return Conflict(ex.Message); }
        catch (ForbiddenException ex) { return StatusCode(403, ex.Message); }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateReq req, CancellationToken ct)
    {
        try
        {
            var updated = await _biz.UpdateAsync(id, new UpdateCinema(req.Name, req.Address), ct);
            return updated is null ? NotFound() : Ok(updated);
        }
        catch (ValidationException ex) { return ValidationProblem(title: "Validation failed", detail: ex.Message); }
        catch (ConflictException ex) { return Conflict(ex.Message); }
        catch (ForbiddenException ex) { return StatusCode(403, ex.Message); }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        try
        {
            var r = await _biz.DeleteAsync(id, ct);
            return r switch
            {
                DeleteResult.NotFound => NotFound(),
                DeleteResult.Conflict => Conflict("Cannot delete a cinema that still has rooms."),
                _ => NoContent()
            };
        }
        catch (ForbiddenException ex) { return StatusCode(403, ex.Message); }
    }
}
