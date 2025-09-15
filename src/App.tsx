import { useState } from 'react';
import { TodoForm } from './components/TodoForm';
import { TodoItem } from './components/TodoItem';
import type{ Todo } from './types/todo';
import './App.css';
import SearchBar from './components/SearchBar';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    // <div className="min-h-screen bg-gray-50 py-8">
    //   <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
    //     <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center" data-testid="app-title">
    //       Simple Todo App
    //     </h1>
        
    //     <TodoForm onAdd={addTodo} />
        
    //     {todos.length > 0 && (
    //       <div className="mb-4 text-sm text-gray-600" data-testid="todo-stats">
    //         {completedCount} of {totalCount} completed
    //       </div>
    //     )}
        
    //     <div className="space-y-2" data-testid="todo-list">
    //       {todos.length === 0 ? (
    //         <p className="text-gray-500 text-center py-4" data-testid="empty-state">
    //           No todos yet. Add one above!
    //         </p>
    //       ) : (
    //         todos.map(todo => (
    //           <TodoItem
    //             key={todo.id}
    //             todo={todo}
    //             onToggle={toggleTodo}
    //             onDelete={deleteTodo}
    //           />
    //         ))
    //       )}
    //     </div>
    //   </div>
    // </div>
    <div className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('https://wallpapers.com/images/featured/digital-art-background-98hwar6swibxmlqv.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* overlay using inline style to avoid Tailwind-arbitrary issues */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />

      <div className="relative z-10 w-full px-4">
        <SearchBar />
      </div>

    </div>
  );
}

export default App;