namespace Cinema.Data.Model.Movies;
public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string? PosterUrl { get; set; }
    public string? TrailerUrl { get; set; }
    public string? Genres { get; set; }
    public int DurationMin { get; set; }
    public ICollection<Showtimes.Showtime> Showtimes { get; set; } = [];
}
