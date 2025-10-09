using Cinema.Data.Model.Bookings;
namespace Cinema.Data.Model.Payments;
public class Payment
{
    public int Id { get; set; }
    public int BookingId { get; set; }
    public Booking Booking { get; set; } = null!;
    public string Provider { get; set; } = ""; // MoMo, VNPAY, VietQR
    public string ProviderTxnId { get; set; } = "";
    public string Status { get; set; } = "Init"; // Init, Succeeded, Failed
    public string RawCallback { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
