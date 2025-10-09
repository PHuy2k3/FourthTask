namespace Cinema.Biz.Irepo;
public interface IUnitOfWork : IAsyncDisposable
{
    Task<int> SaveChangesAsync(CancellationToken ct);
}