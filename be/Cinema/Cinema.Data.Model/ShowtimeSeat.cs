using Cinema.Data.Model.Seats;
namespace Cinema.Data.Model.Showtimes;
public class ShowtimeSeat
{
    public int Id { get; set; }
    public int ShowtimeId { get; set; }
    public Showtime Showtime { get; set; } = null!;
    public int SeatId { get; set; }
    public Seat Seat { get; set; } = null!;
    public string Status { get; set; } = "Available"; // Available, Locked, Booked
    public DateTime? LockedUntil { get; set; }
    public decimal Price { get; set; }
}
