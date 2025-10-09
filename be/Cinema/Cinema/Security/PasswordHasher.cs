using System.Security.Cryptography;
namespace Cinema.Security;
public static class PasswordHasher
{
    public static string Hash(string password, int iter = 100_000)
    {
        using var rng = RandomNumberGenerator.Create();
        var salt = new byte[16]; rng.GetBytes(salt);
        var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iter, HashAlgorithmName.SHA256);
        var key = pbkdf2.GetBytes(32);
        return $"{iter}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(key)}";
    }
    public static bool Verify(string password, string hash)
    {
        var parts = hash.Split('.', 3);
        var iter = int.Parse(parts[0]);
        var salt = Convert.FromBase64String(parts[1]);
        var key = Convert.FromBase64String(parts[2]);
        var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iter, HashAlgorithmName.SHA256);
        var key2 = pbkdf2.GetBytes(32);
        return CryptographicOperations.FixedTimeEquals(key, key2);
    }
}
