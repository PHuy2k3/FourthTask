using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Cinema.Biz.Irepo;
using Cinema.Data;
using Cinema.Data.Model.Showtimes;
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

            var distinctSeatIds = seatIds.Distinct().ToArray();
            if (distinctSeatIds.Length == 0) 
                return false;

            var now = DateTime.UtcNow;
            var until = now.AddSeconds(Math.Max(30, lockSeconds));

            var seats = await _db.ShowtimeSeats
                .Where(ss => ss.ShowtimeId == showtimeId &&
                             (distinctSeatIds.Contains(ss.Id) || distinctSeatIds.Contains(ss.SeatId)))
                .ToListAsync(ct);

            if (seats.Count == 0)
                return false;

            var seatMatches = new Dictionary<int, ShowtimeSeat>();
            foreach (var ss in seats)
            {
                if (distinctSeatIds.Contains(ss.Id))
                {
                    if (seatMatches.TryGetValue(ss.Id, out var existing) && existing != ss)
                        return false; // ambiguous identifier

                    seatMatches[ss.Id] = ss;
                }

                if (distinctSeatIds.Contains(ss.SeatId))
                {
                    if (seatMatches.TryGetValue(ss.SeatId, out var existing) && existing != ss)
                        return false; // ambiguous identifier

                    seatMatches[ss.SeatId] = ss;
                }
            }

            if (seatMatches.Count != distinctSeatIds.Length)
                return false;

            var seatsToLock = seatMatches.Values.Distinct().ToList();
            if (seatsToLock.Count != seatMatches.Count)
                return false; // two identifiers pointing to the same seat

            if (seatsToLock.Any(ss =>
                    ShowtimeSeatStatus.IsBooked(ss.Status) ||
                    (ShowtimeSeatStatus.IsLocked(ss.Status) && ss.LockedUntil.HasValue && ss.LockedUntil.Value > now)))
            {
                return false;
            }

            foreach (var ss in seatsToLock)
            {
                ss.Status = ShowtimeSeatStatus.Locked;
                ss.LockedUntil = until;
            }

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
