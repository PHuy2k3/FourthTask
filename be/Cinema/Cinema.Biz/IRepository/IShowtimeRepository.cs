using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Cinema.Biz.Irepo
{
    public interface IShowtimeRepository
    {
        // Truy vấn danh sách suất chiếu (đơn giản để FE render)
        Task<IReadOnlyList<ShowtimeListItem>> QueryAsync(
            System.DateTime? date, int? movieId, int? cinemaId, CancellationToken ct);

        // Khoá ghế: lockSeconds >= 30; trả true nếu lock được >0 ghế
        Task<bool> LockSeatsAsync(int showtimeId, IReadOnlyCollection<int> seatIds, int lockSeconds, CancellationToken ct);
    }

    public record ShowtimeListItem(
        int Id,
        int MovieId,
        string MovieTitle,
        int RoomId,
        string RoomName,
        string CinemaName,
        System.DateTime StartAt,
        decimal BasePrice
    );
}
