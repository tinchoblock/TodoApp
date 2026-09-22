import { useEffect, useState } from 'react';
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
  type Todo,
} from '../api/todosApi';

// T06 v1 hook (no realtime, single tab).
// Optimistic updates with snapshot rollback; on failure restores previous state
// and surfaces the error (T07 will add realtime reconciliation).
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  async function refetchOnFailure(message: Error): Promise<void> {
    setError(message.message);
    // Simple rollback strategy alternative: refetch authoritative state.
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch {
      // Keep existing optimistic state + error if refetch also fails.
    }
  }

  // Add appears at the end (API assigns sortOrder = max + 1).
  // Empty text allowed — no validation.
  async function add(text: string): Promise<void> {
    try {
      const created = await createTodo(text);
      setTodos((prev) => [...prev, created]);
    } catch (err: unknown) {
      await refetchOnFailure(err instanceof Error ? err : new Error(String(err)));
    }
  }

  async function toggle(id: number): Promise<void> {
    const snapshot = todos;
    const target = snapshot.find((t) => t.id === id);
    if (!target) {
      return;
    }
    const nextCompleted = !target.isCompleted;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: nextCompleted } : t)),
    );
    try {
      const updated = await updateTodo(id, {
        description: target.description,
        isCompleted: nextCompleted,
      });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: unknown) {
      setTodos(snapshot);
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function saveText(id: number, text: string): Promise<void> {
    const snapshot = todos;
    const target = snapshot.find((t) => t.id === id);
    if (!target) {
      return;
    }
    // Optimistic text update (empty string ok).
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, description: text } : t)),
    );
    try {
      const updated = await updateTodo(id, {
        description: text,
        isCompleted: target.isCompleted,
      });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: unknown) {
      setTodos(snapshot);
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function remove(id: number): Promise<void> {
    const snapshot = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTodo(id);
    } catch (err: unknown) {
      setTodos(snapshot);
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return { todos, loading, error, add, toggle, saveText, remove };
}
