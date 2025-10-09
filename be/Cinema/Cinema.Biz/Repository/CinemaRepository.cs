using Cinema.Biz.Irepo;
using Cinema.Data;

namespace Cinema.Biz.Repo;
public class CinemaRepository(AppDbContext db)
    : Repository<Cinema.Data.Model.Cinemas.Cinema>(db), ICinemaRepository
{ }