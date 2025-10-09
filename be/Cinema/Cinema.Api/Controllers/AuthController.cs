using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Cinema.Biz.Irepo;
using Cinema.Security;

namespace Cinema.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _auth;
        private readonly IOptions<JwtOptions> _jwt;

        public AuthController(IAuthRepository auth, IOptions<JwtOptions> jwt)
        {
            _auth = auth;
            _jwt = jwt;
        }

        public record RegisterReq(
            [Required, EmailAddress] string Email,
            [Required, MinLength(6)] string Password,
            [Required] string FullName);

        public record LoginReq(
            [Required, EmailAddress] string Email,
            [Required] string Password);

        public record TokenView(string AccessToken, DateTime ExpiresAtUtc);

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<TokenView>> Register([FromBody] RegisterReq req, CancellationToken ct)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var userId = await _auth.RegisterAsync(req.Email, req.Password, req.FullName, ct);

            var opts = _jwt.Value;
            if (string.IsNullOrWhiteSpace(opts.Key))
                return StatusCode(500, "JWT Key is not configured.");

            // Dùng ngay thông tin từ request: email chuẩn hoá + fullName + role mặc định
            var emailNorm = req.Email.Trim().ToLowerInvariant();
            var token = JwtTokenFactory.Create(opts, userId, emailNorm, "User", req.FullName);
            return Ok(new TokenView(token, DateTime.UtcNow.AddMinutes(opts.ExpMinutes)));
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<TokenView>> Login([FromBody] LoginReq req, CancellationToken ct)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var verified = await _auth.VerifyAsync(req.Email, req.Password, ct);
            if (verified is null) return Unauthorized("Invalid email or password");

            // LƯU Ý: deconstruct 4 biến
            var (userId, email, role, fullName) = verified.Value;

            var opts = _jwt.Value;
            if (string.IsNullOrWhiteSpace(opts.Key))
                return StatusCode(500, "JWT Key is not configured.");

            var token = JwtTokenFactory.Create(opts, userId, email, role, fullName);
            return Ok(new TokenView(token, DateTime.UtcNow.AddMinutes(opts.ExpMinutes)));
        }
    }
}
