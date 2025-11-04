using Cinema.Biz.Model.Departments;
using Cinema.Data.Model.Departments;

namespace Cinema.Biz.Mappers;

public static class DepartmentMappingExtensions
{
    public static Department ToEntity(this DepartmentNew model)
    {
        ArgumentNullException.ThrowIfNull(model);
        return new Department
        {
            Code = model.Code.Trim(),
            Name = model.Name.Trim(),
            Description = string.IsNullOrWhiteSpace(model.Description)
                ? null
                : model.Description.Trim()
        };
    }
}