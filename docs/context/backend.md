# Backend (T02-T04 verified vs code)

Layering: Controller (thin, `ITodoService`+`IHubContext`) -> Service (rules: `max+1`, `UtcNow`, `null->""`, 1 SaveChanges) -> Repository (EF only, `ORDER BY SortOrder,Id`) -> `TodoMapper` static (Entity<->DTO).
DI: `AddScoped<ITodoRepository,TodoRepository>` + `AddScoped<ITodoService,TodoService>` (Scoped=DbContext).
Program.cs: `AddControllers, AddDbContext(Sqlite todo.db), AddCors(5173 AllowCredentials), AddSignalR, Migrate() on startup, MapControllers, MapHub<TodoHub>("/hubs/todo")`.
Model: `Id int PK, Description "" NOT NULL, IsCompleted false, SortOrder int, CreatedAt/UpdatedAt UtcNow`.
Gotcha: `PUT reorder` route must precede `PUT {id:int}`; `IHubContext` has no Others — emulated via `AllExcept` (see contracts.md).
