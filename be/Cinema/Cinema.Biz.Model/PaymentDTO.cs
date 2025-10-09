namespace Cinema.Biz.Model.Payments;
public record CreatePaymentRequest(int BookingId, string Provider);
