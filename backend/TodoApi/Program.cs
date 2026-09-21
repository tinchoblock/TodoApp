using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Repositories;
using TodoApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Controllers (endpoints are added in T03; base only for T02).
builder.Services.AddControllers();

// EF Core SQLite. Connection string kept inline per T02 spec.
builder.Services.AddDbContext<TodoDbContext>(o =>
    o.UseSqlite("Data Source=todo.db"));

// T03.1 layered architecture (Scoped to match DbContext lifetime).
builder.Services.AddScoped<ITodoRepository, TodoRepository>();
builder.Services.AddScoped<ITodoService, TodoService>();

// CORS for the Vite frontend at http://localhost:5173.
const string AllowFrontend = "AllowFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(AllowFrontend, policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Apply pending migrations on startup so todo.db is created
// even if `dotnet ef database update` was not run.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TodoDbContext>();
    db.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(AllowFrontend);

app.MapControllers();

app.Run();

