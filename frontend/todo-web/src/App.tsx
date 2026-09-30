import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import { useTodos } from './hooks/useTodos';

function App() {
  const { todos, loading, error, connected, retry, add, toggle, saveText, remove, reorder } = useTodos();

  const statusLabel =
    connected === 'connected'
      ? 'Connected'
      : loading
        ? 'Connecting…'
        : connected === 'reconnecting'
          ? 'Reconnecting… (retrying)'
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
          {error}{' '}
          {connected !== 'connected' && (
            <button type="button" onClick={retry}>
              Retry now
            </button>
          )}
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

