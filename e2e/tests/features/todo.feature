# Feature file for Todo application BDD testing
# This file contains scenarios that match the current React component functionality

@todo @smoke
Feature: Todo Management
  As a user
  I want to manage my todo items
  So that I can keep track of tasks

  Background:
    Given I open the todo application

  @add-todo @positive
  Scenario: Add a new todo item
    When I add a todo "Buy groceries"
    Then I should see "Buy groceries" in the todo list
    And the todo counter should show "0 of 1 completed"

  @add-todo @positive
  Scenario: Add multiple todo items
    When I add a todo "Buy groceries"
    And I add a todo "Walk the dog"
    And I add a todo "Finish homework"
    Then I should see "Buy groceries" in the todo list
    And I should see "Walk the dog" in the todo list
    And I should see "Finish homework" in the todo list
    And the todo counter should show "0 of 3 completed"

  @add-todo @negative
  Scenario: Cannot add empty todo
    When I try to add an empty todo
    Then the todo list should remain empty

  @complete-todo @positive
  Scenario: Complete a todo item
    Given I have a todo "Buy groceries"
    When I mark "Buy groceries" as completed
    Then "Buy groceries" should be marked as completed
    And the todo counter should show "1 of 1 completed"

  @complete-todo @positive
  Scenario: Complete and uncomplete todo items
    Given I have a todo "Buy groceries"
    When I mark "Buy groceries" as completed
    And I mark "Buy groceries" as not completed
    Then "Buy groceries" should not be marked as completed
    And the todo counter should show "0 of 1 completed"

  @delete-todo @positive
  Scenario: Delete a todo item
    Given I have a todo "Buy groceries"
    When I delete "Buy groceries"
    Then I should not see "Buy groceries" in the todo list
    And the todo list should be empty

  @complete-multiple @positive
  Scenario: Complete multiple todo items
    Given I have a todo "Buy groceries"
    And I have a todo "Walk the dog"
    And I have a todo "Finish homework"
    When I mark "Buy groceries" as completed
    And I mark "Finish homework" as completed
    Then "Buy groceries" should be marked as completed
    And "Finish homework" should be marked as completed
    And "Walk the dog" should not be marked as completed
    And the todo counter should show "2 of 3 completed"

  @edge-case @positive
  Scenario: Handle special characters in todo text
    When I add a todo "Test with @#$%^&*() special characters"
    Then I should see "Test with @#$%^&*() special characters" in the todo list

  @performance @slow
  Scenario: Handle multiple todos
    When I add 10 todo items
    Then all 10 todos should be visible
    And the todo counter should show "0 of 10 completed"

  @mixed-operations @positive
  Scenario: Mix of adding, completing, and deleting todos
    When I add a todo "Task 1"
    And I add a todo "Task 2"
    And I add a todo "Task 3"
    And I mark "Task 2" as completed
    And I delete "Task 3"
    Then I should see "Task 1" in the todo list
    And I should not see "Task 3" in the todo list
    And "Task 2" should be marked as completed
    And the todo counter should show "1 of 2 completed"