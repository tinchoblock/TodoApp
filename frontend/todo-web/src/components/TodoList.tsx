import type { Todo } from '../api/todosApi';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => Promise<void> | void;
  onSave: (id: number, text: string) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
}

function TodoList({ todos, onToggle, onSave, onDelete }: TodoListProps) {
  // Already ordered by sortOrder from API — render as-is.
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggle(todo.id)}
          onSave={(text) => onSave(todo.id, text)}
          onDelete={() => onDelete(todo.id)}
        />
      ))}
    </ul>
  );
}

export default TodoList;
