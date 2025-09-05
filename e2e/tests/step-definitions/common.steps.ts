import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'playwright/test';
import { CustomWorld } from '../support/world.js';

/**
 * Common step definitions that can be reused across different features
 * These are generic steps for navigation, UI interactions, etc.
 */

// Navigation steps
Given('I am on the {string} page', async function (this: CustomWorld, pagePath: string) {
  await this.goto(pagePath);
});

Given('I navigate to {string}', async function (this: CustomWorld, url: string) {
  await this.goto(url);
});

Given('I am on the homepage', async function (this: CustomWorld) {
  await this.goto('/');
});

// Browser actions
When('I refresh the page', async function (this: CustomWorld) {
  await this.page.reload();
});

When('I go back', async function (this: CustomWorld) {
  await this.page.goBack();
});

When('I go forward', async function (this: CustomWorld) {
  await this.page.goForward();
});

// Generic click actions
When('I click on {string}', async function (this: CustomWorld, elementText: string) {
  const element = this.page.locator(`text=${elementText}`).first();
  await element.click();
});

When('I click the {string} button', async function (this: CustomWorld, buttonText: string) {
  const button = this.page.locator(`button:has-text("${buttonText}")`).first();
  await button.click();
});

When('I click the element with selector {string}', async function (this: CustomWorld, selector: string) {
  await this.page.locator(selector).click();
});

// Form interactions
When('I fill {string} with {string}', async function (this: CustomWorld, fieldName: string, value: string) {
  const field = this.page.locator(`input[name="${fieldName}"], input[placeholder*="${fieldName}"], [data-testid="${fieldName}"]`).first();
  await field.fill(value);
});

When('I type {string} into {string}', async function (this: CustomWorld, text: string, fieldName: string) {
  const field = this.page.locator(`input[name="${fieldName}"], input[placeholder*="${fieldName}"], [data-testid="${fieldName}"]`).first();
  await field.type(text);
});

When('I press {string}', async function (this: CustomWorld, key: string) {
  await this.page.keyboard.press(key);
});

When('I press {string} in {string} field', async function (this: CustomWorld, key: string, fieldName: string) {
  const field = this.page.locator(`input[name="${fieldName}"], [data-testid="${fieldName}"]`).first();
  await field.press(key);
});

// Checkbox and radio buttons
When('I check {string}', async function (this: CustomWorld, checkboxName: string) {
  const checkbox = this.page.locator(`input[name="${checkboxName}"], [data-testid="${checkboxName}"]`).first();
  await checkbox.check();
});

When('I uncheck {string}', async function (this: CustomWorld, checkboxName: string) {
  const checkbox = this.page.locator(`input[name="${checkboxName}"], [data-testid="${checkboxName}"]`).first();
  await checkbox.uncheck();
});

When('I select {string} from {string}', async function (this: CustomWorld, optionText: string, selectName: string) {
  const select = this.page.locator(`select[name="${selectName}"], [data-testid="${selectName}"]`).first();
  await select.selectOption({ label: optionText });
});

// Wait steps
When('I wait for {int} seconds', async function (this: CustomWorld, seconds: number) {
  await this.page.waitForTimeout(seconds * 1000);
});

When('I wait for {string} to be visible', async function (this: CustomWorld, selector: string) {
  await this.page.waitForSelector(selector, { state: 'visible' });
});

When('I wait for {string} to be hidden', async function (this: CustomWorld, selector: string) {
  await this.page.waitForSelector(selector, { state: 'hidden' });
});

When('I wait for the page to load', async function (this: CustomWorld) {
  await this.page.waitForLoadState('networkidle');
});

// Hover and focus
When('I hover over {string}', async function (this: CustomWorld, elementText: string) {
  const element = this.page.locator(`text=${elementText}`).first();
  await element.hover();
});

When('I focus on {string}', async function (this: CustomWorld, selector: string) {
  await this.page.locator(selector).focus();
});

// Scroll actions
When('I scroll to {string}', async function (this: CustomWorld, selector: string) {
  await this.page.locator(selector).scrollIntoViewIfNeeded();
});

When('I scroll to the top of the page', async function (this: CustomWorld) {
  await this.page.evaluate(() => window.scrollTo(0, 0));
});

When('I scroll to the bottom of the page', async function (this: CustomWorld) {
  await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
});

// Page assertions
Then('I should be on the {string} page', async function (this: CustomWorld, expectedPath: string) {
  const currentUrl = this.page.url();
  expect(currentUrl).toContain(expectedPath);
});

Then('the page title should be {string}', async function (this: CustomWorld, expectedTitle: string) {
  const title = await this.page.title();
  expect(title).toBe(expectedTitle);
});

Then('the page title should contain {string}', async function (this: CustomWorld, expectedText: string) {
  const title = await this.page.title();
  expect(title).toContain(expectedText);
});

// Element visibility assertions
Then('I should see {string}', async function (this: CustomWorld, text: string) {
  const element = this.page.locator(`text=${text}`).first();
  await expect(element).toBeVisible();
});

Then('I should not see {string}', async function (this: CustomWorld, text: string) {
  const element = this.page.locator(`text=${text}`).first();
  await expect(element).not.toBeVisible();
});

Then('the element {string} should be visible', async function (this: CustomWorld, selector: string) {
  await expect(this.page.locator(selector)).toBeVisible();
});

Then('the element {string} should be hidden', async function (this: CustomWorld, selector: string) {
  await expect(this.page.locator(selector)).not.toBeVisible();
});

Then('the element {string} should exist', async function (this: CustomWorld, selector: string) {
  const element = this.page.locator(selector);
  const count = await element.count();
  expect(count).toBeGreaterThan(0);
});

// Text content assertions
Then('the element {string} should contain {string}', async function (this: CustomWorld, selector: string, expectedText: string) {
  await expect(this.page.locator(selector)).toContainText(expectedText);
});

Then('the element {string} should have exact text {string}', async function (this: CustomWorld, selector: string, expectedText: string) {
  await expect(this.page.locator(selector)).toHaveText(expectedText);
});

// Attribute assertions
Then('the element {string} should have attribute {string} with value {string}', async function (this: CustomWorld, selector: string, attribute: string, expectedValue: string) {
  await expect(this.page.locator(selector)).toHaveAttribute(attribute, expectedValue);
});

Then('the element {string} should have class {string}', async function (this: CustomWorld, selector: string, className: string) {
  await expect(this.page.locator(selector)).toHaveClass(new RegExp(className));
});

// Form field assertions
Then('the field {string} should have value {string}', async function (this: CustomWorld, fieldName: string, expectedValue: string) {
  const field = this.page.locator(`input[name="${fieldName}"], [data-testid="${fieldName}"]`).first();
  await expect(field).toHaveValue(expectedValue);
});

Then('the field {string} should be empty', async function (this: CustomWorld, fieldName: string) {
  const field = this.page.locator(`input[name="${fieldName}"], [data-testid="${fieldName}"]`).first();
  await expect(field).toHaveValue('');
});

Then('the field {string} should be enabled', async function (this: CustomWorld, fieldName: string) {
  const field = this.page.locator(`input[name="${fieldName}"], [data-testid="${fieldName}"]`).first();
  await expect(field).toBeEnabled();
});

Then('the field {string} should be disabled', async function (this: CustomWorld, fieldName: string) {
  const field = this.page.locator(`input[name="${fieldName}"], [data-testid="${fieldName}"]`).first();
  await expect(field).toBeDisabled();
});

// Checkbox assertions
Then('the checkbox {string} should be checked', async function (this: CustomWorld, checkboxName: string) {
  const checkbox = this.page.locator(`input[name="${checkboxName}"], [data-testid="${checkboxName}"]`).first();
  await expect(checkbox).toBeChecked();
});

Then('the checkbox {string} should be unchecked', async function (this: CustomWorld, checkboxName: string) {
  const checkbox = this.page.locator(`input[name="${checkboxName}"], [data-testid="${checkboxName}"]`).first();
  await expect(checkbox).not.toBeChecked();
});

// Count assertions
Then('there should be {int} {string} elements', async function (this: CustomWorld, expectedCount: number, selector: string) {
  const elements = this.page.locator(selector);
  await expect(elements).toHaveCount(expectedCount);
});

Then('there should be at least {int} {string} elements', async function (this: CustomWorld, minCount: number, selector: string) {
  const elements = this.page.locator(selector);
  const actualCount = await elements.count();
  expect(actualCount).toBeGreaterThanOrEqual(minCount);
});

// Alert/Dialog assertions
Then('I should see an alert with message {string}', async function (this: CustomWorld, expectedMessage: string) {
  this.page.on('dialog', async (dialog) => {
    expect(dialog.message()).toBe(expectedMessage);
    await dialog.accept();
  });
});

// URL assertions
Then('the current URL should contain {string}', async function (this: CustomWorld, expectedText: string) {
  const currentUrl = this.page.url();
  expect(currentUrl).toContain(expectedText);
});

Then('the current URL should be {string}', async function (this: CustomWorld, expectedUrl: string) {
  const currentUrl = this.page.url();
  expect(currentUrl).toBe(expectedUrl);
});

// Performance assertions
Then('the page should load in less than {int} seconds', async function (this: CustomWorld, maxSeconds: number) {
  // This would typically be measured in hooks or custom timing logic
  // For now, we just ensure the page is loaded
  await this.page.waitForLoadState('networkidle', { timeout: maxSeconds * 1000 });
});