using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Cinema.Data;
using Cinema.Data.Model.Users;
using Cinema.Biz.Irepo;

namespace Cinema.Biz.Repo
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AppDbContext _db;
        private readonly PasswordHasher<object> _hasher = new();

        public AuthRepository(AppDbContext db) => _db = db;

        public async Task<int> RegisterAsync(string email, string password, string fullName, CancellationToken ct)
        {
            var e = email.Trim().ToLowerInvariant();
            if (await _db.Users.AnyAsync(u => u.Email == e, ct))
                throw new InvalidOperationException("Email already exists");

            var user = new User
            {
                Email = e,
                FullName = fullName,
                Role = "User",
                PasswordHash = _hasher.HashPassword(null!, password)
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync(ct);
            return user.Id;
        }

        public async Task<(int userId, string email, string role, string fullName)?> VerifyAsync(
            string email, string password, CancellationToken ct)
        {
            var e = email.Trim().ToLowerInvariant();
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == e, ct);
            if (user is null) return null;

            var res = _hasher.VerifyHashedPassword(null!, user.PasswordHash, password);
            if (res == PasswordVerificationResult.Failed) return null;

            return (user.Id, user.Email, user.Role, user.FullName);
        }
    }
}
