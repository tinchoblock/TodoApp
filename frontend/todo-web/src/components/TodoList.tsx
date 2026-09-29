import { useRef, useState } from 'react';
import type { Todo } from '../api/todosApi';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => Promise<void> | void;
  onSave: (id: number, text: string) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
  onReorder: (draggedId: number, targetId: number) => Promise<void> | void;
}

function TodoList({ todos, onToggle, onSave, onDelete, onReorder }: TodoListProps) {
  // Already ordered by sortOrder from API — render as-is.
  // T08: HTML5 drag state lives here so TodoItem stays presentational.
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const draggedIdRef = useRef<number | null>(null);

  function handleDragStart(e: React.DragEvent, id: number) {
    draggedIdRef.current = id;
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', String(id));
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e: React.DragEvent, id: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== draggedIdRef.current) {
      setDragOverId(id);
    }
  }

  function handleDrop(e: React.DragEvent, targetId: number) {
    e.preventDefault();
    const raw = e.dataTransfer.getData('text/plain');
    const parsed = raw ? Number(raw) : draggedIdRef.current;
    const from = parsed ?? draggedIdRef.current;
    setDragOverId(null);
    setDraggedId(null);
    draggedIdRef.current = null;
    if (from == null || Number.isNaN(from) || from === targetId) {
      return;
    }
    void onReorder(from, targetId);
  }

  function handleDragEnd() {
    setDragOverId(null);
    setDraggedId(null);
    draggedIdRef.current = null;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          draggable
          isDragOver={dragOverId === todo.id && draggedId !== todo.id}
          onToggle={() => onToggle(todo.id)}
          onSave={(text) => onSave(todo.id, text)}
          onDelete={() => onDelete(todo.id)}
          onDragStart={(e) => handleDragStart(e, todo.id)}
          onDragOverItem={(e) => handleDragOver(e, todo.id)}
          onDropOnItem={(e) => handleDrop(e, todo.id)}
          onDragEnd={handleDragEnd}
        />
      ))}
    </ul>
  );
}

export default TodoList;
