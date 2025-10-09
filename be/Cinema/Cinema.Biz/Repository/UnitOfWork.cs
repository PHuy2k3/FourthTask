using Cinema.Data;
using Cinema.Biz.Irepo;

namespace Cinema.Biz.Repo;
public sealed class UnitOfWork(AppDbContext db) : IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken ct) => db.SaveChangesAsync(ct);
    public ValueTask DisposeAsync() => db.DisposeAsync();
}