import { Page, Locator } from 'playwright/test';
import { BasePage } from './BasePage.js';

/**
 * Page Object Model for Todo Application
 * Contains all selectors and methods for interacting with the Todo page
 */
export class TodoPage extends BasePage {
  // Page elements (selectors)
  private readonly todoInput: Locator;
  private readonly addButton: Locator;
  private readonly todoItems: Locator;
  private readonly todoStats: Locator;
  private readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize selectors based on your actual React component structure
    this.todoInput = page.locator('[data-testid="todo-input"]');
    this.addButton = page.locator('[data-testid="add-button"]');
    this.todoItems = page.locator('[data-testid^="todo-text-"]'); // Matches todo-text-{id}
    this.todoStats = page.locator('[data-testid="todo-stats"]');
    this.emptyState = page.locator('[data-testid="empty-state"]');
  }

  /**
   * Navigate to the Todo application
   */
  async navigate() {
    await this.page.goto('/');
    await this.waitForPageLoad();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add a new todo item
   */
  async addTodo(todoText: string) {
    if (!todoText.trim()) {
      // Try to add empty todo by clicking the button without text
      await this.addButton.click();
      return;
    }
    
    await this.todoInput.fill(todoText);
    await this.addButton.click();
    
    // Wait for the todo to appear in the list
    if (todoText.trim()) {
      await this.page.waitForFunction(
        (text) => {
          const todoElements = document.querySelectorAll('[data-testid^="todo-text-"]');
          return Array.from(todoElements).some(el => el.textContent?.includes(text));
        },
        todoText,
        { timeout: 5000 }
      );
    }
  }

  /**
   * Add a todo using Enter key
   */
  async addTodoWithEnter(todoText: string) {
    await this.todoInput.fill(todoText);
    await this.todoInput.press('Enter');
    
    // Wait for the todo to appear
    if (todoText.trim()) {
      await this.waitForTodoToAppear(todoText);
    }
  }

  /**
   * Get all todo items
   */
  async getTodos(): Promise<string[]> {
    // First check if there are any todos
    const isEmpty = await this.isTodoListEmpty();
    if (isEmpty) {
      return [];
    }
    
    await this.todoItems.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    const todos = await this.todoItems.allTextContents();
    return todos.filter(todo => todo.trim() !== '');
  }

  /**
   * Get completed todos
   */
  async getCompletedTodos(): Promise<string[]> {
    const completedItems = this.page.locator('[data-testid^="todo-checkbox-"]:checked').locator('xpath=..').locator('[data-testid^="todo-text-"]');
    const completed = await completedItems.allTextContents();
    return completed.filter(todo => todo.trim() !== '');
  }

  /**
   * Get active (incomplete) todos
   */
  async getActiveTodos(): Promise<string[]> {
    const activeItems = this.page.locator('[data-testid^="todo-checkbox-"]:not(:checked)').locator('xpath=..').locator('[data-testid^="todo-text-"]');
    const active = await activeItems.allTextContents();
    return active.filter(todo => todo.trim() !== '');
  }

  /**
   * Complete a todo by text content
   */
  async completeTodo(todoText: string) {
    // Find the todo item by text content, then find its checkbox
    const todoTextElement = this.page.locator(`[data-testid^="todo-text-"]:has-text("${todoText}")`).first();
    await todoTextElement.waitFor({ state: 'visible' });
    
    // Get the todo ID from the data-testid attribute
    const todoId = await todoTextElement.getAttribute('data-testid');
    if (todoId) {
      const id = todoId.replace('todo-text-', '');
      const checkbox = this.page.locator(`[data-testid="todo-checkbox-${id}"]`);
      await checkbox.check();
    }
    
    // Wait for visual feedback
    await this.page.waitForTimeout(500);
  }

  /**
   * Uncomplete a todo by text content
   */
  async uncompleteTodo(todoText: string) {
    const todoTextElement = this.page.locator(`[data-testid^="todo-text-"]:has-text("${todoText}")`).first();
    await todoTextElement.waitFor({ state: 'visible' });
    
    const todoId = await todoTextElement.getAttribute('data-testid');
    if (todoId) {
      const id = todoId.replace('todo-text-', '');
      const checkbox = this.page.locator(`[data-testid="todo-checkbox-${id}"]`);
      await checkbox.uncheck();
    }
  }

  /**
   * Delete a todo by text content
   */
  async deleteTodo(todoText: string) {
    const todoTextElement = this.page.locator(`[data-testid^="todo-text-"]:has-text("${todoText}")`).first();
    await todoTextElement.waitFor({ state: 'visible' });
    
    const todoId = await todoTextElement.getAttribute('data-testid');
    if (todoId) {
      const id = todoId.replace('todo-text-', '');
      const deleteButton = this.page.locator(`[data-testid="delete-button-${id}"]`);
      await deleteButton.click();
    }
    
    // Wait for the todo to be removed
    await this.waitForTodoToDisappear(todoText);
  }

  /**
   * Get the todo counter text
   */
  async getTodoCounter(): Promise<string> {
    try {
      const statsText = await this.todoStats.textContent();
      if (statsText) {
        return statsText.trim();
      }
      return '0 of 0 completed';
    } catch {
      return '0 of 0 completed';
    }
  }

  /**
   * Check if todo list is empty
   */
  async isTodoListEmpty(): Promise<boolean> {
    try {
      // Check if empty state is visible
      const emptyStateVisible = await this.emptyState.isVisible();
      if (emptyStateVisible) return true;
      
      // Check if there are any todo items
      const todoCount = await this.todoItems.count();
      return todoCount === 0;
    } catch {
      return true;
    }
  }

  /**
   * Wait for a specific todo to appear
   */
  async waitForTodoToAppear(todoText: string) {
    await this.page.waitForFunction(
      (text) => {
        const elements = document.querySelectorAll('[data-testid^="todo-text-"]');
        return Array.from(elements).some(el => el.textContent?.includes(text));
      },
      todoText,
      { timeout: 5000 }
    );
  }

  /**
   * Wait for a specific todo to disappear
   */
  async waitForTodoToDisappear(todoText: string) {
    await this.page.waitForFunction(
      (text) => {
        const elements = document.querySelectorAll('[data-testid^="todo-text-"]');
        return !Array.from(elements).some(el => el.textContent?.includes(text));
      },
      todoText,
      { timeout: 5000 }
    );
  }

  /**
   * Verify todo exists
   */
  async verifyTodoExists(todoText: string): Promise<boolean> {
    try {
      const todoElement = this.page.locator(`[data-testid^="todo-text-"]:has-text("${todoText}")`).first();
      return await todoElement.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify todo does not exist
   */
  async verifyTodoDoesNotExist(todoText: string): Promise<boolean> {
    try {
      const todoElement = this.page.locator(`[data-testid^="todo-text-"]:has-text("${todoText}")`).first();
      const isVisible = await todoElement.isVisible();
      return !isVisible;
    } catch {
      return true;
    }
  }
}