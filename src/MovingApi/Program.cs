using System;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MovingApi.Data;
using MovingApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Configuration
var configuration = builder.Configuration;

// Add services
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        configuration.GetConnectionString("DefaultConnection") ?? "Server=localhost,1433;Database=MovingDb;User=sa;Password=Your_password123;TrustServerCertificate=true;",
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null
        )
    )
);

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 6;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// JWT
var jwtKey = configuration["Jwt:Key"] ?? "super_secret_dev_key_please_change";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = configuration["Jwt:Issuer"] ?? "movingapp",
        ValidAudience = configuration["Jwt:Audience"] ?? "movingapp_client",
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
    };
});

builder.Services.AddScoped<TokenService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new { status = "Healthy" }));

app.MapControllers();

// Ensure database is migrated and seed roles/admin
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var db = services.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    var userManager = services.GetRequiredService<UserManager<IdentityUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

    // ensure roles
    var roles = new[] { "Admin", "User" };
    foreach (var role in roles)
    {
        if (!roleManager.RoleExistsAsync(role).GetAwaiter().GetResult())
            roleManager.CreateAsync(new IdentityRole(role)).GetAwaiter().GetResult();
    }

    // seed admin
    var adminEmail = configuration["Seed:AdminEmail"] ?? "admin@example.com";
    var adminPassword = configuration["Seed:AdminPassword"] ?? "Admin123!";
    var admin = userManager.FindByEmailAsync(adminEmail).GetAwaiter().GetResult();
    if (admin == null)
    {
        admin = new IdentityUser { UserName = adminEmail, Email = adminEmail };
        var r = userManager.CreateAsync(admin, adminPassword).GetAwaiter().GetResult();
        if (r.Succeeded)
        {
            userManager.AddToRoleAsync(admin, "Admin").GetAwaiter().GetResult();
        }
    }

    try
    {
        DbInitializer.Initialize(db);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.Run();
