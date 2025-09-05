import { Page } from '@playwright/test';

export class TestHelpers {
  static async waitForPageLoad(page: Page, timeout = 30000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static async takeScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshots/${name}-${timestamp}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    return filename;
  }

  static async clearAllTodos(page: Page) {
    const deleteBtns = page.locator('[data-testid^="delete-button-"]');
    const count = await deleteBtns.count();
    
    for (let i = 0; i < count; i++) {
      await deleteBtns.first().click();
      await page.waitForTimeout(100); // Small delay to ensure DOM updates
    }
  }

  static generateRandomTodoText(): string {
    const actions = ['Buy', 'Read', 'Write', 'Call', 'Visit', 'Clean', 'Organize', 'Plan'];
    const objects = ['groceries', 'book', 'email', 'friend', 'doctor', 'house', 'desk', 'meeting'];
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    const object = objects[Math.floor(Math.random() * objects.length)];
    
    return `${action} ${object}`;
  }

  static async waitForTodoCount(page: Page, expectedCount: number, timeout = 5000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const todos = page.locator('[data-testid^="todo-text-"]');
      const actualCount = await todos.count();
      
      if (actualCount === expectedCount) {
        return true;
      }
      
      await page.waitForTimeout(100);
    }
    
    throw new Error(`Expected ${expectedCount} todos, but got different count after ${timeout}ms`);
  }

  static async getStatsText(page: Page): Promise<string> {
    const statsElement = page.getByTestId('todo-stats');
    return await statsElement.textContent() || '';
  }

  static parseStatsText(statsText: string): { completed: number; total: number } {
    const match = statsText.match(/(\d+) of (\d+) completed/);
    if (!match) {
      throw new Error(`Invalid stats format: ${statsText}`);
    }
    
    return {
      completed: parseInt(match[1]),
      total: parseInt(match[2])
    };
  }
}