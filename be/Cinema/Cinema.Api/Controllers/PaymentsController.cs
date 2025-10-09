using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cinema.Data;
using Cinema.Biz.Irepo;

namespace Cinema.Api.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IBookingRepository _bookings;

    public PaymentsController(AppDbContext db, IBookingRepository bookings)
    { _db = db; _bookings = bookings; }

    public record PayReq(string Provider, string OrderCode, string ProviderTxnId, bool Success);

    // POST /api/payments/callback (giả lập IPN)
    [HttpPost("callback")]
    public async Task<IActionResult> Callback([FromBody] PayReq req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.OrderCode)) return BadRequest("OrderCode is required");
        _db.Payments.Add(new Cinema.Data.Model.Payments.Payment
        {
            BookingId = await _db.Bookings.Where(b => b.OrderCode == req.OrderCode).Select(b => b.Id).FirstOrDefaultAsync(ct),
            Provider = req.Provider,
            ProviderTxnId = req.ProviderTxnId,
            Status = req.Success ? "Succeeded" : "Failed",
            RawCallback = System.Text.Json.JsonSerializer.Serialize(req)
        });
        await _db.SaveChangesAsync(ct);

        if (req.Success) await _bookings.MarkPaidAsync(req.OrderCode, ct);
        return Ok(new { ok = true });
    }
}
