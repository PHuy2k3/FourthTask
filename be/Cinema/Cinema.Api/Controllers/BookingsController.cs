using System.Data;
using Cinema.Biz.Irepo;
using Cinema.Data;
using Cinema.Data.Model.Bookings;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Biz.Repo;

public class BookingRepository(AppDbContext _db) : Repository<Booking>(_db), IBookingRepository
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

            // 1) Dọn lock hết hạn
            await _db.Database.ExecuteSqlRawAsync(
                """
                UPDATE ss
                SET ss.Status='Available', ss.LockedUntil=NULL
                FROM ShowtimeSeats ss
                WHERE ss.ShowtimeId={0} AND ss.Status='Locked' AND ss.LockedUntil<{1}
                """,
                [showtimeId, now], ct);

            // 2) Row-lock các ghế mục tiêu (SQL Server hints)
            var sql = $@"
                SELECT *
                FROM ShowtimeSeats WITH (UPDLOCK, ROWLOCK, HOLDLOCK)
                WHERE ShowtimeId = {showtimeId} AND Id IN ({string.Join(",", seatIds)})
            ";

            var seats = await _db.ShowtimeSeats
                .FromSqlRaw(sql)
                .OrderBy(x => x.Id)
                .ToListAsync(ct);

            if (seats.Count != seatIds.Length)
                throw new InvalidOperationException("Một hoặc nhiều ghế không tồn tại trong suất chiếu.");

            // 3) Chỉ cho phép ghế Available (vì chưa có LockedByUserId)
            var invalid = seats.FirstOrDefault(s =>
                s.Status == "Booked"
                || (s.Status == "Locked" && s.LockedUntil.HasValue && s.LockedUntil.Value >= now));

            if (invalid != null)
                throw new InvalidOperationException("Ghế đã được giữ hoặc không khả dụng.");

            // 4) Đặt trạng thái Booked
            foreach (var s in seats)
            {
                s.Status = "Booked";
                s.LockedUntil = null;
            }

            var amount = seats.Sum(s => s.Price);

            // 🔹 Sinh mã order đơn giản, không cần Ulid
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
            foreach (var s in seats)
            {
                _db.BookingItems.Add(new BookingItem
                {
                    Booking = booking,
                    ShowtimeSeatId = s.Id,
                    Price = s.Price
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
        await using var tx = await _db.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted, ct);
        try
        {
            var bk = await _db.Bookings.FirstOrDefaultAsync(x => x.OrderCode == orderCode, ct);
            if (bk is null) return false;

            if (bk.Status == "Paid")
            {
                await tx.CommitAsync(ct);
                return true;
            }
            if (bk.Status != "Pending")
            {
                await tx.RollbackAsync(ct);
                return false;
            }

            bk.Status = "Paid";
            await _db.SaveChangesAsync(ct);
            await tx.CommitAsync(ct);
            return true;
        }
        catch
        {
            await tx.RollbackAsync(ct);
            throw;
        }
    }
}
