using System.Net.Http;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
namespace Cinema.Web;
public class ErrorHandlingMiddleware(RequestDelegate next)
{
    public async Task Invoke(HttpContext ctx)
    {
        try { await next(ctx); }
        catch (Exception ex)
        {
            ctx.Response.ContentType = "application/json";
            ctx.Response.StatusCode = StatusCodes.Status400BadRequest;
            await ctx.Response.WriteAsync(JsonSerializer.Serialize(new { error = ex.GetType().Name, message = ex.Message }));
        }
    }
}
