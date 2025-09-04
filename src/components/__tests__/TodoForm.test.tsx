import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from '../TodoForm';
import { vi } from 'vitest';

const mockOnAdd = vi.fn();

describe('TodoForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input and button', () => {
    render(<TodoForm onAdd={mockOnAdd} />);
    expect(screen.getByTestId('todo-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toBeInTheDocument();
  });

  it('calls onAdd when form is submitted with valid text', async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={mockOnAdd} />);
    
    const input = screen.getByTestId('todo-input');
    const button = screen.getByTestId('add-button');

    await user.type(input, 'New todo item');
    await user.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith('New todo item');
  });

  it('clears input after successful submission', async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={mockOnAdd} />);
    
    const input = screen.getByTestId('todo-input') as HTMLInputElement;
    const button = screen.getByTestId('add-button');

    await user.type(input, 'New todo item');
    await user.click(button);

    expect(input.value).toBe('');
  });

  it('does not call onAdd with empty text', async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={mockOnAdd} />);
    
    const button = screen.getByTestId('add-button');
    await user.click(button);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('trims whitespace from input', async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={mockOnAdd} />);
    
    const input = screen.getByTestId('todo-input');
    const button = screen.getByTestId('add-button');

    await user.type(input, '  New todo item  ');
    await user.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith('New todo item');
  });
});