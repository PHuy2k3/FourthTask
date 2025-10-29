using System.IO;
using System.Text;
using System.Text.Json.Serialization;
using Cinema.Biz.Irepo;
using Cinema.Biz.Repo;
using Cinema.Data;
using Cinema.Security;
using Cinema.Web;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var b = WebApplication.CreateBuilder(args);
var cfg = b.Configuration;
var env = b.Environment;

// 1) DB
var dbProvider = (cfg["DbProvider"] ?? "SqlServer").Trim();
var sqlServerCommandTimeout = cfg.GetValue<int?>("Database:CommandTimeoutSeconds");
b.Services.AddDbContext<AppDbContext>((_, o) =>
{
    var conn = cfg.GetConnectionString("Default");
    switch (dbProvider.ToLowerInvariant())
    {
        case "sqlite":
            {
                conn = NormalizeSqliteConnectionString(conn, env.ContentRootPath);
                o.UseSqlite(conn);
                break;
            }
        case "sqlserver":
        case "sql":
        case "mssql":
        case "sql-server":
            {
                if (string.IsNullOrWhiteSpace(conn))
                {
                    throw new InvalidOperationException("ConnectionStrings:Default must be configured for SQL Server.");
                }

                o.UseSqlServer(conn, sql =>
                {
                    if (sqlServerCommandTimeout is int timeoutSeconds and > 0)
                    {
                        sql.CommandTimeout(timeoutSeconds);
                    }

                    sql.EnableRetryOnFailure();
                });

                break;
            }
        default:
            throw new InvalidOperationException($"Unsupported DbProvider '{dbProvider}'. Use 'SqlServer' or 'Sqlite'.");
    }
});

// dotnet run2) Options
b.Services.Configure<JwtOptions>(cfg.GetSection("Jwt"));
var jwtKey = cfg["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey) || Encoding.UTF8.GetBytes(jwtKey).Length < 32)
{
    throw new InvalidOperationException("Jwt:Key must be >= 32 bytes (HS256).");
}

// 3) DI Repositories
b.Services.AddScoped<IUnitOfWork, UnitOfWork>();
b.Services.AddScoped<IUserRepository, UserRepository>();
b.Services.AddScoped<IAuthRepository, AuthRepository>();
b.Services.AddScoped<IMovieRepository, MovieRepository>();
b.Services.AddScoped<ICinemaRepository, CinemaRepository>();
b.Services.AddScoped<IRoomRepository, RoomRepository>();
b.Services.AddScoped<ISeatRepository, SeatRepository>();
b.Services.AddScoped<IShowtimeRepository, ShowtimeRepository>();
b.Services.AddScoped<IBookingRepository, BookingRepository>();

// 4) AuthN/AuthZ
b.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = cfg["Jwt:Issuer"],
            ValidAudience = cfg["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!)),
            ClockSkew = TimeSpan.Zero
        };
    });
b.Services.AddAuthorization();

// 5) Controllers + JSON: ignore cycles
b.Services.AddControllers().AddJsonOptions(o =>
{
    o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    // o.JsonSerializerOptions.PropertyNamingPolicy = null; // nếu muốn giữ PascalCase
});

// 6) Swagger + JWT “Authorize” button
b.Services.AddEndpointsApiExplorer();
b.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Cinema API", Version = "v1" });
    var scheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer {token}'",
        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
    };
    c.AddSecurityDefinition("Bearer", scheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        [scheme] = new List<string>()
    });
});

// 7) CORS (dev thoáng)
b.Services.AddCors();

var app = b.Build();
app.UseRouting();

// CORS phải chạy trước auth nếu bạn cần OPTIONS preflight thoáng
app.UseCors(p => p
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .SetIsOriginAllowed(_ => true));

app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseSwagger();
app.UseSwaggerUI();

// Nếu bạn CHỈ chạy HTTP (localhost:5285), có thể tắt dòng này để tránh redirect:
// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(e =>
{
    e.MapControllers();
});
// 8) Seed Admin 1 lần (dev) + đảm bảo DB sẵn
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    var ensureCreatedTimeout = cfg.GetValue<int?>("Database:EnsureCreatedCommandTimeoutSeconds") ?? 120;
    if (ensureCreatedTimeout > 0)
    {
        db.Database.SetCommandTimeout(TimeSpan.FromSeconds(ensureCreatedTimeout));
    }

    try
    {
        await db.Database.EnsureCreatedAsync();

        // Tạo tài khoản Admin mặc định nếu chưa có
        if (!db.Users.Any(u => u.Email == "admin@cinema.local"))
        {
            var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<object>();
            db.Users.Add(new Cinema.Data.Model.Users.User
            {
                Email = "admin@cinema.local",
                FullName = "Site Admin",
                Role = "Admin",
                PasswordHash = hasher.HashPassword(null!, "Admin@123")
            });
            await db.SaveChangesAsync();
            Console.WriteLine("Seeded admin: admin@cinema.local / Admin@123");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to initialise database using provider '{Provider}'. Check your connection string and database server.", dbProvider);
        throw;
    }
    finally
    {
        db.Database.SetCommandTimeout(null);
    }
}
app.Run();

static string NormalizeSqliteConnectionString(string? connectionString, string contentRootPath)
{
    const string dataSourcePrefix = "Data Source=";

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        var defaultPath = Path.Combine(contentRootPath, "App_Data", "cinema.db");
        EnsureDirectoryExists(defaultPath);
        return $"{dataSourcePrefix}{defaultPath}";
    }

    var trimmed = connectionString.Trim();

    if (!trimmed.Contains('=') && !trimmed.Contains(';'))
    {
        var fallbackPath = Path.Combine(contentRootPath, trimmed);
        EnsureDirectoryExists(fallbackPath);
        return $"{dataSourcePrefix}{fallbackPath}";
    }

    if (trimmed.StartsWith(dataSourcePrefix, StringComparison.OrdinalIgnoreCase))
    {
        var dataSourceValue = trimmed[dataSourcePrefix.Length..].Trim();
        if (!Path.IsPathRooted(dataSourceValue))
        {
            var fullPath = Path.Combine(contentRootPath, dataSourceValue);
            EnsureDirectoryExists(fullPath);
            return $"{dataSourcePrefix}{fullPath}";
        }
    }

    return trimmed;
}

static void EnsureDirectoryExists(string filePath)
{
    var directory = Path.GetDirectoryName(filePath);
    if (!string.IsNullOrEmpty(directory))
    {
        Directory.CreateDirectory(directory);
    }
}