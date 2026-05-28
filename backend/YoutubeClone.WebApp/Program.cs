using Scalar.AspNetCore;
using Serilog;
using YoutubeClone.WebApp.Extensions;
using YoutubeClone.WebApp.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();

builder.Services.AddCore(builder.Configuration);

var app = builder.Build();

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
