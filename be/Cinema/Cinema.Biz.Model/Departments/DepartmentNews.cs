using System.ComponentModel.DataAnnotations;

namespace Cinema.Biz.Model.Departments;

public record DepartmentNew(
    [property: Required, MinLength(1), MaxLength(32)] string Code,
    [property: Required, MinLength(1), MaxLength(128)] string Name,
    [property: MaxLength(512)] string? Description);