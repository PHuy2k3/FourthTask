using System.Text;
using System.Text.Json.Serialization;
using Cinema.Biz.Irepo;
using Cinema.Biz.Repo;
using Cinema.Data;
using Cinema.Security;
using Cinema.Web;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var b = WebApplication.CreateBuilder(args);
var cfg = b.Configuration;

// 1) DB
b.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlServer(cfg.GetConnectionString("Default")));

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

app.MapControllers();

// 8) Seed Admin 1 lần (dev) + đảm bảo DB sẵn
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
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

app.Run();
