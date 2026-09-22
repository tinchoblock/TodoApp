# T05 - Frontend scaffold (Vite React TS)

## Goal
Create `frontend/todo-web` running on 5173 and talking to API on 5000.

## Steps
1. `npm create vite@latest frontend/todo-web -- --template react-ts` (requires Node 20+, see T01).
2. `cd frontend/todo-web; npm install; npm install @microsoft/signalr`.
3. `vite.config.ts`: `server: { port: 5173 }`.
4. Create `src/api/todosApi.ts`:
   - `API_URL = "http://localhost:5000/api/todos"`
   - types `Todo {id, description, isCompleted, sortOrder, createdAt, updatedAt}`
   - functions `fetchTodos(), createTodo(description), updateTodo(id, {description,isCompleted}), reorderTodos(items), deleteTodo(id)` with JSON fetch.
5. Temporary `src/App.tsx`: empty list with `useEffect(fetchTodos)`.
6. `npm run dev -- --port 5173`.

## Acceptance criteria
- [x] `npm run dev` opens on 5173 without TS errors. (Done 2026-09-22: `npx tsc -b` + `npm run build` clean, `vite --port 5173` 200.)
- [x] Performs GET to 5000 (CORS ok, empty list or with data). (Done 2026-09-22: `GET /api/todos` 200 empty `[]`, OPTIONS preflight 204 with `Access-Control-Allow-Origin: http://localhost:5173`.)
- [x] `@microsoft/signalr` installed (actually used in T07). (Done 2026-09-22: `@microsoft/signalr@^10.0.11` in `frontend/todo-web/package.json`.)

## Next
T06-crud-ui.
