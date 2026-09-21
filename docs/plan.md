# Plan v1 — Todo Web App (shared list, no auth)

## Vision
Simple Todo Web App. All users see the same list. No authentication or users in v1.

## Locked decisions (user)
1. New items go at the end of the list.
2. No validation on description (empty allowed, no max length).
3. Edit with inline double-click (Enter/blur saves, Esc cancels).
4. Delete without confirmation.
5. No filters (single flat list).
6. Int auto-increment Id.
7. API only for now (no Swagger UI in v1).

## Stack
- Backend: ASP.NET Core Web API (C#) + EF Core + SQLite + SignalR. Port `http://localhost:5000`.
- Frontend: React + Vite + TypeScript + plain CSS. Port `http://localhost:5173`. Package `@microsoft/signalr`.
- Persistence: SQLite file `todo.db` (EF Core). No InMemory so data survives restarts.

## Repo structure
```
TodoApp/
  backend/TodoApi/
    Program.cs
    Models/TodoItem.cs
    Data/TodoDbContext.cs
    DTOs/TodoDtos.cs (incl. TodoResponseDto)
    Adapters/TodoMapper.cs (static, Entity<->DTO)
    Repositories/ITodoRepository.cs + TodoRepository.cs (EF only)
    Services/ITodoService.cs + TodoService.cs (business rules)
    Controllers/TodosController.cs (thin, maps to ResponseDto)
    Hubs/TodoHub.cs (T04)
  frontend/todo-web/
    src/api/todosApi.ts
    src/hubs/todoHub.ts
    src/hooks/useTodos.ts
    src/components/AddTodo.tsx, TodoList.tsx, TodoItem.tsx
    src/App.tsx, main.tsx, styles.css
    vite.config.ts
  docs/plan.md + tasks/T01..T10 incl. T03.1 + sessions/session-log.md
```

## Model
```csharp
// TodoItem
int Id (PK autoincrement)
string Description = ""  // NOT NULL, "" allowed
bool IsCompleted = false
int SortOrder
DateTime CreatedAt (UtcNow)
DateTime UpdatedAt (UtcNow)
```

Ordering: `ORDER BY SortOrder ASC, Id ASC`. On create: `SortOrder = MAX+1` (or 0 if empty).

## REST API (base http://localhost:5000)
- `GET /api/todos` -> 200 `[{id, description, isCompleted, sortOrder, createdAt, updatedAt}]`
- `POST /api/todos {description}` -> 201 creates with `isCompleted=false`, `sortOrder=max+1`
- `PUT /api/todos/{id} {description, isCompleted}` -> 200 (used both for text edit and toggle)
- `PUT /api/todos/reorder [{id, sortOrder}]` -> 204 (persists drag order)
- `DELETE /api/todos/{id}` -> 204
- JSON camelCase. CORS allows `http://localhost:5173`.

## SignalR realtime
- Hub: `/hubs/todo`, class `TodoHub`.
- After each mutation: `await _hub.Clients.Others.SendAsync("TodoChanged", payload)`.
- Payload: `{ type: "created"|"updated"|"deleted"|"reordered", todo?, todos? }`
  - created/updated: sends full `todo`.
  - deleted: sends `{id}`.
  - reordered: sends list `[{id, sortOrder}]` or full reordered list (decide in T04, recommended id list).
- Client: `connection.on("TodoChanged", handler)` updates local state without full refetch. If unknown id -> `GET` reconciliation.
- Green/red connection indicator + auto-reconnect.

## Frontend UX
- Header + add input + Add button. Adds at the end.
- Item: `[checkbox] description (double-click to edit) [x]`.
- Toggle = PUT with inverted `isCompleted` (optimistic update).
- Native HTML5 `draggable` drag, on drop recalculates `0..n-1` and PUT /reorder.
- No filters, no counters, no delete confirmation.

## Implementation order
T01 env -> T02 backend scaffold -> T03 CRUD API -> T03.1 service/repository/adapters refactor (no behavior change) -> T04 SignalR -> T05 frontend scaffold -> T06 CRUD UI -> T07 realtime sync -> T08 drag reorder -> T09 e2e validation -> T10 readme/gitignore.
Each task is independent and individually validatable. See `tasks/Txx-*.md` (incl. `T03.1-service-repository-adapters.md`).

## Backend layering (T03.1)
- `Repositories/`: EF Core only (`ITodoRepository` + `TodoRepository`). Methods: `GetAllOrderedAsync, GetByIdAsync, AddAsync, Update, Remove, GetMaxSortOrderAsync, SaveChangesAsync`. Ordering `SortOrder ASC, Id ASC` lives here.
- `Services/`: business rules (`ITodoService` + `TodoService`, entities in/out). Owns `SortOrder=max+1`, `UtcNow` timestamps, `null->""` mapping, single `SaveChangesAsync` per operation.
- `Adapters/`: static `TodoMapper` (no DI, no AutoMapper). `ToResponseDto`, `ToResponseDtoList`, `ToEntity`, `ApplyUpdate`.
- `Controllers/`: thin, injects `ITodoService` only, maps to `TodoResponseDto` before returning. Returns `TodoResponseDto` (not EF entity) to freeze HTTP shape for T04+frontend.
- `Program.cs`: `AddScoped<ITodoRepository, TodoRepository>` + `AddScoped<ITodoService, TodoService>` (Scoped to match DbContext).
