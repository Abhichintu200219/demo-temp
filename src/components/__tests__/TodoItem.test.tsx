import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '../TodoItem';
import type{ Todo } from '../../types/todo';
import { vi } from 'vitest';

const mockTodo: Todo = {
  id: '1',
  text: 'Test todo',
  completed: false,
  createdAt: new Date(),
};

const mockOnToggle = vi.fn();
const mockOnDelete = vi.fn();

describe('TodoItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders todo text', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    const checkbox = screen.getByTestId('todo-checkbox-1');
    fireEvent.click(checkbox);
    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    const deleteButton = screen.getByTestId('delete-button-1');
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('shows completed styling when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    const todoText = screen.getByTestId('todo-text-1');
    expect(todoText).toHaveClass('line-through', 'text-gray-500');
  });

  it('shows uncompleted styling when todo is not completed', () => {
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    const todoText = screen.getByTestId('todo-text-1');
    expect(todoText).toHaveClass('text-gray-900');
    expect(todoText).not.toHaveClass('line-through');
  });
});