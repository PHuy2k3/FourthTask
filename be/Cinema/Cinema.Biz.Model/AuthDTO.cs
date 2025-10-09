namespace Cinema.Biz.Model.Auth;
public record RegisterReq(string Email, string Password, string FullName);
public record LoginReq(string Email, string Password);
public record TokenView(string AccessToken, DateTime ExpiresAt);
