# Frontend (T06 v1 baseline 67026a1)

`api/todosApi.ts`: `Todo{id,description,isCompleted,sortOrder,createdAt,updatedAt}`, `API_URL=.../api/todos`, fns `fetch/create/update/reorder/delete`.
`hooks/useTodos.ts v1`: `useState todos/loading/error`, `useEffect fetch`, `add` appends `[...prev,created]`, `toggle/saveText/remove` optimistic + snapshot rollback (add refetches on fail). No realtime.
`components/`: `AddTodo` input+Add, empty ok, clears; `TodoItem` checkbox+span dblclick+`x`, edit `autoFocus Enter/blur=save Esc=cancel blur-guard`, completed=gray strikethrough; `TodoList` flat `todos.map` (API order).
`App.tsx`: header TodoApp + AddTodo + TodoList, loading/error states, plain `styles.css`.
T07 adds: `hubs/todoHub.ts` + `useTodos v2` SignalR + `connected` indicator. T08 adds: draggable reorder.
