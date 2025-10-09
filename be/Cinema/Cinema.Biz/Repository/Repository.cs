using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Cinema.Data;
using Cinema.Biz.Irepo;

namespace Cinema.Biz.Repo;
public class Repository<T>(AppDbContext db) : IRepository<T> where T : class
{
    protected readonly AppDbContext _db = db;
    protected DbSet<T> Set => _db.Set<T>();
    public Task<T?> GetAsync(int id, CancellationToken ct) => Set.FindAsync([id], ct).AsTask();
    public Task<List<T>> ListAsync(Expression<Func<T, bool>>? p, CancellationToken ct)
        => (p is null ? Set : Set.Where(p)).ToListAsync(ct);
    public Task AddAsync(T e, CancellationToken ct) => Set.AddAsync(e, ct).AsTask();
    public void Update(T e) => Set.Update(e);
    public void Remove(T e) => Set.Remove(e);
}