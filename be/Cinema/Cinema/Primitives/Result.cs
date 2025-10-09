namespace Cinema.Primitives;
public readonly record struct Error(string Code, string Message);
public readonly struct Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public Error? Error { get; }
    private Result(T value) { IsSuccess = true; Value = value; Error = null; }
    private Result(Error error) { IsSuccess = false; Value = default; Error = error; }
    public static Result<T> Ok(T v) => new(v);
    public static Result<T> Fail(string c, string m) => new(new Error(c, m));
}
