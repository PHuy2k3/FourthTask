using System.ComponentModel.DataAnnotations;

namespace Cinema.Biz.Model.Bookings;
public record CreateBookingRequest(
    [property: Range(1, int.MaxValue)] int ShowtimeId,
    [property: Range(1, int.MaxValue, ErrorMessage = "UserId must be greater than zero")] int UserId,
    List<int> ShowtimeSeatIds);
public record BookingView(int Id, string OrderCode, decimal Amount, string Status);