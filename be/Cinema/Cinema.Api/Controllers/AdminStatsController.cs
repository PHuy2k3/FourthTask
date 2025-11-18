using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cinema.Data; // chỉnh namespace nếu khác
using System.Collections.Generic;

namespace Cinema.Api.Controllers
{
    [ApiController]
    [Route("api/admin/stats")]
    // nếu bạn muốn thử nhanh mà không cần auth, comment dòng dưới:
    // [Authorize(Roles = "Admin")]
    public class AdminStatsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AdminStatsController(AppDbContext db) => _db = db;

        [HttpGet("overview")]
        public async Task<IActionResult> Overview()
        {
            var now = DateTime.UtcNow;
            var todayStart = now.Date;
            var monthStart = new DateTime(now.Year, now.Month, 1);

            var totalBookings = await _db.Bookings.CountAsync();
            var pendingBookings = await _db.Bookings.CountAsync(b => b.Status == "Pending");
            var paidBookings = await _db.Bookings.CountAsync(b => b.Status == "Paid");

            var todayRevenue = await _db.Bookings
                .Where(b => b.Status == "Paid" && b.CreatedAt >= todayStart)
                .SumAsync(b => (long?)b.Amount) ?? 0L;

            var monthRevenue = await _db.Bookings
                .Where(b => b.Status == "Paid" && b.CreatedAt >= monthStart)
                .SumAsync(b => (long?)b.Amount) ?? 0L;

            var totalRevenue = await _db.Bookings
                .Where(b => b.Status == "Paid")
                .SumAsync(b => (long?)b.Amount) ?? 0L;

            return Ok(new
            {
                totalBookings,
                todayRevenue,
                monthRevenue,
                totalRevenue,
                pendingBookings,
                paidBookings
            });
        }

        [HttpGet("sales")]
        public async Task<IActionResult> Sales([FromQuery] int days = 30)
        {
            if (days <= 0) days = 30;
            var end = DateTime.UtcNow.Date;
            var start = end.AddDays(-(days - 1));

            var query = await _db.Bookings
                .Where(b => b.Status == "Paid" && b.CreatedAt >= start && b.CreatedAt < end.AddDays(1))
                .AsNoTracking()
                .GroupBy(b => b.CreatedAt.Date)
                .Select(g => new { Date = g.Key, Revenue = g.Sum(x => (long?)x.Amount) ?? 0L })
                .ToListAsync();

            var result = new List<object>();
            for (var d = start; d <= end; d = d.AddDays(1))
            {
                var matched = query.FirstOrDefault(q => q.Date == d);
                result.Add(new { date = d.ToString("yyyy-MM-dd"), revenue = matched?.Revenue ?? 0L });
            }

            return Ok(result);
        }

        [HttpGet("recent-bookings")]
        public async Task<IActionResult> RecentBookings([FromQuery] int limit = 10)
        {
            if (limit <= 0) limit = 10;

            // NOTE: We avoid referencing Booking.UserName directly because the Booking model in your project doesn't have that property.
            // We return id, orderCode, userId (if exists), amount, status, createdAt.
            // If you want the actual user name, see notes below to join with Users table.
            var data = await _db.Bookings
                .AsNoTracking()
                .OrderByDescending(b => b.CreatedAt)
                .Take(limit)
                .Select(b => new {
                    id = b.Id,
                    orderCode = b.OrderCode,
                    // attempt to include UserId if present - change property name if your model uses different name
                    userId = EF.Property<int?>(b, "UserId"),
                    amount = b.Amount,
                    status = b.Status,
                    createdAt = b.CreatedAt
                })
                .ToListAsync();

            return Ok(data);
        }
    }
}
