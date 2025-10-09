namespace Cinema.Biz.Irepo
{
    public interface IAuthRepository
    {
        Task<int> RegisterAsync(string email, string password, string fullName, CancellationToken ct);

        // Trả đủ 4 phần tử: id, email, role, fullName
        Task<(int userId, string email, string role, string fullName)?> VerifyAsync(
            string email, string password, CancellationToken ct);
    }
}
