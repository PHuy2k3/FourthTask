using Cinema.Biz.Irepo;
using Cinema.Data;
using Cinema.Data.Model.Movies;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Biz.Repo;
public class MovieRepository(AppDbContext db) : Repository<Movie>(db), IMovieRepository
{
    public Task<List<Movie>> SearchAsync(string? q, CancellationToken ct)
    {
        var query = _db.Movies.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q)) query = query.Where(x => x.Title.Contains(q));
        return query.OrderBy(x => x.Title).ToListAsync(ct);
    }
}