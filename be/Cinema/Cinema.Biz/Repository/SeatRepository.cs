using Cinema.Biz.Irepo;
using Cinema.Data;
using Cinema.Data.Model.Seats;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Biz.Repo;
public class SeatRepository(AppDbContext db) : Repository<Seat>(db), ISeatRepository
{
    public Task<List<Seat>> ListByRoomAsync(int roomId, CancellationToken ct)
        => _db.Seats.Where(s => s.RoomId == roomId).OrderBy(s => s.Code).ToListAsync(ct);
}