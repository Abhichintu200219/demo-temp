import { test, expect } from '@playwright/test';

test.describe('TodoForm Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/'); // Navigate to your app
  });

  test('should render input field and button', async ({ page }) => {
    await expect(page.getByTestId('todo-input')).toBeVisible();
    await expect(page.getByTestId('add-button')).toBeVisible();
    await expect(page.getByTestId('add-button')).toHaveText('Add Todo');
  });

  test('should add a new todo when form is submitted', async ({ page }) => {
    const todoText = 'Buy groceries';
    
    // Fill in the input
    await page.getByTestId('todo-input').fill(todoText);
    
    // Click the add button
    await page.getByTestId('add-button').click();
    
    // Verify the todo was added
    await expect(page.getByText(todoText)).toBeVisible();
    
    // Verify input is cleared
    await expect(page.getByTestId('todo-input')).toHaveValue('');
  });

  test('should not add empty todo', async ({ page }) => {
    // Try to submit empty form
    await page.getByTestId('add-button').click();
    
    // Should still show empty state
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test('should trim whitespace from todo text', async ({ page }) => {
    const todoText = '  Clean room  ';
    const trimmedText = 'Clean room';
    
    await page.getByTestId('todo-input').fill(todoText);
    await page.getByTestId('add-button').click();
    
    await expect(page.getByText(trimmedText)).toBeVisible();
  });

  test('should submit form on Enter key', async ({ page }) => {
    const todoText = 'Walk the dog';
    
    await page.getByTestId('todo-input').fill(todoText);
    await page.getByTestId('todo-input').press('Enter');
    
    await expect(page.getByText(todoText)).toBeVisible();
  });
});