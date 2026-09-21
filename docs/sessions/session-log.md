# Session log

To avoid loading the full context each session, record here what was done.

## Format
`YYYY-MM-DD - Txx - what was done - how validated - pending`

## History
- 2026-09-10 - plan - Created docs/plan.md + tasks/T01..T10 + this log. Pending: T01 env (install .NET SDK + Node 20).
- 2026-09-10 - plan-en - Translated plan + all tasks to English. Committed content must stay in English even if chat is in Spanish.
- 2026-09-11 - T01 - Installed .NET SDK 10.0.401 + Node v24.19.0/npm 11.17.0 via winget (source winget, msstore prompt bypassed). Validated: dotnet --list-sdks=10.0.401, node=v24.19.0. Pending: T02 backend scaffold.
- 2026-09-11 - T02 - Created backend/TodoApi (webapi, EF Core Sqlite 10.0.12 + Design), Models/TodoItem, Data/TodoDbContext, Program.cs with AddDbContext/AddControllers/CORS 5173 + Migrate() on startup, migration Initial. Validated: dotnet build 0 errors, dotnet ef database update created todo.db (24576 bytes), dotnet run --urls http://localhost:5000 starts (openapi 200, no migrations pending). Pending: T03 CRUD API.
