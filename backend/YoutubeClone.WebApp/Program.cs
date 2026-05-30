using Scalar.AspNetCore;
using Serilog;
using YoutubeClone.Shared.Constants;
using YoutubeClone.WebApp.Extensions;
using YoutubeClone.WebApp.Middlewares;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Host.UseSerilog();

builder.Services.AddCore(configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins(configuration[ConfigurationConstants.CLIENT_ORIGIN])
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseCors("AllowAngular");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference(options =>
    {
        options.Theme = ScalarTheme.DeepSpace;
        options.WithTitle("Youtube Clone");
    });
    app.MapOpenApi();
}

app.UseMiddleware<ErrorHandleMiddleware>();

//app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
