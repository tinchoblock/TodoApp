import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import { useTodos } from './hooks/useTodos';

function App() {
  const { todos, loading, error, connected, add, toggle, saveText, remove, reorder } = useTodos();

  const statusLabel =
    connected === 'connected'
      ? 'Connected'
      : connected === 'reconnecting'
        ? 'Reconnecting…'
        : 'Disconnected';
  const statusDot = connected === 'connected' ? 'green' : connected === 'reconnecting' ? 'orange' : 'red';

  if (loading) {
    return (
      <div className="todo-app">
        <h1>TodoApp</h1>
        <p>Loading todos…</p>
      </div>
    );
  }

  return (
    <div className="todo-app">
      <h1>TodoApp</h1>
      <p className="connection-status" role="status" aria-live="polite">
        <span className="connection-dot" style={{ backgroundColor: statusDot }} aria-hidden="true" />
        {statusLabel}
      </p>
      {error && (
        <p role="alert" className="todo-error">
          {error}
        </p>
      )}
      <AddTodo onAdd={add} />
      {todos.length === 0 ? (
        <p>No todos yet.</p>
      ) : (
        <TodoList
          todos={todos}
          onToggle={toggle}
          onSave={saveText}
          onDelete={remove}
          onReorder={reorder}
        />
      )}
    </div>
  );
}

export default App;

