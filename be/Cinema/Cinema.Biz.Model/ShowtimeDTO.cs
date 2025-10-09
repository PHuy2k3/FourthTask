namespace Cinema.Biz.Model.Showtimes;
public record LockSeatsRequest(int ShowtimeId, List<int> SeatIds, int LockSeconds = 300);
