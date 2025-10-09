using Cinema.Data.Model.Showtimes;
namespace Cinema.Data.Model.Bookings;
public class BookingItem
{
    public int Id { get; set; }
    public int BookingId { get; set; }
    public Booking Booking { get; set; } = null!;
    public int ShowtimeSeatId { get; set; }
    public ShowtimeSeat ShowtimeSeat { get; set; } = null!;
    public decimal Price { get; set; }
}
