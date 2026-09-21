# T03 - Todos CRUD API (REST without realtime)

## Goal
CRUD endpoints + reorder. No SignalR yet (added in T04).

## Endpoints (Controllers/TodosController.cs, route /api/todos)
- `GET /` -> `Ok(await db.Todos.OrderBy(t=>t.SortOrder).ThenBy(t=>t.Id).ToListAsync())`
- `POST / {description:string}` (allows "" and null->"") -> creates `IsCompleted=false`, `SortOrder=(MAX ?? -1)+1`, CreatedAt=UpdatedAt=UtcNow. Returns `CreatedAtAction`.
- `PUT /{id} {description, isCompleted}` -> updates both fields without validation, UpdatedAt=UtcNow. 404 if missing.
- `PUT /reorder [{id, sortOrder}]` (define BEFORE `/{id}` to avoid route conflict!) -> updates SortOrder+UpdatedAt per id. 204.
- `DELETE /{id}` -> 204, 404 if missing.

DTOs: `CreateTodoDto {string? Description}`, `UpdateTodoDto {string? Description, bool IsCompleted}`, `ReorderDto {int Id, int SortOrder}`. Manual mapping, no AutoMapper.

JSON camelCase by default in ASP.NET Core.

## Acceptance criteria
- [x] GET returns ordered by SortOrder.
- [x] POST new item goes last (max+1).
- [x] PUT updates text (even empty) and state.
- [x] Reorder persists.
- [x] DELETE 204.

## Validate (PowerShell)
```
dotnet run --project backend/TodoApi --urls http://localhost:5000
Invoke-RestMethod http://localhost:5000/api/todos
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/todos -ContentType "application/json" -Body '{"description":"first"}'
```

## Next
T04-signalr-hub.
