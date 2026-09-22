# T06 - CRUD UI (no realtime, single tab)

## Goal
Full local CRUD UI: add, toggle, double-click edit, delete. No SignalR (T07) nor drag (T08).

## Components
- `src/components/AddTodo.tsx`: input + Add button. On submit `createTodo(input)` and append at end. Empty text allowed (no validation). Clears input.
- `src/components/TodoItem.tsx`: props `todo, onToggle, onSave, onDelete`.
  - `[checkbox checked=isCompleted onChange=onToggle]` + `span onDoubleClick=editMode` + `x button onClick=onDelete` without confirmation.
  - Edit mode: `input autoFocus value=draft`, `Enter/blur` -> `onSave(draft)` (even ""), `Esc` -> cancels.
  - Style: if `isCompleted`, gray strikethrough.
- `src/components/TodoList.tsx`: `todos.map(TodoItem)`, already ordered by sortOrder from API.
- `src/hooks/useTodos.ts` v1: `useState<Todo[]>`, `useEffect(fetch)`, `add/toggle/saveText/remove` functions with optimistic update + simple rollback (or refetch on failure).
- `src/App.tsx`: "TodoApp" header, AddTodo + TodoList. Plain `styles.css`.

## Acceptance criteria
- [x] Add appears at the end. (Done 2026-09-22: `AddTodo` posts via `createTodo` and `useTodos.add` appends `[...prev, created]`; API assigns `sortOrder=max+1`; verified POST A then "" appended ids 13,14 in order.)
- [x] Checkbox changes state and persists after reload. (Done 2026-09-22: `TodoItem` checkbox `checked=isCompleted onChange=onToggle`, `useTodos.toggle` optimistic + `PUT {description,isCompleted}`; verified toggle id 13 -> `isCompleted:true` still present on `GET`.)
- [x] Double-click edits, Enter/blur saves (empty ok), Esc cancels. (Done 2026-09-22: `span onDoubleClick=editMode`, edit `input autoFocus`, `Enter/blur->onSave(draft)` incl. "", `Esc` cancels with blur-guard; verified PUT `edited ok` persists.)
- [x] X deletes without dialog and item disappears. (Done 2026-09-22: `x button onClick=onDelete`, no confirm, `useTodos.remove` optimistic filter + `DELETE`; verified `DELETE 14->204`, item gone on `GET`.)
- [x] No filters, no validations. (Done 2026-09-22: flat `todos.map` list, empty description POST 201 accepted, no filter UI; lint/tsc/build clean, `vite :5173` 200 + `GET /api/todos` round-trip.)

## Validate
Single tab on 5173 + API 5000. Test CRUD matrix and reload.

## Next
T07-realtime-sync.
