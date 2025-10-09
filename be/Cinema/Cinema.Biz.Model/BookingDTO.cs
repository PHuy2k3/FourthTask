namespace Cinema.Biz.Model.Bookings;
public record CreateBookingRequest(int ShowtimeId, List<int> ShowtimeSeatIds);
public record BookingView(int Id, string OrderCode, decimal Amount, string Status);

