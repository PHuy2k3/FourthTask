using Cinema.Api.Common;     // chứa GlobalExceptionFilter
using Cinema.Biz.Admin;      // chứa ICinemaAdminRepository, CinemaAdminRepository
using Cinema.Biz.Common;     // chứa ValidationException, ConflictException, ForbiddenException
using Cinema.Data;           // chứa AppDbContext
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// -------------------- CONFIG DATABASE --------------------
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    var conn = builder.Configuration.GetConnectionString("Default")
                ?? "Server=.;Database=CinemaDb;Trusted_Connection=True;TrustServerCertificate=True";
    opt.UseSqlServer(conn);
});

// -------------------- DEPENDENCY INJECTION --------------------
builder.Services.AddScoped<ICinemaAdminRepository, CinemaAdminRepository>();

// -------------------- CONTROLLERS + GLOBAL EXCEPTION FILTER --------------------
builder.Services.AddControllers(opt =>
{
    opt.Filters.Add<GlobalExceptionFilter>();  // Gom toàn bộ exception ra đây để log
});

// -------------------- PROBLEMDETAILS CHO MODELSTATE --------------------
builder.Services.Configure<ApiBehaviorOptions>(opt =>
{
    opt.InvalidModelStateResponseFactory = ctx =>
    {
        var problem = new ValidationProblemDetails(ctx.ModelState)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Validation failed",
            Type = "error/validation",
            Instance = ctx.HttpContext.Request?.Path.Value
        };

        problem.Extensions["traceId"] = ctx.HttpContext.TraceIdentifier;
        return new BadRequestObjectResult(problem);
    };
});

// -------------------- CORS (TÙY CHỌN) --------------------
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowAll", p =>
        p.AllowAnyOrigin()
         .AllowAnyHeader()
         .AllowAnyMethod());
});

// -------------------- SWAGGER --------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// -------------------- MIDDLEWARE PIPELINE --------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseRouting();

// nếu có Auth thì mở
// app.UseAuthentication();
// app.UseAuthorization();

app.MapControllers();

app.Run();
