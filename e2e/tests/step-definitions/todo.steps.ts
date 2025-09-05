import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from 'playwright/test';
import { CustomWorld } from '../support/world.js';
import { TodoPage } from '../pages/TodoPage.js';

/**
 * Step definitions for Todo application BDD scenarios
 * These functions implement the steps defined in the .feature files
 */

// Background steps
Given('I open the todo application', async function (this: CustomWorld) {
  await this.goto('/'); // Navigate to the application first
  this.todoPage = new TodoPage(this.page); // Create TodoPage after page is available
  await this.todoPage.waitForPageLoad();
});

// Given steps (setup/preconditions)
Given('I have a todo {string}', async function (this: CustomWorld, todoText: string) {
  if (!this.todoPage) {
    await this.goto('/');
    this.todoPage = new TodoPage(this.page);
  }
  await this.todoPage.addTodo(todoText);
});

Given('I have the following todos:', async function (this: CustomWorld, dataTable: DataTable) {
  if (!this.todoPage) {
    await this.goto('/');
    this.todoPage = new TodoPage(this.page);
  }
  
  const todos = dataTable.hashes();
  
  for (const todo of todos) {
    await this.todoPage.addTodo(todo.todo);
    
    if (todo.completed === 'true') {
      await this.todoPage.completeTodo(todo.todo);
    }
  }
});

// When steps (actions)
When('I add a todo {string}', async function (this: CustomWorld, todoText: string) {
  await this.todoPage.addTodo(todoText);
});

When('I add a todo {string} using enter key', async function (this: CustomWorld, todoText: string) {
  await this.todoPage.addTodoWithEnter(todoText);
});

When('I try to add an empty todo', async function (this: CustomWorld) {
  // Try to add empty todo (should not work)
  await this.todoPage.addTodo('');
});

When('I mark {string} as completed', async function (this: CustomWorld, todoText: string) {
  await this.todoPage.completeTodo(todoText);
});

When('I mark {string} as not completed', async function (this: CustomWorld, todoText: string) {
  await this.todoPage.uncompleteTodo(todoText);
});

When('I delete {string}', async function (this: CustomWorld, todoText: string) {
  await this.todoPage.deleteTodo(todoText);
});

When('I add {int} todo items', async function (this: CustomWorld, count: number) {
  for (let i = 1; i <= count; i++) {
    await this.todoPage.addTodo(`Todo item ${i}`);
  }
});

// Then steps (assertions/verifications)
Then('I should see {string} in the todo list', async function (this: CustomWorld, todoText: string) {
  const todoExists = await this.todoPage.verifyTodoExists(todoText);
  expect(todoExists).toBeTruthy();
});

Then('I should not see {string} in the todo list', async function (this: CustomWorld, todoText: string) {
  const todoExists = await this.todoPage.verifyTodoDoesNotExist(todoText);
  expect(todoExists).toBeTruthy();
});

Then('the todo list should be empty', async function (this: CustomWorld) {
  const isEmpty = await this.todoPage.isTodoListEmpty();
  expect(isEmpty).toBeTruthy();
});

Then('the todo list should remain empty', async function (this: CustomWorld) {
  const isEmpty = await this.todoPage.isTodoListEmpty();
  expect(isEmpty).toBeTruthy();
});

Then('{string} should be marked as completed', async function (this: CustomWorld, todoText: string) {
  const completedTodos = await this.todoPage.getCompletedTodos();
  const isCompleted = completedTodos.some(todo => todo.includes(todoText));
  expect(isCompleted).toBeTruthy();
});

Then('{string} should not be marked as completed', async function (this: CustomWorld, todoText: string) {
  const activeTodos = await this.todoPage.getActiveTodos();
  const isActive = activeTodos.some(todo => todo.includes(todoText));
  expect(isActive).toBeTruthy();
});

Then('the todo counter should show {string}', async function (this: CustomWorld, expectedCount: string) {
  const counter = await this.todoPage.getTodoCounter();
  expect(counter).toBe(expectedCount);
});

Then('all {int} todos should be visible', async function (this: CustomWorld, expectedCount: number) {
  const todos = await this.todoPage.getTodos();
  expect(todos.length).toBe(expectedCount);
});

// Complex assertions with multiple expectations
Then('I should see the following todos in the list:', async function (this: CustomWorld, dataTable: DataTable) {
  const expectedTodos = dataTable.raw().flat();
  const actualTodos = await this.todoPage.getTodos();
  
  for (const expectedTodo of expectedTodos) {
    const todoExists = actualTodos.some(todo => todo.includes(expectedTodo));
    expect(todoExists).toBeTruthy();
  }
});

Then('the completed todos should include:', async function (this: CustomWorld, dataTable: DataTable) {
  const expectedCompletedTodos = dataTable.raw().flat();
  const actualCompletedTodos = await this.todoPage.getCompletedTodos();
  
  for (const expectedTodo of expectedCompletedTodos) {
    const isCompleted = actualCompletedTodos.some(todo => todo.includes(expectedTodo));
    expect(isCompleted).toBeTruthy();
  }
});

Then('the active todos should include:', async function (this: CustomWorld, dataTable: DataTable) {
  const expectedActiveTodos = dataTable.raw().flat();
  const actualActiveTodos = await this.todoPage.getActiveTodos();
  
  for (const expectedTodo of expectedActiveTodos) {
    const isActive = actualActiveTodos.some(todo => todo.includes(expectedTodo));
    expect(isActive).toBeTruthy();
  }
});

// Custom step for debugging
Then('I take a screenshot named {string}', async function (this: CustomWorld, screenshotName: string) {
  await this.takeScreenshot(screenshotName);
});

// Performance assertion
Then('the page should load within {int} seconds', async function (this: CustomWorld, maxSeconds: number) {
  const startTime = Date.now();
  await this.todoPage.waitForPageLoad();
  const endTime = Date.now();
  const loadTime = (endTime - startTime) / 1000;
  
  expect(loadTime).toBeLessThanOrEqual(maxSeconds);
});

// Accessibility checks (basic)
Then('the todo input should be accessible', async function (this: CustomWorld) {
  // Check if input has proper labels or aria-labels
  const input = this.page.locator('[data-testid="todo-input"], input[placeholder*="todo"]').first();
  
  // Check if input is focusable
  await input.focus();
  const isFocused = await input.evaluate(el => document.activeElement === el);
  expect(isFocused).toBeTruthy();
});

// Error handling steps
Then('I should see an error message {string}', async function (this: CustomWorld, errorMessage: string) {
  const errorElement = this.page.locator('.error, [data-testid="error"], .alert-danger');
  await expect(errorElement).toContainText(errorMessage);
});

Then('no error message should be displayed', async function (this: CustomWorld) {
  const errorElement = this.page.locator('.error, [data-testid="error"], .alert-danger');
  await expect(errorElement).not.toBeVisible();
});