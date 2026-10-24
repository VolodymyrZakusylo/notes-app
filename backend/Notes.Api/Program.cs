using Microsoft.EntityFrameworkCore;
using Notes.Api.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration
    .GetConnectionString("NotesDb")
    ?? throw new InvalidOperationException(
        "Connection string 'NotesDb' was not found.");

builder.Services.AddDbContext<NotesDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/", () => Results.Ok(new { message = "Notes API is running" }));

app.MapControllers();

app.Run();
