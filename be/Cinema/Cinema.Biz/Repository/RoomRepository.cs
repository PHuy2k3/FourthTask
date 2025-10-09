using Cinema.Biz.Irepo;
using Cinema.Data;
using Cinema.Data.Model.Rooms;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Biz.Repo;
public class RoomRepository(AppDbContext db) : Repository<Room>(db), IRoomRepository
{
    public Task<List<Room>> ListByCinemaAsync(int cinemaId, CancellationToken ct)
        => _db.Rooms.Where(r => r.CinemaId == cinemaId).OrderBy(r => r.Name).ToListAsync(ct);
}