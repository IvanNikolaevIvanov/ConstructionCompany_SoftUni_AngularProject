using ConstructionCompany.API.SeedDb;
using ConstructionCompany.Core.Contracts;
using ConstructionCompany.Core.Services;
using ConstructionCompany.Infrastructure.Data;
using ConstructionCompany.Infrastructure.Data.Common;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using PdfSharp.Fonts;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//Setting font resolver for generating pdf file
GlobalFontSettings.FontResolver = new CustomFontResolver();

builder.Services.AddDbContext<ConstructionCompanyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ConstructionCompanyDbContext>()
    .AddDefaultTokenProviders();


var jwtKey = builder.Configuration["Jwt:Key"];
var key = Encoding.UTF8.GetBytes(jwtKey);

JsonWebTokenHandler.DefaultInboundClaimTypeMap.Clear();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    //options.TokenHandlers.Clear();
    //options.TokenHandlers.Add(new JsonWebTokenHandler());
    options.RequireHttpsMetadata = false; // Okay for HTTP dev
    options.SaveToken = false;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };

    
    //options.Events = new JwtBearerEvents
    //{
    //    OnMessageReceived = context =>
    //    {
    //        //if (string.IsNullOrEmpty(context.Token) && context.Request.Cookies.ContainsKey("jwt_token"))
    //        //{
    //        //    var token = context.Request.Cookies["jwt_token"];
    //        //    // URL decode it
    //        //    context.Token = System.Net.WebUtility.UrlDecode(token);
    //        //    Console.WriteLine("Token from cookie (decoded): " + context.Token);
    //        //}
    //        var token = context.Request.Cookies["jwt_token"];
    //        if (!string.IsNullOrEmpty(token))
    //        {
    //            context.Token = System.Net.WebUtility.UrlDecode(token);
    //            Console.WriteLine($"Cookie token length: {token.Length}");
    //            Console.WriteLine($"Token from cookie: {context.Token}");
    //            Console.WriteLine($"Dot count: {context.Token.Count(c => c == '.')}");
    //        }
    //        else
    //        {
    //            Console.WriteLine("No jwt_token cookie found");
    //        }
    //        return Task.CompletedTask;
    //    },
    //    OnAuthenticationFailed = context =>
    //    {
    //        Console.WriteLine("JWT Authentication failed: " + context.Exception.Message);
    //        return Task.CompletedTask;
    //    },
    //    OnChallenge = context =>
    //    {
    //        Console.WriteLine("JWT Challenge triggered: " + context.AuthenticateFailure?.Message);
    //        return Task.CompletedTask;
    //    }
    //};
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod(); 
    });
});


builder.Services.AddScoped<IRepository, Repository>();
builder.Services.AddScoped<IProjectApplicationService, ProjectApplicationService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAngularDev");
app.UseAuthentication();
app.UseAuthorization();

// Debug incoming cookie
//app.Use(async (context, next) =>
//{
//    var cookie = context.Request.Headers["Cookie"].ToString();
//    Console.WriteLine($"Incoming Cookie header: {cookie}");
//    await next();
//});


app.MapControllers();


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await DbSeeder.SeedAsync(services);
}



app.Run();
