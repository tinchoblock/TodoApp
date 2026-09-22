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

export async function createTodo(description: string): Promise<Todo> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });
  return handleResponse<Todo>(res);
}

export async function updateTodo(id: number, payload: UpdateTodoPayload): Promise<Todo> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Todo>(res);
}

export async function reorderTodos(items: ReorderItem[]): Promise<void> {
  const res = await fetch(`${API_URL}/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items),
  });
  return handleResponse<void>(res);
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return handleResponse<void>(res);
}
