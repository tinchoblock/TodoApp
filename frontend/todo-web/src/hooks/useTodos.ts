import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  reorderTodos,
  updateTodo,
  type Todo,
} from '../api/todosApi';
import { createConnection } from '../hubs/todoHub';

export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';

// Wire shape from contracts.md (camelCase). Note: T07 task says `items?` +
// "no echo" but real backend sends `todos` via AllExcept — tolerate both and
// apply echo idempotently.
interface TodoChangedMessage {
  type: 'created' | 'updated' | 'deleted' | 'reordered';
  todo?: Todo;
  id?: number;
  todos?: Array<{ id: number; sortOrder: number }>;
  items?: Array<{ id: number; sortOrder: number }>;
}

function sortTodos(list: Todo[]): Todo[] {
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}

// T07 v2 hook: T06 optimistic CRUD + SignalR realtime apply.
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<ConnectionStatus>('disconnected');
  const connectionIdRef = useRef<string | null>(null);

  const reconcile = useCallback(async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch {
      // Keep existing state if reconciliation fetch fails.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const connection = createConnection();

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

    connection.on('TodoChanged', (msg: TodoChangedMessage) => {
      if (cancelled || !msg || typeof msg.type !== 'string') {
        return;
      }
      if (msg.type === 'created' && msg.todo) {
        const incoming = msg.todo;
        setTodos((prev) =>
          prev.some((t) => t.id === incoming.id)
            ? prev.map((t) => (t.id === incoming.id ? incoming : t))
            : sortTodos([...prev, incoming]),
        );
      } else if (msg.type === 'updated' && msg.todo) {
        const incoming = msg.todo;
        setTodos((prev) => {
          if (!prev.some((t) => t.id === incoming.id)) {
            void reconcile();
            return prev;
          }
          return prev.map((t) => (t.id === incoming.id ? incoming : t));
        });
      } else if (msg.type === 'deleted' && typeof msg.id === 'number') {
        const deletedId = msg.id;
        setTodos((prev) => {
          if (!prev.some((t) => t.id === deletedId)) {
            void reconcile();
            return prev;
          }
          return prev.filter((t) => t.id !== deletedId);
        });
      } else if (msg.type === 'reordered') {
        const order = msg.todos ?? msg.items;
        if (!Array.isArray(order)) {
          void reconcile();
        } else {
          const orderById = new Map(order.map((o) => [o.id, o.sortOrder]));
          setTodos((prev) =>
            sortTodos(
              prev.map((t) =>
                orderById.has(t.id) ? { ...t, sortOrder: orderById.get(t.id)! } : t,
              ),
            ),
          );
        }
      } else {
        void reconcile();
      }
    });

    connection.onreconnecting(() => {
      if (!cancelled) {
        setConnected('reconnecting');
      }
    });
    connection.onreconnected(() => {
      if (!cancelled) {
        connectionIdRef.current = connection.connectionId ?? null;
        setConnected('connected');
        void reconcile();
      }
    });
    connection.onclose(() => {
      if (!cancelled) {
        setConnected('disconnected');
      }
    });

    connection
      .start()
      .then(() => {
        if (!cancelled) {
          connectionIdRef.current = connection.connectionId ?? null;
          setConnected('connected');
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setConnected('disconnected');
          setError(err instanceof Error ? err.message : String(err));
        }
      });

    return () => {
      cancelled = true;
      void connection.stop();
    };
  }, [reconcile]);

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
      const created = await createTodo(text, connectionIdRef.current);
      setTodos((prev) =>
        prev.some((t) => t.id === created.id)
          ? prev.map((t) => (t.id === created.id ? created : t))
          : [...prev, created],
      );
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
      const updated = await updateTodo(
        id,
        {
          description: target.description,
          isCompleted: nextCompleted,
        },
        connectionIdRef.current,
      );
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
      const updated = await updateTodo(
        id,
        {
          description: text,
          isCompleted: target.isCompleted,
        },
        connectionIdRef.current,
      );
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
      await deleteTodo(id, connectionIdRef.current);
    } catch (err: unknown) {
      setTodos(snapshot);
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  // T08: manual drag reorder. Moves draggedId to targetId's position,
  // recalcs 0..n-1 (v1 simple, no gaps), optimistic apply + PUT /reorder.
  // On failure -> refetch authoritative state to revert.
  async function reorder(draggedId: number, targetId: number): Promise<void> {
    if (draggedId === targetId) {
      return;
    }
    const snapshot = todos;
    const fromIndex = snapshot.findIndex((t) => t.id === draggedId);
    const toIndex = snapshot.findIndex((t) => t.id === targetId);
    if (fromIndex < 0 || toIndex < 0) {
      return;
    }
    const ordered = [...snapshot];
    const [moved] = ordered.splice(fromIndex, 1);
    ordered.splice(toIndex, 0, moved);
    const withOrder = ordered.map((t, i) => ({ ...t, sortOrder: i }));
    setTodos(withOrder);
    try {
      await reorderTodos(
        withOrder.map((t) => ({ id: t.id, sortOrder: t.sortOrder })),
        connectionIdRef.current,
      );
    } catch (err: unknown) {
      await refetchOnFailure(err instanceof Error ? err : new Error(String(err)));
    }
  }

  return { todos, loading, error, connected, add, toggle, saveText, remove, reorder };
}
