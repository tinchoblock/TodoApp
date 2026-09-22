import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import { useTodos } from './hooks/useTodos';

function App() {
  const { todos, loading, error, add, toggle, saveText, remove } = useTodos();

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
        />
      )}
    </div>
  );
}

export default App;

