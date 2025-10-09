using Cinema.Data.Model.Showtimes;
using Cinema.Data.Model.Users;
namespace Cinema.Data.Model.Bookings;
public class Booking
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int ShowtimeId { get; set; }
    public Showtime Showtime { get; set; } = null!;
    public string Status { get; set; } = "Pending"; // Pending, Paid, Failed, Canceled
    public string OrderCode { get; set; } = "";
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<BookingItem> Items { get; set; } = [];
}
