using Cinema.Data.Model.Movies;
namespace Cinema.Biz.Irepo;
public interface IMovieRepository : IRepository<Movie>
{
    Task<List<Movie>> SearchAsync(string? q, CancellationToken ct);
}