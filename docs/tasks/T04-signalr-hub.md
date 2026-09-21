# T04 - SignalR hub (broadcast to other instances)

> Prerequisite: T03.1. `TodosController` is thin (injects `ITodoService` only)
> and returns `TodoResponseDto` via static `TodoMapper`.
> Inject `IHubContext<TodoHub>` alongside `ITodoService` and broadcast the DTO.

## Goal
Notify other open instances when one modifies the list.

## Steps
1. Create `Hubs/TodoHub.cs`: `public class TodoHub : Hub { }` (no client->server methods in v1, only server->clients).
2. `Program.cs`: `builder.Services.AddSignalR();` + `app.MapHub<TodoHub>("/hubs/todo");`
3. Inject `IHubContext<TodoHub>` into `TodosController` (alongside `ITodoService` from T03.1). After each successful mutation, map result with `TodoMapper.ToResponseDto` and broadcast the DTO:
   - POST -> `await _hub.Clients.Others.SendAsync("TodoChanged", new { type="created", todo })`
   - PUT {id} -> `type="updated"` with todo
   - DELETE -> `type="deleted"` with `{id}`
   - PUT reorder -> `type="reordered"` with sorted list `[{id, sortOrder}]`
4. Do not send to Caller (Others only) to avoid echo; caller already did optimistic update.

## Acceptance criteria
- [x] Hub reachable at `/hubs/todo` (negotiate 200).
- [x] Create/edit/delete/reorder emits event to Others only.
- [x] Payload camelCase `type` + data.

## Validate
Start API, open 2 WS clients (or fully validated in T07 with frontend). Minimum: `Invoke-RestMethod http://localhost:5000/hubs/todo/negotiate?negotiateVersion=1 -Method Post` does not return 404.

## Next
T05-frontend-scaffold.
