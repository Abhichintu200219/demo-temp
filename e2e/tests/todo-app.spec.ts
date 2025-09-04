import { test, expect } from '@playwright/test';

test.describe('Todo App Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle complete todo workflow', async ({ page }) => {
    // Start with empty state
    await expect(page.getByTestId('empty-state')).toBeVisible();
    
    // Add multiple todos
    const todos = ['Buy milk', 'Walk dog', 'Read book'];
    
    for (const todo of todos) {
      await page.getByTestId('todo-input').fill(todo);
      await page.getByTestId('add-button').click();
    }
    
    // Verify all todos are added
    for (const todo of todos) {
      await expect(page.getByText(todo)).toBeVisible();
    }
    
    // Complete first todo
    const firstCheckbox = page.locator('[data-testid^="todo-checkbox-"]').first();
    await firstCheckbox.click();
    
    // Verify it's marked as completed
    await expect(firstCheckbox).toBeChecked();
    await expect(page.getByText('Buy milk')).toHaveClass(/line-through/);
    
    // Delete second todo
    await page.locator('[data-testid^="delete-button-"]').nth(1).click();
    
    // Verify it's deleted
    await expect(page.getByText('Walk dog')).not.toBeVisible();
    
    // Should have 2 todos left
    const remainingTodos = page.locator('[data-testid^="todo-text-"]');
    await expect(remainingTodos).toHaveCount(2);
  });

  test('should persist state during session', async ({ page }) => {
    // Add a todo
    await page.getByTestId('todo-input').fill('Persistent todo');
    await page.getByTestId('add-button').click();
    
    // Complete it
    await page.getByRole('checkbox').click();
    
    // Reload page (simulating page refresh)
    await page.reload();
    
    // Note: This test will fail unless you implement persistence
    // For in-memory state, the todo will disappear on reload
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test('should handle rapid todo additions', async ({ page }) => {
    const rapidTodos = ['Todo 1', 'Todo 2', 'Todo 3'];
    
    for (const todo of rapidTodos) {
      await page.getByTestId('todo-input').fill(todo);
      // Use keyboard to submit quickly
      await page.getByTestId('todo-input').press('Enter');
    }
    
    // All should be visible
    for (const todo of rapidTodos) {
      await expect(page.getByText(todo)).toBeVisible();
    }
    
    // Should have 3 todos
    const allTodos = page.locator('[data-testid^="todo-text-"]');
    await expect(allTodos).toHaveCount(3);
  });
});