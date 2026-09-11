# T04 - SignalR hub (broadcast to other instances)

## Goal
Notify other open instances when one modifies the list.

## Steps
1. Create `Hubs/TodoHub.cs`: `public class TodoHub : Hub { }` (no client->server methods in v1, only server->clients).
2. `Program.cs`: `builder.Services.AddSignalR();` + `app.MapHub<TodoHub>("/hubs/todo");`
3. Inject `IHubContext<TodoHub>` into `TodosController`. After each successful mutation:
   - POST -> `await _hub.Clients.Others.SendAsync("TodoChanged", new { type="created", todo })`
   - PUT {id} -> `type="updated"` with todo
   - DELETE -> `type="deleted"` with `{id}`
   - PUT reorder -> `type="reordered"` with sorted list `[{id, sortOrder}]`
4. Do not send to Caller (Others only) to avoid echo; caller already did optimistic update.

## Acceptance criteria
- [ ] Hub reachable at `/hubs/todo` (negotiate 200).
- [ ] Create/edit/delete/reorder emits event to Others only.
- [ ] Payload camelCase `type` + data.

## Validate
Start API, open 2 WS clients (or fully validated in T07 with frontend). Minimum: `Invoke-RestMethod http://localhost:5000/hubs/todo/negotiate?negotiateVersion=1 -Method Post` does not return 404.

## Next
T05-frontend-scaffold.
