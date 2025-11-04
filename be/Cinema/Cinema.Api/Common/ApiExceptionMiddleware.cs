// Api/Common/ApiExceptionMiddleware.cs
using Cinema.Biz.Admin;
using Microsoft.AspNetCore.Mvc;
using System.Net;

public sealed class ApiExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ApiExceptionMiddleware> _logger;

    public ApiExceptionMiddleware(RequestDelegate next, ILogger<ApiExceptionMiddleware> logger)
        => (_next, _logger) = (next, logger);

    public async Task Invoke(HttpContext ctx)
    {
        try
        {
            await _next(ctx);
        }
        catch (Exception ex)
        {
            var (status, title, type, detail) = GlobalMap(ex);
            var traceId = ctx.TraceIdentifier;
            _logger.LogError(ex, "Unhandled exception. TraceId={TraceId}", traceId);

            ctx.Response.StatusCode = (int)status;
            ctx.Response.ContentType = "application/problem+json";

            var problem = new ProblemDetails
            {
                Status = (int)status,
                Title = title,
                Type = type,
                Detail = detail,
                Instance = ctx.Request?.Path.Value
            };
            problem.Extensions["traceId"] = traceId;

            await ctx.Response.WriteAsJsonAsync(problem);
        }
    }

    static (HttpStatusCode, string, string, string?) GlobalMap(Exception ex) => ex switch
    {
        ValidationException vex => (HttpStatusCode.BadRequest, "Validation failed", "error/validation", vex.Message),
        ConflictException cex => (HttpStatusCode.Conflict, "Conflict", "error/conflict", cex.Message),
        ForbiddenException fex => (HttpStatusCode.Forbidden, "Forbidden", "error/forbidden", fex.Message),
        KeyNotFoundException knf => (HttpStatusCode.NotFound, "Not Found", "error/not-found", knf.Message),
        _ => (HttpStatusCode.InternalServerError, "Server Error", "error/server", null)
    };
}
