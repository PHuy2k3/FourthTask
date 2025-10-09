namespace Cinema.Time;
public interface IAppClock { DateTime UtcNow { get; } }
public sealed class SystemClock : IAppClock { public DateTime UtcNow => DateTime.UtcNow; }
