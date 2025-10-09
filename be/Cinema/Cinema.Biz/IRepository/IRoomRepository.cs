using Cinema.Data.Model.Rooms;
namespace Cinema.Biz.Irepo;
public interface IRoomRepository : IRepository<Room>
{
    Task<List<Room>> ListByCinemaAsync(int cinemaId, CancellationToken ct);
}