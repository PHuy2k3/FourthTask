namespace Cinema.Biz.Admin;

using Cinema.Biz.Common;
using Cinema.Biz.Mappers;
using Cinema.Biz.Model.Departments;
using Cinema.Data;
using Microsoft.EntityFrameworkCore;

public class DepartmentAdminRepository : IAdminDepartmentsRepository
{
    private readonly AppDbContext _db;

    public DepartmentAdminRepository(AppDbContext db)
        => _db = db;

    public async Task<IReadOnlyList<DepartmentDto>> ListAsync(CancellationToken ct)
        => await _db.Departments
            .OrderBy(d => d.Name)
            .Select(d => new DepartmentDto(d.Id, d.Code, d.Name, d.Description))
            .ToListAsync(ct);

    public async Task<DepartmentDto?> GetAsync(int id, CancellationToken ct)
        => await _db.Departments
            .Where(d => d.Id == id)
            .Select(d => new DepartmentDto(d.Id, d.Code, d.Name, d.Description))
            .FirstOrDefaultAsync(ct);

    public async Task<DepartmentDto> CreateAsync(DepartmentNew model, CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(model);

        var normalized = Normalize(model);
        Validate(normalized);

        var exists = await _db.Departments.AnyAsync(d => d.Code == normalized.Code, ct);
        if (exists) throw new ConflictException("Department code already exists.");

        var entity = normalized.ToEntity();
        _db.Departments.Add(entity);
        await _db.SaveChangesAsync(ct);

        return new DepartmentDto(entity.Id, entity.Code, entity.Name, entity.Description);
    }

    private static DepartmentNew Normalize(DepartmentNew model)
    {
        var code = model.Code?.Trim() ?? string.Empty;
        var name = model.Name?.Trim() ?? string.Empty;
        var description = string.IsNullOrWhiteSpace(model.Description) ? null : model.Description.Trim();
        return model with { Code = code, Name = name, Description = description };
    }

    private static void Validate(DepartmentNew model)
    {
        if (string.IsNullOrWhiteSpace(model.Code))
            throw new ValidationException("Code is required.");
        if (model.Code.Length > 32)
            throw new ValidationException("Code must be at most 32 characters.");
        if (string.IsNullOrWhiteSpace(model.Name))
            throw new ValidationException("Name is required.");
        if (model.Name.Length > 128)
            throw new ValidationException("Name must be at most 128 characters.");
        if (model.Description is { Length: > 512 })
            throw new ValidationException("Description must be at most 512 characters.");
    }
}