using Cinema.Biz.Irepo;
using Cinema.Data;
using Cinema.Data.Model.Users;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Biz.Repo;
public class UserRepository(AppDbContext db) : Repository<User>(db), IUserRepository
{
    public Task<User?> GetByEmailAsync(string email, CancellationToken ct)
        => _db.Users.FirstOrDefaultAsync(x => x.Email == email, ct);
    public Task<bool> EmailExistsAsync(string email, CancellationToken ct)
        => _db.Users.AnyAsync(x => x.Email == email, ct);
}