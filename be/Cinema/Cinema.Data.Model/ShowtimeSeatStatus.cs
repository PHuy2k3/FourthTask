using System;

namespace Cinema.Data.Model.Showtimes;

public static class ShowtimeSeatStatus
{
    public const string Available = "Available";
    public const string Locked = "Locked";
    public const string Booked = "Booked";
    public const string Sold = "Sold";
    public const string Reserved = "Reserved";

    public static bool IsAvailable(string? status) =>
        string.Equals(status, Available, StringComparison.OrdinalIgnoreCase);

    public static bool IsLocked(string? status) =>
        string.Equals(status, Locked, StringComparison.OrdinalIgnoreCase);

    public static bool IsBooked(string? status) =>
        string.Equals(status, Booked, StringComparison.OrdinalIgnoreCase)
        || string.Equals(status, Sold, StringComparison.OrdinalIgnoreCase)
        || string.Equals(status, Reserved, StringComparison.OrdinalIgnoreCase);
}