using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cinema.Biz.Admin;
using Cinema.Biz.Common;
using Cinema.Biz.Model.Departments;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/admin/departments")]
[Authorize(Roles = "Admin")]
public class AdminDepartmentsController : ControllerBase
{
    private readonly IAdminDepartmentsRepository _biz;

    public AdminDepartmentsController(IAdminDepartmentsRepository biz) => _biz = biz;

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken ct)
        => Ok(await _biz.ListAsync(ct));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
        => (await _biz.GetAsync(id, ct)) is { } department ? Ok(department) : NotFound();

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] DepartmentNew model, CancellationToken ct)
    {
        try
        {
            var created = await _biz.CreateAsync(model, ct);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }
        catch (ValidationException ex) { return ValidationProblem(title: "Validation failed", detail: ex.Message); }
        catch (ConflictException ex) { return Conflict(ex.Message); }
        catch (ForbiddenException ex) { return StatusCode(403, ex.Message); }
    }
}