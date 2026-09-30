# TodoApp — shared todo list (v1, no auth)

A realtime shared todo list: one list for everyone, no login, synced across tabs/browsers via SignalR.

- Backend: ASP.NET Core + EF Core SQLite (`http://localhost:5000`)
- Frontend: Vite + React + TypeScript (`http://localhost:5173`)
- Realtime: SignalR hub at `/hubs/todo`, event `TodoChanged`

## Requirements

- .NET SDK 10 (`dotnet --version` → `10.x`)
- Node 20+ (repo tested with Node v24 + npm 11) (`node --version`, `npm --version`)

No other services needed — SQLite file `todo.db` is created automatically on backend startup (EF `Migrate()`).

## How to run (5 min)

Terminal 1 — backend:

```bash
dotnet run --project backend/TodoApi --urls http://localhost:5000
```

Backend listens on `http://localhost:5000`. First start creates `backend/TodoApi/todo.db` (git-ignored). OpenAPI JSON at `http://localhost:5000/openapi/v1.json` (Development).

Terminal 2 — frontend:

```bash
cd frontend/todo-web
npm install
npm run dev -- --port 5173
```

Open `http://localhost:5173`. Keep both terminals running. The header dot shows SignalR state: green = connected, orange = reconnecting/retrying, red = disconnected. If the backend was down at load, the app retries with backoff — just start the backend and it recovers without reload (or press **Retry now**).

Ports are fixed by convention: backend `:5000`, frontend `:5173` (CORS `AllowFrontend` only allows `http://localhost:5173` + `AllowCredentials`).

## API

Base: `http://localhost:5000/api/todos` — JSON is camelCase.

| Method | Endpoint | Body | Result |
|---|---|---|---|
| `GET` | `/api/todos` | — | `200` `Todo[]` ordered by `sortOrder`, then `id` |
| `GET` | `/api/todos/{id}` | — | `200` `Todo` \| `404` |
| `POST` | `/api/todos` | `{ "description"?: string }` | `201` `Todo`, appended at end (`sortOrder = max + 1`); empty/missing description allowed (`""`) |
| `PUT` | `/api/todos/{id}` | `{ "description"?: string, "isCompleted"?: boolean }` | `200` `Todo` \| `404`; no validation, empty description allowed |
| `PUT` | `/api/todos/reorder` | `[ { "id": number, "sortOrder": number }, … ]` | `204` (must be called before `/{id}` route matching) |
| `DELETE` | `/api/todos/{id}` | — | `204` \| `404`, no confirmation in UI |

`Todo` shape: `{ id, description, isCompleted, sortOrder, createdAt, updatedAt }` (UTC timestamps).

### Realtime hub

- URL: `http://localhost:5000/hubs/todo` (SignalR, `TodoHub` — server→clients only, `withAutomaticReconnect()` on the client)
- Event: `TodoChanged` (camelCase payloads):
  - created → `{ type: "created", todo }`
  - updated → `{ type: "updated", todo }`
  - deleted → `{ type: "deleted", id }`
  - reordered → `{ type: "reordered", todos: [{ id, sortOrder }] }`
- Echo suppression: clients send `?connectionId=` (or `X-Connection-Id` header) on mutations; the server broadcasts via `AllExcept(connectionId)` when present, else `All`. Clients tolerate echo anyway (idempotent apply) and refetch (`GET /`) when an unknown id arrives.
- Client apply rule (`useTodos`): created = upsert + sort, updated = replace, deleted = filter, reordered = apply + resort; optimistic updates with snapshot rollback on failure.

## UX rules (v1)

- New todos are appended at the end (`sortOrder = max + 1`).
- Double-click a todo's text to edit inline (Enter saves, empty text allowed, Esc cancels).
- Checkbox toggles completion; both toggle and edit are optimistic with rollback.
- Delete is immediate — no confirmation dialog.
- No filters/search — single flat list, ordered by `sortOrder`, then `id`.
- Reorder with native HTML5 drag-and-drop (`draggable`, drop indicator, `PUT /reorder`, refetch on failure); broadcasts to other tabs.
- Multi-tab: open two browsers side by side — creates/updates/deletes/reorders appear live with a green/red connection indicator.

## Project layout

```text
backend/TodoApi/{Controllers,Services,Repositories,Adapters,Hubs,Data}  # REST + SignalR + EF SQLite
frontend/todo-web/src/{api,hubs,hooks,components}                       # todosApi, todoHub, useTodos, AddTodo/TodoList/TodoItem
docs/{plan.md,tasks/T01..T10,context/contracts.md,sessions/session-log.md}  # v1 process docs
```

Wire format source of truth: `docs/context/contracts.md` (overrides plan/tasks on conflict).

## Git hygiene

Local artifacts are ignored: `bin/`, `obj/`, `*.db` (+ `*.db-*` journals), `node_modules/`, `dist/`, `.vite/`. `git status` should be clean except intended code — if `todo.db` or `node_modules` show up, check root `.gitignore` with `git check-ignore -v <path>`.
