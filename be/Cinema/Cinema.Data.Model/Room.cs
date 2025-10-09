using Cinema.Data.Model.Seats;
using Cinema.Data.Model.Showtimes;
using CinemaModel = Cinema.Data.Model.Cinemas.Cinema;

namespace Cinema.Data.Model.Rooms;

public class Room
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int CinemaId { get; set; }
    public CinemaModel Cinema { get; set; } = null!;   
    public ICollection<Seat> Seats { get; set; } = [];
    public ICollection<Showtime> Showtimes { get; set; } = [];
}
