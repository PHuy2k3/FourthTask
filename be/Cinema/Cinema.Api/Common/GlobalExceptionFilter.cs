using System.Net;
using Cinema.Biz.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace Cinema.Api.Common // 👈 THÊM DÒNG NÀY
{
    public sealed class GlobalExceptionFilter : IExceptionFilter
    {
        private readonly ILogger<GlobalExceptionFilter> _logger;
        public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger)
            => _logger = logger;

        public void OnException(ExceptionContext context)
        {
            var (status, title, type, detail) = Map(context.Exception);
            var traceId = context.HttpContext.TraceIdentifier;

            _logger.LogError(context.Exception, "Unhandled exception. TraceId={TraceId}", traceId);

            var problem = new ProblemDetails
            {
                Status = (int)status,
                Title = title,
                Type = type,
                Detail = detail,
                Instance = context.HttpContext.Request?.Path.Value
            };
            problem.Extensions["traceId"] = traceId;

            context.Result = new ObjectResult(problem) { StatusCode = problem.Status };
            context.ExceptionHandled = true;
        }

        private static (HttpStatusCode, string, string, string?) Map(Exception ex)
            => ex switch
            {
                ValidationException vex => (HttpStatusCode.BadRequest, "Validation failed", "error/validation", vex.Message),
                ConflictException cex => (HttpStatusCode.Conflict, "Conflict", "error/conflict", cex.Message),
                ForbiddenException fex => (HttpStatusCode.Forbidden, "Forbidden", "error/forbidden", fex.Message),
                _ => (HttpStatusCode.InternalServerError, "Server Error", "error/server", null)
            };
    }
}
