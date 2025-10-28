using Cinema.Biz.Irepo;
using Cinema.Data;
using Cinema.Data.Model.Bookings;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Biz.Repo;
public class BookingRepository(AppDbContext db) : Repository<Booking>(db), IBookingRepository
{
    public async Task<Booking> CreateFromLockedSeatsAsync(int userId, int showtimeId, IReadOnlyCollection<int> showtimeSeatIds, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        await _db.Database.ExecuteSqlRawAsync(
            $"UPDATE ShowtimeSeats SET Status='Available', LockedUntil=NULL WHERE ShowtimeId={{0}} AND Status='Locked' AND LockedUntil<{{1}}",
            [showtimeId, now], ct);

        var seatIds = showtimeSeatIds.Distinct().ToArray();
        var seats = await _db.ShowtimeSeats
             .Where(x => x.ShowtimeId == showtimeId && seatIds.Contains(x.Id))
            .ToListAsync(ct);
        if (seats.Count != seatIds.Length)
            throw new InvalidOperationException("Một hoặc nhiều ghế đã không còn khả dụng.");
        if (seats.Any(s => s.Status != "Locked"))
            throw new InvalidOperationException("Ghế đã được giữ hoặc phiên giữ ghế đã hết hạn.");

        var blockingStatuses = new[] { "Pending", "Paid" };
        var alreadyBookedSeatIds = await _db.BookingItems
            .Where(x => seatIds.Contains(x.ShowtimeSeatId)
                        && blockingStatuses.Contains(x.Booking.Status))
            .Select(x => x.ShowtimeSeatId)
            .ToArrayAsync(ct);
        if (alreadyBookedSeatIds.Length > 0)
            throw new InvalidOperationException("Một hoặc nhiều ghế đã được đặt trước đó.");

        var amount = seats.Sum(s => s.Price);
        using var tx = await _db.Database.BeginTransactionAsync(ct);
        try
        {
            foreach (var s in seats) { s.Status = "Booked"; s.LockedUntil = null; }

            var orderCode = $"ORD{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}{Random.Shared.Next(100, 999)}";
            var bk = new Booking
            {
                UserId = userId,
                ShowtimeId = showtimeId,
                Status = "Pending",
                OrderCode = orderCode,
                Amount = amount
            };

            _db.Bookings.Add(bk);
            await _db.SaveChangesAsync(ct);

            var items = seats.Select(seat => new BookingItem
            {
                BookingId = bk.Id,
                ShowtimeSeatId = seat.Id,
                Price = seat.Price
            });
            await _db.BookingItems.AddRangeAsync(items, ct);
            await _db.SaveChangesAsync(ct);

            await tx.CommitAsync(ct);
            return bk;
        }
        catch { await tx.RollbackAsync(ct); throw; }
    }

    public async Task<bool> MarkPaidAsync(string orderCode, CancellationToken ct)
    {
        var bk = await _db.Bookings.FirstOrDefaultAsync(x => x.OrderCode == orderCode, ct);
        if (bk is null) return false;
        if (bk.Status == "Paid") return true;
        bk.Status = "Paid";
        await _db.SaveChangesAsync(ct);
        return true;
    }
}