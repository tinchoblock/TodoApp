import { useState, type FormEvent } from 'react';

interface AddTodoProps {
  onAdd: (text: string) => Promise<void> | void;
}

function AddTodo({ onAdd }: AddTodoProps) {
  const [input, setInput] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Empty text allowed (no validation).
    await onAdd(input);
    setInput('');
  }

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What needs to be done?"
        aria-label="New todo"
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddTodo;
