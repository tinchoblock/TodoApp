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
- [ ] Add appears at the end.
- [ ] Checkbox changes state and persists after reload.
- [ ] Double-click edits, Enter/blur saves (empty ok), Esc cancels.
- [ ] X deletes without dialog and item disappears.
- [ ] No filters, no validations.

## Validate
Single tab on 5173 + API 5000. Test CRUD matrix and reload.

## Next
T07-realtime-sync.
