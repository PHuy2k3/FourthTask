using System.Data;
using Cinema.Biz.Irepo;
using Cinema.Data;
using Cinema.Data.Model.Bookings;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Biz.Repo;

public class BookingRepository(AppDbContext db) : Repository<Booking>(db), IBookingRepository
{
    public async Task<Booking> CreateFromLockedSeatsAsync(
        int userId,
        int showtimeId,
        IReadOnlyCollection<int> showtimeSeatIds,
        CancellationToken ct)
    {
        var seatIds = showtimeSeatIds.Distinct().ToArray();
        if (seatIds.Length == 0)
            throw new InvalidOperationException("Không có ghế hợp lệ để đặt.");

        await using var tx = await _db.Database.BeginTransactionAsync(IsolationLevel.Serializable, ct);
        try
        {
            var now = DateTime.UtcNow;

            const string releaseExpiredLocksSql =
                "UPDATE ShowtimeSeats " +
                "SET Status='Available', LockedUntil=NULL " +
                "WHERE ShowtimeId={0} AND Status='Locked' AND LockedUntil<{1}";

            await _db.Database.ExecuteSqlRawAsync(releaseExpiredLocksSql, [showtimeId, now], ct);

            var seats = await _db.ShowtimeSeats
                .Where(x => x.ShowtimeId == showtimeId && seatIds.Contains(x.Id))
                .OrderBy(x => x.Id)
                .ToListAsync(ct);

            if (seats.Count != seatIds.Length)
                throw new InvalidOperationException("Một hoặc nhiều ghế đã không còn khả dụng.");

            foreach (var seat in seats)
            {
                if (seat.Status == "Booked")
                    throw new InvalidOperationException("Một hoặc nhiều ghế đã được đặt trước đó.");

                if (seat.Status == "Locked" && seat.LockedUntil.HasValue && seat.LockedUntil.Value < now)
                {
                    seat.Status = "Available";
                    seat.LockedUntil = null;
                }
            }

            if (seats.Any(s => s.Status != "Available" && s.Status != "Locked"))
                throw new InvalidOperationException("Ghế đã được giữ hoặc phiên giữ ghế đã hết hạn.");

            var blockingStatuses = new[] { "Pending", "Paid" };
            var alreadyBookedSeatIds = await _db.BookingItems
                .Where(x => seatIds.Contains(x.ShowtimeSeatId) && blockingStatuses.Contains(x.Booking.Status))
                .Select(x => x.ShowtimeSeatId)
                .ToArrayAsync(ct);

            if (alreadyBookedSeatIds.Length > 0)
                throw new InvalidOperationException("Một hoặc nhiều ghế đã được đặt trước đó.");

            foreach (var seat in seats)
            {
                seat.Status = "Booked";
                seat.LockedUntil = null;
            }

            var amount = seats.Sum(s => s.Price);
            var orderCode = $"ORD{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}{Random.Shared.Next(100, 999)}";
            var booking = new Booking
            {
                UserId = userId,
                ShowtimeId = showtimeId,
                Status = "Pending",
                OrderCode = orderCode,
                Amount = amount
            };

            _db.Bookings.Add(booking);

            foreach (var seat in seats)
            {
                _db.BookingItems.Add(new BookingItem
                {
                    Booking = booking,
                    ShowtimeSeatId = seat.Id,
                    Price = seat.Price
                });
            }

            await _db.SaveChangesAsync(ct);
            await tx.CommitAsync(ct);
            return booking;
        }
        catch
        {
            await tx.RollbackAsync(ct);
            throw;
        }
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