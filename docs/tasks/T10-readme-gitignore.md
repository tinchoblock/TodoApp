# T10 - README + gitignore

## Goal
Leave repo documented and git-clean.

## Steps
1. Root `.gitignore`: include `bin/`, `obj/`, `*.db`, `*.db-*`, `node_modules/`, `dist/`, `.vite/`, `frontend/todo-web/dist/`.
2. Root `README.md`:
   - What it is (shared list without auth v1).
   - Requirements: .NET SDK 10, Node 20.
   - How to run: `dotnet run --project backend/TodoApi --urls http://localhost:5000` + `cd frontend/todo-web; npm install; npm run dev -- --port 5173`.
   - Endpoints + hub `/hubs/todo`, `TodoChanged` event.
   - UX rules (new at end, double-click edits, delete without confirmation, no filters, native drag).
3. `git status` clean except intended code.

## Acceptance criteria
- [ ] README lets a third party run it in 5 min.
- [ ] `todo.db` and `node_modules` ignored.

## End of v1
