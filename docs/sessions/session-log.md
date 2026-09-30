# Session log

To avoid loading the full context each session, record here what was done.

## Format
`YYYY-MM-DD - Txx - what was done - how validated - pending`

## History
- 2026-09-10 - plan - Created docs/plan.md + tasks/T01..T10 + this log. Pending: T01 env (install .NET SDK + Node 20).
- 2026-09-10 - plan-en - Translated plan + all tasks to English. Committed content must stay in English even if chat is in Spanish.
- 2026-09-11 - T01 - Installed .NET SDK 10.0.401 + Node v24.19.0/npm 11.17.0 via winget (source winget, msstore prompt bypassed). Validated: dotnet --list-sdks=10.0.401, node=v24.19.0. Pending: T02 backend scaffold.
- 2026-09-11 - T02 - Created backend/TodoApi (webapi, EF Core Sqlite 10.0.12 + Design), Models/TodoItem, Data/TodoDbContext, Program.cs with AddDbContext/AddControllers/CORS 5173 + Migrate() on startup, migration Initial. Validated: dotnet build 0 errors, dotnet ef database update created todo.db (24576 bytes), dotnet run --urls http://localhost:5000 starts (openapi 200, no migrations pending). Pending: T03 CRUD API.
- 2026-09-29 - T07 - Realtime sync: added src/hubs/todoHub.ts (withAutomaticReconnect), useTodos v2 TodoChanged apply (created upsert+sort, updated replace, deleted filter, reordered apply+resort, fetchTodos on unknown id), App connected indicator, connectionId echo-suppression. Validated: dotnet build ok, vite build ok, backend GET /api/todos 200, hub negotiate 200. Pending: T08 drag reorder.
- 2026-09-29 - T08 - Drag reorder: TodoList/TodoItem draggable + dragOver indicator, useTodos.reorder optimistic 0..n-1 + PUT /reorder (refetch on fail), backend reordered broadcast reused. Validated: vite build ok, PUT /reorder reverses+restores order via API. Pending: T09 e2e validation.
- 2026-09-30 - T08.1 - Startup retry: useTodos loadWithRetry + startHubWithRetry with exponential backoff (1s..10s), reconnecting status, error cleared on recovery, onclose re-enters start loop, App Retry-now button. Validated: npm run build ok. Pending: manual cold-start test (backend down -> retrying -> start backend -> green, no reload) + T09 e2e.
- 2026-09-30 - T09 - E2E green: GET ordered (6 rows so 0..5), POST a/b/empty -> so 6/7/8, PUT toggle 22 completed persists, PUT edit + empty-save ok, DELETE 24 no-confirm gone, PUT /reorder reverse+restore persists, hub negotiate 200, useTodos TodoChanged apply (created/updated/deleted/reordered+reconcile) + withAutomaticReconnect/retry loop + green/red indicator, vite dev :5173 200 + npm run build ok, DB restored to 6 rows. Pending: T10 readme-gitignore.
- 2026-09-30 - T10 - README + gitignore: root README.md (run in 5 min, endpoints + /hubs/todo TodoChanged, UX rules), .gitignore explicit bin/obj/*.db/*.db-*/node_modules/dist/.vite/frontend-todo-web-dist. Validated: git status clean except M .gitignore + ?? README.md, check-ignore ignores bin/obj/node_modules/dist/todo.db(+shm/wal)/.vite (dotnet build blocked: backend already running, DLL locked - no code changed). Pending: none, v1 done.