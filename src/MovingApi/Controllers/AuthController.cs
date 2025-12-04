using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MovingApi.Data;
using MovingApi.Services;
using OtpNet;
using System.Security.Claims;

namespace MovingApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly TokenService _tokenService;

    public AuthController(UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        RoleManager<IdentityRole> roleManager,
        TokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var user = new IdentityUser { UserName = dto.Email, Email = dto.Email };
        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);

        // ensure default role
        if (!await _roleManager.RoleExistsAsync("User")) await _roleManager.CreateAsync(new IdentityRole("User"));
        await _userManager.AddToRoleAsync(user, "User");

        return Ok(new { userId = user.Id, email = user.Email });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null) return Unauthorized();

        var pwd = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!pwd) return Unauthorized();

        // check mfa
        var mfaSecret = (await _userManager.GetClaimsAsync(user)).FirstOrDefault(c => c.Type == "mfa_secret")?.Value;
        var mfaEnabled = (await _userManager.GetClaimsAsync(user)).FirstOrDefault(c => c.Type == "mfa_enabled")?.Value == "true";

        if (mfaEnabled)
        {
            if (string.IsNullOrEmpty(dto.Totp) || string.IsNullOrEmpty(mfaSecret)) return Unauthorized(new { mfaRequired = true });
            var totp = new Totp(Base32Encoding.ToBytes(mfaSecret));
            if (!totp.VerifyTotp(dto.Totp, out long _, new VerificationWindow(2,2))) return Unauthorized(new { mfaRequired = true });
        }

        var roles = await _userManager.GetRolesAsync(user);
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
            new Claim(ClaimTypes.Email, user.Email ?? string.Empty)
        };
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        var token = _tokenService.GenerateToken(User, claims);
        return Ok(new { token });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null) return Ok(); // don't reveal

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        // For dev: return token in response
        return Ok(new { email = user.Email, resetToken = token });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null) return BadRequest();
        var result = await _userManager.ResetPasswordAsync(user, dto.Token, dto.NewPassword);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return Ok();
    }

    [HttpPost("enable-mfa")]
    public async Task<IActionResult> EnableMfa([FromBody] EnableMfaDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null) return BadRequest();

        var secret = KeyGeneration.GenerateRandomKey(20);
        var base32 = Base32Encoding.ToString(secret);
        // store as claim
        var claims = await _userManager.GetClaimsAsync(user);
        var existing = claims.FirstOrDefault(c => c.Type == "mfa_secret");
        if (existing != null) await _userManager.RemoveClaimAsync(user, existing);
        await _userManager.AddClaimAsync(user, new Claim("mfa_secret", base32));
        await _userManager.AddClaimAsync(user, new Claim("mfa_enabled", "false"));

        // return secret for provisioning URI generation on client
        return Ok(new { secret = base32 });
    }

    [HttpPost("verify-mfa")]
    public async Task<IActionResult> VerifyMfa([FromBody] VerifyMfaDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null) return BadRequest();
        var claims = await _userManager.GetClaimsAsync(user);
        var secret = claims.FirstOrDefault(c => c.Type == "mfa_secret")?.Value;
        if (string.IsNullOrEmpty(secret)) return BadRequest();

        var totp = new Totp(Base32Encoding.ToBytes(secret));
        if (!totp.VerifyTotp(dto.Code, out long _, new VerificationWindow(2,2))) return BadRequest(new { verified = false });

        // mark enabled
        var existing = claims.FirstOrDefault(c => c.Type == "mfa_enabled");
        if (existing != null) await _userManager.RemoveClaimAsync(user, existing);
        await _userManager.AddClaimAsync(user, new Claim("mfa_enabled", "true"));

        return Ok(new { verified = true });
    }
}

public record RegisterDto(string Email, string Password);
public record LoginDto(string Email, string Password, string? Totp);
public record ForgotDto(string Email);
public record ResetDto(string Email, string Token, string NewPassword);
public record EnableMfaDto(string Email);
public record VerifyMfaDto(string Email, string Code);
