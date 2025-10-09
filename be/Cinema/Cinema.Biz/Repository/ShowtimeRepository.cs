using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Cinema.Biz.Irepo;
using Cinema.Data;
using Microsoft.EntityFrameworkCore;

namespace Cinema.Biz.Repo
{
    public class ShowtimeRepository : IShowtimeRepository
    {
        private readonly AppDbContext _db;
        public ShowtimeRepository(AppDbContext db) => _db = db;

        public async Task<IReadOnlyList<ShowtimeListItem>> QueryAsync(
            DateTime? date, int? movieId, int? cinemaId, CancellationToken ct)
        {
            var q = _db.Showtimes
                .Include(s => s.Movie)
                .Include(s => s.Room)!.ThenInclude(r => r.Cinema)
                .Include(s => s.Seats)
                .AsQueryable();

            // --- Lọc theo ngày (local Asia/Bangkok -> UTC) ---
            if (date.HasValue)
            {
                // date.Value.Date là 00:00 (Unspecified). Ta coi đó là giờ địa phương VN.
                var localDay = DateTime.SpecifyKind(date.Value.Date, DateTimeKind.Unspecified);

                // Trên Windows dùng "SE Asia Standard Time". Nếu chạy Linux, đổi sang "Asia/Bangkok".
                var tz = ResolveSeAsiaTimeZone();
                var startUtc = TimeZoneInfo.ConvertTimeToUtc(localDay, tz);
                var endUtc = startUtc.AddDays(1);

                q = q.Where(s => s.StartAt >= startUtc && s.StartAt < endUtc);
            }
            else
            {
                // Mặc định: chỉ trả các suất chiếu sắp tới (từ bây giờ)
                var nowUtc = DateTime.UtcNow.AddMinutes(-5); // trừ 5' để nới tay
                q = q.Where(s => s.StartAt >= nowUtc);
            }

            if (movieId.HasValue) q = q.Where(s => s.MovieId == movieId.Value);
            if (cinemaId.HasValue) q = q.Where(s => s.Room!.CinemaId == cinemaId.Value);

            var data = await q
                .OrderBy(s => s.StartAt)
                .Select(s => new ShowtimeListItem(
                    s.Id,
                    s.MovieId,
                    s.Movie!.Title,
                    s.RoomId,
                    s.Room!.Name,
                    s.Room.Cinema!.Name,
                    s.StartAt,                                     // UTC
                    s.Seats.Select(x => (decimal?)x.Price).Min() ?? 0m // "base price" từ ghế
                ))
                .ToListAsync(ct);

            return data;
        }


        public async Task<bool> LockSeatsAsync(int showtimeId, IReadOnlyCollection<int> seatIds, int lockSeconds, CancellationToken ct)
        {
            if (seatIds == null || seatIds.Count == 0) return false;
            var now = DateTime.UtcNow;
            var until = now.AddSeconds(Math.Max(30, lockSeconds));

            var seatIdsArray = seatIds.ToArray();
            var seats = await _db.ShowtimeSeats
                .Where(ss => ss.ShowtimeId == showtimeId && (seatIdsArray.Contains(ss.SeatId) || seatIdsArray.Contains(ss.Id)))
                .ToListAsync(ct);

            int lockedCount = 0;
            foreach (var ss in seats)
            {
                var canLock =
                    ss.Status == "Available" ||
                    (ss.Status == "Locked" && (!ss.LockedUntil.HasValue || ss.LockedUntil.Value <= now));

                if (canLock)
                {
                    ss.Status = "Locked";
                    ss.LockedUntil = until;
                    lockedCount++;
                }
            }

            if (lockedCount == 0) return false;
            await _db.SaveChangesAsync(ct);
            return true;
        }

        private static TimeZoneInfo ResolveSeAsiaTimeZone()
        {
            const string windowsId = "SE Asia Standard Time";
            const string ianaId = "Asia/Bangkok";

            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById(windowsId);
            }
            catch (TimeZoneNotFoundException)
            {
                return TimeZoneInfo.FindSystemTimeZoneById(ianaId);
            }
            catch (InvalidTimeZoneException)
            {
                return TimeZoneInfo.FindSystemTimeZoneById(ianaId);
            }
        }
    }
}
