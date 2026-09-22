# Stack (stable)

Backend: ASP.NET Core 10, EF Core SQLite file `todo.db`, SignalR. Port `http://localhost:5000`.
Frontend: Vite 6 + React 19 + TS 5.8 + plain CSS, `@microsoft/signalr 10`. Port `http://localhost:5173`.
Run: `dotnet run --urls http://localhost:5000` (backend/TodoApi), `npm run dev` (frontend/todo-web).
Check: `dotnet build`, `tsc -b && vite build`, `eslint .`.
Ignore: `bin/, obj/, *.db*, node_modules/, dist/` (see root .gitignore).
