import type{ Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="h-4 w-4 text-blue-600 rounded"
          data-testid={`todo-checkbox-${todo.id}`}
        />
        <span 
          className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
          data-testid={`todo-text-${todo.id}`}
        >
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded"
        data-testid={`delete-button-${todo.id}`}
      >
        Delete
      </button>
    </div>
  );
};