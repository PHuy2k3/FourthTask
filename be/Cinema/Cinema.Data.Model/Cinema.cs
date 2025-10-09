namespace Cinema.Data.Model.Cinemas;
public class Cinema
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Address { get; set; } = "";
    public ICollection<Rooms.Room> Rooms { get; set; } = [];
}
