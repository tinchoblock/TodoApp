import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Todo } from '../api/todosApi';

interface TodoItemProps {
  todo: Todo;
  draggable: boolean;
  isDragOver: boolean;
  onToggle: () => Promise<void> | void;
  onSave: (text: string) => Promise<void> | void;
  onDelete: () => Promise<void> | void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOverItem: (e: React.DragEvent) => void;
  onDropOnItem: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

function TodoItem({ todo, draggable, isDragOver, onToggle, onSave, onDelete, onDragStart, onDragOverItem, onDropOnItem, onDragEnd }: TodoItemProps) {
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
    <li
      className={isDragOver ? 'todo-item drag-over' : 'todo-item'}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOverItem}
      onDrop={onDropOnItem}
      onDragEnd={onDragEnd}
    >
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
