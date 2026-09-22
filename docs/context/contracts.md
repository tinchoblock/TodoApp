# Contracts (from code 2026-09-22, overrides plan/tasks on conflict)

REST base `http://localhost:5000/api/todos`:
`GET /`->200 Todo[] ordered; `POST {description?}`->201 Todo (sortOrder=max+1); `PUT /{id} {description?,isCompleted}`->200 Todo|404; `PUT /reorder [{id,sortOrder}]`->204; `DELETE /{id}`->204|404.
SignalR hub `http://localhost:5000/hubs/todo`, event `TodoChanged`, camelCase:
created `{type:"created",todo}`, updated `{type:"updated",todo}`, deleted `{type:"deleted",id}`, reordered `{type:"reordered",todos:[{id,sortOrder}]}`.
Echo: server uses `AllExcept` if client sends `?connectionId=` or `X-Connection-Id` header, else `All`. Client must tolerate echo (idempotent apply) + `fetchTodos()` if unknown id.
Client rule (T07): created upsert+sort, updated replace, deleted filter, reordered apply+resort; `withAutomaticReconnect` + green/red indicator.
Drift note: T07 task says `items?`+`Others` — real code is `todos`+`AllExcept`. Trust this file.
