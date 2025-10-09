using System.Linq.Expressions;
namespace Cinema.Biz.Irepo;
public interface IRepository<T> where T : class
{
    Task<T?> GetAsync(int id, CancellationToken ct);
    Task<List<T>> ListAsync(Expression<Func<T, bool>>? predicate, CancellationToken ct);
    Task AddAsync(T entity, CancellationToken ct);
    void Update(T entity);
    void Remove(T entity);
}