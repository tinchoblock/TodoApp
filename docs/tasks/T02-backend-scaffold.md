# T02 - Backend scaffold (no endpoints, base only)

## Goal
Create `backend/TodoApi` project with EF Core SQLite that compiles.

## Steps
1. `dotnet new webapi -n TodoApi -o backend/TodoApi` (we will use controllers).
2. Add packages:
   `dotnet add backend/TodoApi package Microsoft.EntityFrameworkCore.Sqlite`
   `dotnet add backend/TodoApi package Microsoft.EntityFrameworkCore.Design`
3. Create:
   - `Models/TodoItem.cs`: Id int PK, Description string="", IsCompleted bool, SortOrder int, CreatedAt/UpdatedAt DateTime.
   - `Data/TodoDbContext.cs`: `DbSet<TodoItem> Todos`, connection `Data Source=todo.db`.
4. `Program.cs`: `builder.Services.AddDbContext<TodoDbContext>(o=>o.UseSqlite("Data Source=todo.db"))`, AddControllers, AddCors (origin http://localhost:5173 AllowAnyHeader/Method).
5. Create initial migration: `dotnet ef migrations add Initial --project backend/TodoApi` + `dotnet ef database update --project backend/TodoApi` (requires dotnet-ef tool: `dotnet tool install -g dotnet-ef` if missing).
6. `dotnet build backend/TodoApi`.

## Acceptance criteria
- [ ] Builds without errors.
- [ ] `todo.db` exists after update (or is created on startup via `db.Database.Migrate()`).
- [ ] CORS configured for 5173.

## Validate
`dotnet run --project backend/TodoApi --urls http://localhost:5000` starts without crash.

## Next
T03-todos-crud-api.
