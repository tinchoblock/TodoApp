import { useEffect, useState } from 'react';
import { fetchTodos, type Todo } from './api/todosApi';

// Temporary scaffold for T05 (full CRUD UI lands in T06, realtime in T07).
// Verifies the Vite app on :5173 can GET the API on :5000 (CORS).
function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchTodos()
      .then((data) => {
        if (!cancelled) {
          setTodos(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p>Loading todos…</p>;
  }

  if (error) {
    return <p role="alert">Failed to load todos: {error}</p>;
  }

  if (todos.length === 0) {
    return <p>No todos yet.</p>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.description}</li>
      ))}
    </ul>
  );
}

export default App;

