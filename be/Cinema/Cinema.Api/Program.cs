using Cinema.Api.Common;
using System.Text;
using Cinema.Biz.Admin;
using Cinema.Biz.Common;
using Cinema.Biz.Irepo;
using Cinema.Biz.Repo;
using Cinema.Data;
using Cinema.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// -------------------- CONFIG DATABASE --------------------
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    var conn = builder.Configuration.GetConnectionString("Default")
                ?? "Server=.;Database=CinemaDb;Trusted_Connection=True;TrustServerCertificate=True";
    opt.UseSqlServer(conn);
});

// -------------------- OPTIONS --------------------
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

// -------------------- DEPENDENCY INJECTION --------------------
builder.Services.AddScoped<ICinemaAdminRepository, CinemaAdminRepository>();
builder.Services.AddScoped<IAdminDepartmentsRepository, DepartmentAdminRepository>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IShowtimeRepository, ShowtimeRepository>();
builder.Services.AddScoped<IBookingRepository>(sp =>
{
    var db = sp.GetRequiredService<AppDbContext>();
    return new BookingRepository(db);
});

// -------------------- CONTROLLERS + GLOBAL EXCEPTION FILTER --------------------
builder.Services.AddControllers(opt =>
{
    opt.Filters.Add<GlobalExceptionFilter>();
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

// -------------------- AUTHENTICATION + AUTHORIZATION --------------------
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSection.GetValue<string>(nameof(JwtOptions.Key)) ?? string.Empty;
if (Encoding.UTF8.GetByteCount(jwtKey) < 32)
{
    throw new InvalidOperationException("JWT key must be configured and at least 256 bits long.");
}

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection.GetValue<string>(nameof(JwtOptions.Issuer)),
            ValidAudience = jwtSection.GetValue<string>(nameof(JwtOptions.Audience)),
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();