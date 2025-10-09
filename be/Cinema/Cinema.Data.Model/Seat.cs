using Cinema.Data.Model.Rooms;
namespace Cinema.Data.Model.Seats;
public class Seat
{
    public int Id { get; set; }
    public int RoomId { get; set; }
    public Room Room { get; set; } = null!;
    public string Code { get; set; } = ""; // A1, A2...
    public string Type { get; set; } = "Standard"; // VIP, Couple
    public decimal BasePrice { get; set; }
}
