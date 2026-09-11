# T09 - E2E validation

## Goal
Final checklist that v1 meets everything.

## Preconditions
- API: `dotnet run --project backend/TodoApi --urls http://localhost:5000`
- Frontend: `cd frontend/todo-web; npm run dev -- --port 5173`
- 2 tabs at http://localhost:5173

## Matrix
- [ ] Initial GET empty or with ordered data.
- [ ] Create "a", "b", "" (empty) in A -> appear at end in A and B.
- [ ] Toggle checkbox in A -> strikethrough in B and persists after reload.
- [ ] Double-click edit in B -> changes in A, empty allowed, Esc cancels.
- [ ] Delete with X in A -> disappears in B without dialog.
- [ ] Drag reorder in A -> new order in B and after reload in both.
- [ ] Stop API and reconnect -> red->green indicator, later changes sync.
- [ ] Reload both -> same order and state (SQLite persists).

## If it fails
Record in `docs/sessions/session-log.md` which T failed and why. Do not move to T10 until green.

## Next
T10-readme-gitignore.
