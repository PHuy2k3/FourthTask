namespace Cinema.Biz.Admin;

public interface ICinemaAdminRepository
{
    Task<IReadOnlyList<CinemaDto>> ListAsync(CancellationToken ct);
    Task<CinemaDto?> GetAsync(int id, CancellationToken ct);
    Task<CinemaDto> CreateAsync(CreateCinema cmd, CancellationToken ct);     // throws ValidationException, ConflictException, ForbiddenException
    Task<CinemaDto?> UpdateAsync(int id, UpdateCinema cmd, CancellationToken ct); // throws ValidationException, ConflictException, ForbiddenException
    Task<DeleteResult> DeleteAsync(int id, CancellationToken ct);            // throws ForbiddenException
}

public record CinemaDto(int Id, string Name, string? Address);

// Command input do Biz tự validate, không dùng [Required] ở controller
public record CreateCinema(string Name, string? Address);
public record UpdateCinema(string Name, string? Address);

public enum DeleteResult { Ok, NotFound, Conflict }

// Exception Biz (Domain/App level). Controller chỉ map sang HTTP.
public class ValidationException(string message) : Exception(message);
public class ConflictException(string message) : Exception(message);
public class ForbiddenException(string message = "Forbidden") : Exception(message);
