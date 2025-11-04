namespace Cinema.Biz.Admin;

using Cinema.Biz.Model.Departments;

public interface IAdminDepartmentsRepository
{
    Task<IReadOnlyList<DepartmentDto>> ListAsync(CancellationToken ct);
    Task<DepartmentDto?> GetAsync(int id, CancellationToken ct);
    Task<DepartmentDto> CreateAsync(DepartmentNew model, CancellationToken ct); // throws ValidationException, ConflictException, ForbiddenException
}

public record DepartmentDto(int Id, string Code, string Name, string? Description);