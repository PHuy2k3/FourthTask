using Cinema.Data;
using Cinema.Data.Model.Movies;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Biz.Repo;

/// <summary>
/// Provides data access helpers for administrative operations on <see cref="Movie"/> entities.
/// This class centralises the Entity Framework queries so that the API layer can keep its
/// controllers slim while the business layer owns the data logic.
/// </summary>
public class AdminMoviesRepository(AppDbContext db) : Repository<Movie>(db)
{

    public Task<List<Movie>> ListAsync(CancellationToken ct) => _db.Movies
        .OrderBy(m => m.Id)
        .ToListAsync(ct);

    public ValueTask<Movie?> FindAsync(int id, CancellationToken ct) => _db.Movies.FindAsync([id], ct);

    public async Task<Movie> AddAsync(Movie movie, CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(movie);

        _db.Movies.Add(movie);
        await _db.SaveChangesAsync(ct);
        return movie;
    }

    public async Task<Movie?> UpdateAsync(int id, Action<Movie> updater, CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(updater);

        var movie = await _db.Movies.FindAsync([id], ct);
        if (movie is null) return null;

        updater(movie);
        await _db.SaveChangesAsync(ct);
        return movie;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct)
    {
        var movie = await _db.Movies.FindAsync([id], ct);
        if (movie is null) return false;

        _db.Movies.Remove(movie);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}