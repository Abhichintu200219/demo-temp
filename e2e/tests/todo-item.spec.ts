import { test, expect } from '@playwright/test';

test.describe('TodoItem Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Add a test todo
    await page.getByTestId('todo-input').fill('Test todo');
    await page.getByTestId('add-button').click();
  });

  test('should display todo text', async ({ page }) => {
    await expect(page.getByText('Test todo')).toBeVisible();
  });

  test('should toggle todo completion', async ({ page }) => {
    const todoText = page.getByText('Test todo');
    const checkbox = page.getByRole('checkbox');
    
    // Initially not completed
    await expect(checkbox).not.toBeChecked();
    await expect(todoText).not.toHaveClass(/line-through/);
    
    // Toggle completion
    await checkbox.click();
    
    // Should be completed
    await expect(checkbox).toBeChecked();
    await expect(todoText).toHaveClass(/line-through/);
    
    // Toggle back
    await checkbox.click();
    
    // Should be uncompleted again
    await expect(checkbox).not.toBeChecked();
    await expect(todoText).not.toHaveClass(/line-through/);
  });

  test('should delete todo', async ({ page }) => {
    const deleteButton = page.getByText('Delete');
    
    // Delete the todo
    await deleteButton.click();
    
    // Should no longer exist
    await expect(page.getByText('Test todo')).not.toBeVisible();
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });
});