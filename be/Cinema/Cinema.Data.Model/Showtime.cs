using Cinema.Data.Model.Movies;
using Cinema.Data.Model.Rooms;
namespace Cinema.Data.Model.Showtimes;
public class Showtime
{
    public int Id { get; set; }
    public int MovieId { get; set; }
    public Movie Movie { get; set; } = null!;
    public int RoomId { get; set; }
    public Room Room { get; set; } = null!;
    public DateTime StartAt { get; set; }
    public ICollection<ShowtimeSeat> Seats { get; set; } = [];
    public decimal BasePrice { get; set; }

}
