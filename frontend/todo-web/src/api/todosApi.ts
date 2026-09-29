export interface Todo {
  id: number;
  description: string;
  isCompleted: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTodoPayload {
  description: string;
  isCompleted: boolean;
}

export interface ReorderItem {
  id: number;
  sortOrder: number;
}

export const API_URL = 'http://localhost:5000/api/todos';

export function withConnectionId(url: string, connectionId: string | null): string {
  if (!connectionId) {
    return url;
  }
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}connectionId=${encodeURIComponent(connectionId)}`;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed (${res.status}): ${text}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(API_URL);
  return handleResponse<Todo[]>(res);
}

export async function createTodo(description: string, connectionId?: string | null): Promise<Todo> {
  const res = await fetch(withConnectionId(API_URL, connectionId ?? null), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });
  return handleResponse<Todo>(res);
}

export async function updateTodo(id: number, payload: UpdateTodoPayload, connectionId?: string | null): Promise<Todo> {
  const res = await fetch(withConnectionId(`${API_URL}/${id}`, connectionId ?? null), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Todo>(res);
}

export async function reorderTodos(items: ReorderItem[], connectionId?: string | null): Promise<void> {
  const res = await fetch(withConnectionId(`${API_URL}/reorder`, connectionId ?? null), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items),
  });
  return handleResponse<void>(res);
}

export async function deleteTodo(id: number, connectionId?: string | null): Promise<void> {
  const res = await fetch(withConnectionId(`${API_URL}/${id}`, connectionId ?? null), { method: 'DELETE' });
  return handleResponse<void>(res);
}
