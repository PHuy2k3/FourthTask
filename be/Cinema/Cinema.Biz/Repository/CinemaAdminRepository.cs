// Cinema.Biz/Admin/CinemaAdminRepository.cs
using Cinema.Data;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Biz.Admin;

public class CinemaAdminRepository : ICinemaAdminRepository
{
    private readonly AppDbContext _db;
    // private readonly IUserContext _user; // nếu cần check role ở đây

    public CinemaAdminRepository(AppDbContext db/*, IUserContext user*/)
    {
        _db = db;
        // _user = user;
    }

    public async Task<IReadOnlyList<CinemaDto>> ListAsync(CancellationToken ct)
        => await _db.Cinemas
            .OrderBy(x => x.Name)
            .Select(x => new CinemaDto(x.Id, x.Name, x.Address))
            .ToListAsync(ct);

    public async Task<CinemaDto?> GetAsync(int id, CancellationToken ct)
        => await _db.Cinemas
            .Where(x => x.Id == id)
            .Select(x => new CinemaDto(x.Id, x.Name, x.Address))
            .FirstOrDefaultAsync(ct);

    public async Task<CinemaDto> CreateAsync(CreateCinema cmd, CancellationToken ct)
    {
        EnsureAllowed(); // check quyền ở đây nếu cần
        var name = NormalizeName(cmd.Name);
        ValidateName(name);

        // unique theo tên (có thể chỉnh insensitive nếu muốn)
        var exists = await _db.Cinemas.AnyAsync(x => x.Name == name, ct);
        if (exists) throw new ConflictException("Cinema name already exists.");

        var entity = new Cinema.Data.Model.Cinemas.Cinema { Name = name, Address = cmd.Address?.Trim() };
        _db.Cinemas.Add(entity);
        await _db.SaveChangesAsync(ct);

        return new CinemaDto(entity.Id, entity.Name, entity.Address);
    }

    public async Task<CinemaDto?> UpdateAsync(int id, UpdateCinema cmd, CancellationToken ct)
    {
        EnsureAllowed();
        var entity = await _db.Cinemas.FindAsync([id], ct);
        if (entity is null) return null;

        var name = NormalizeName(cmd.Name);
        ValidateName(name);

        var duplicate = await _db.Cinemas.AnyAsync(x => x.Id != id && x.Name == name, ct);
        if (duplicate) throw new ConflictException("Cinema name already exists.");

        entity.Name = name;
        entity.Address = cmd.Address?.Trim();
        await _db.SaveChangesAsync(ct);

        return new CinemaDto(entity.Id, entity.Name, entity.Address);
    }

    public async Task<DeleteResult> DeleteAsync(int id, CancellationToken ct)
    {
        EnsureAllowed();
        var entity = await _db.Cinemas.Include(x => x.Rooms).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return DeleteResult.NotFound;
        if (entity.Rooms.Any()) return DeleteResult.Conflict;

        _db.Cinemas.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return DeleteResult.Ok;
    }

    // ====== Logic (nằm trong Biz) ======
    private static string NormalizeName(string raw) => raw?.Trim() ?? string.Empty;

    private static void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ValidationException("Name is required.");
        if (name.Length > 200)
            throw new ValidationException("Name must be <= 200 characters.");
    }

    private void EnsureAllowed()
    {
        // ví dụ:
        // if (!_user.IsInRole("Admin")) throw new ForbiddenException();
        // hoặc để trống nếu hiện tại chưa dùng auth.
    }
}
