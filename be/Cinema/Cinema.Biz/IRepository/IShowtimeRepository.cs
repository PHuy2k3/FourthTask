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
        // Lấy thông tin chi tiết của một suất chiếu
        Task<ShowtimeDetails?> GetDetailsAsync(int showtimeId, CancellationToken ct);

        // Khoá ghế: lockSeconds >= 30; trả kết quả chi tiết
        Task<LockSeatsResult> LockSeatsAsync(int showtimeId, IReadOnlyCollection<int>? seatIds, int lockSeconds, CancellationToken ct);
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
    public record ShowtimeDetails(
       int Id,
       System.DateTime StartAt,
       ShowtimeMovie Movie,
       ShowtimeRoom Room,
       IReadOnlyList<ShowtimeSeatDetails> Seats
   );

    public record ShowtimeMovie(int Id, string Title, int DurationMin);

    public record ShowtimeRoom(int Id, string Name, ShowtimeCinema Cinema);

    public record ShowtimeCinema(int Id, string Name);

    public record ShowtimeSeatDetails(
        int Id,
        int SeatId,
        int ShowtimeId,
        string Status,
        System.DateTime? LockedUntil,
        decimal Price,
        ShowtimeSeatInfo Seat
    );

    public record ShowtimeSeatInfo(int Id, string Code, string Type);

    public enum LockSeatsError
    {
        None = 0,
        InvalidSeatSelection,
        ShowtimeNotFound,
        CannotLock
    }

    public record LockSeatsResult(bool Locked, LockSeatsError Error, System.DateTime? LockedUntilUtc)
    {
        public static LockSeatsResult Success(System.DateTime lockedUntilUtc) => new(true, LockSeatsError.None, lockedUntilUtc);
        public static LockSeatsResult Fail(LockSeatsError error) => new(false, error, null);
    }
}
