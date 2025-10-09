namespace Cinema.Primitives;
public sealed class PagedResult<T>
{
    public int Page { get; init; }
    public int Size { get; init; }
    public int TotalItems { get; init; }
    public int TotalPages => (int)Math.Ceiling((double)TotalItems / Size);
    public IReadOnlyList<T> Items { get; init; } = Array.Empty<T>();
    public static PagedResult<T> From(IEnumerable<T> items, int page, int size, int total)
        => new() { Page = page, Size = size, TotalItems = total, Items = items.ToList() };
}
