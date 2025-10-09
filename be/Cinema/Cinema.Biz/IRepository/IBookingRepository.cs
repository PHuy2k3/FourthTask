using Cinema.Data.Model.Bookings;
namespace Cinema.Biz.Irepo;
public interface IBookingRepository : IRepository<Booking>
{
    Task<Booking> CreateFromLockedSeatsAsync(int userId, int showtimeId, IReadOnlyCollection<int> showtimeSeatIds, CancellationToken ct);
    Task<bool> MarkPaidAsync(string orderCode, CancellationToken ct);
}