# T07 - Realtime sync (2 tabs)

## Goal
When one instance edits, the other updates automatically via SignalR.

## Steps
1. `src/hubs/todoHub.ts`: `createConnection()` with `HubConnectionBuilder().withUrl("http://localhost:5000/hubs/todo").withAutomaticReconnect().build()`, `start()`.
2. `useTodos.ts` v2: after initial fetch, `connection.on("TodoChanged", (msg:{type, todo?, id?, items?}) => ...)`:
   - created: if id missing -> append and sort by sortOrder; if exists -> replace.
   - updated: replace by id.
   - deleted: filter by id.
   - reordered: apply sortOrder by id and re-sort.
   - If unknown id on updated/deleted -> `fetchTodos()` reconciliation.
3. `App.tsx`: `connected` state (green/red) via `onreconnected/onclose/onreconnecting`.
4. Caller does NOT expect echo (backend uses Others), so its optimistic update is the source.

## Acceptance criteria
- [x] 2 tabs on 5173: create in A shows in B without reload.
- [x] Edit/toggle/delete in A reflects in B.
- [x] Connection indicator visible.
- [x] Automatic reconnect.

## Validate
Open 2 tabs, test cross create/edit/toggle/delete.

## Next
T08-drag-reorder.
