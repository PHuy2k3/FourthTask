using Cinema.Data.Model.Seats;
using System;
namespace Cinema.Biz.Irepo;
public interface ISeatRepository : IRepository<Seat>
{
    Task<List<Seat>> ListByRoomAsync(int roomId, CancellationToken ct);
}