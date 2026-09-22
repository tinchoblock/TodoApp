# TodoApp — agent index (always-on, <50 lines)

Stack: backend ASP.NET Core + EF SQLite `:5000`, frontend Vite React TS `:5173`.
Structure: `backend/TodoApi/{Controllers,Services,Repositories,Adapters,Hubs,Data}` `frontend/todo-web/src/{api,hubs,hooks,components}`.
Rules: append at end `sortOrder=max+1`; `description ""` allowed, no validation; delete w/o confirm; no filters; JSON camelCase; CORS only `5173` + AllowCredentials.
State: `useTodos` optimistic + snapshot rollback; ordered `sortOrder,Id`.
Contracts: source of truth is `docs/context/contracts.md` (NOT plan/tasks — they drift). Read it before any T07/T08 work.
Flow: read task `docs/tasks/Txx` + `contracts.md` + only files the task cites. Update `contracts.md` + `session-log.md` if contract changes.
Baseline: `67026a1` T06 done (CRUD single-tab, no realtime).
