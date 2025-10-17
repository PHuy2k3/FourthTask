using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Cinema.Security
{
    public class JwtOptions
    {
        public string Issuer { get; set; } = "cinema";
        public string Audience { get; set; } = "cinema";
        public string Key { get; set; } = "";
        public int ExpMinutes { get; set; } = 120;
    }
    public static class JwtTokenFactory
    {
        // Tương thích ngược
        public static string Create(JwtOptions opts, int userId, string email, string role)
            => Create(opts, userId, email, role, email);

        // Chuẩn có fullName
        public static string Create(JwtOptions opts, int userId, string email, string role, string fullName)
        {
            if (opts is null || string.IsNullOrWhiteSpace(opts.Key))
                throw new InvalidOperationException("Jwt:Key is missing.");

            var keyBytes = Encoding.UTF8.GetBytes(opts.Key);
            if (keyBytes.Length < 32)
                throw new InvalidOperationException($"Jwt key too short: {keyBytes.Length * 8} bits. Require >= 256 bits.");

            var securityKey = new SymmetricSecurityKey(keyBytes);
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("uid", userId.ToString()),
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim("name", string.IsNullOrWhiteSpace(fullName) ? email : fullName),
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(ClaimTypes.Role, role)
            };

            var jwt = new JwtSecurityToken(
                issuer: opts.Issuer,
                audience: opts.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(opts.ExpMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }
    }
}
