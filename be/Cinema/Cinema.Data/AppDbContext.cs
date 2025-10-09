using Microsoft.EntityFrameworkCore;
using Cinema.Data.Model.Users;
using Cinema.Data.Model.Movies;
using Cinema.Data.Model.Cinemas;
using Cinema.Data.Model.Rooms;
using Cinema.Data.Model.Seats;
using Cinema.Data.Model.Showtimes;
using Cinema.Data.Model.Bookings;
using Cinema.Data.Model.Payments;

namespace Cinema.Data;
public class AppDbContext(DbContextOptions<AppDbContext> opt) : DbContext(opt)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Movie> Movies => Set<Movie>();
    public DbSet<Cinema.Data.Model.Cinemas.Cinema> Cinemas => Set<Cinema.Data.Model.Cinemas.Cinema>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Seat> Seats => Set<Seat>();
    public DbSet<Showtime> Showtimes => Set<Showtime>();
    public DbSet<ShowtimeSeat> ShowtimeSeats => Set<ShowtimeSeat>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<BookingItem> BookingItems => Set<BookingItem>();
    public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>().HasIndex(x => x.Email).IsUnique();
        b.Entity<Seat>().HasIndex(x => new { x.RoomId, x.Code }).IsUnique();
        b.Entity<ShowtimeSeat>().HasIndex(x => new { x.ShowtimeId, x.SeatId }).IsUnique();
        b.Entity<ShowtimeSeat>().Property(x => x.Price).HasPrecision(18, 2);
        b.Entity<BookingItem>().Property(x => x.Price).HasPrecision(18, 2);
        b.Entity<Booking>().Property(x => x.Amount).HasPrecision(18, 2);
    }
}
