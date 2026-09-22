import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Todo } from '../api/todosApi';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => Promise<void> | void;
  onSave: (text: string) => Promise<void> | void;
  onDelete: () => Promise<void> | void;
}

function TodoItem({ todo, onToggle, onSave, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.description);
  const committedRef = useRef(false);

  useEffect(() => {
    if (!editing) {
      setDraft(todo.description);
    }
  }, [todo.description, editing]);

  function enterEditMode() {
    committedRef.current = false;
    setDraft(todo.description);
    setEditing(true);
  }

  function commit() {
    // Enter/blur saves (even ""). Guarded: Enter then blur fires only once.
    if (committedRef.current || !editing) {
      return;
    }
    committedRef.current = true;
    const text = draft;
    setEditing(false);
    void onSave(text);
  }

  function cancel() {
    // Esc cancels: restore original text, no save (blur after Esc is ignored).
    if (!editing) {
      return;
    }
    committedRef.current = true;
    setDraft(todo.description);
    setEditing(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      commit();
    } else if (e.key === 'Escape') {
      cancel();
    }
  }

  if (editing) {
    return (
      <li className="todo-item editing">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          aria-label="Edit todo"
        />
      </li>
    );
  }

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={onToggle}
        aria-label="Toggle completed"
      />
      <span
        onDoubleClick={enterEditMode}
        className={todo.isCompleted ? 'completed' : undefined}
        title="Double-click to edit"
      >
        {todo.description}
      </span>
      <button type="button" onClick={onDelete} aria-label="Delete todo">
        x
      </button>
    </li>
  );
}

export default TodoItem;
