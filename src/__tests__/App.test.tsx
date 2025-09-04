import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App', () => {
  it('renders app title', () => {
    render(<App />);
    expect(screen.getByTestId('app-title')).toHaveTextContent('Simple Todo App');
  });

  it('shows empty state when no todos', () => {
    render(<App />);
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No todos yet. Add one above!');
  });

  it('adds a new todo', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const input = screen.getByTestId('todo-input');
    const button = screen.getByTestId('add-button');

    await user.type(input, 'My first todo');
    await user.click(button);

    expect(screen.getByText('My first todo')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  it('toggles todo completion', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Add a todo
    const input = screen.getByTestId('todo-input');
    const button = screen.getByTestId('add-button');
    await user.type(input, 'Toggle me');
    await user.click(button);

    // Toggle it
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('deletes a todo', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Add a todo
    const input = screen.getByTestId('todo-input');
    const addButton = screen.getByTestId('add-button');
    await user.type(input, 'Delete me');
    await user.click(addButton);

    expect(screen.getByText('Delete me')).toBeInTheDocument();

    // Delete it
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);

    expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('shows correct completion stats', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Add two todos
    const input = screen.getByTestId('todo-input');
    const addButton = screen.getByTestId('add-button');
    
    await user.type(input, 'First todo');
    await user.click(addButton);
    
    await user.type(input, 'Second todo');
    await user.click(addButton);

    // Complete one
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(screen.getByTestId('todo-stats')).toHaveTextContent('1 of 2 completed');
  });
});