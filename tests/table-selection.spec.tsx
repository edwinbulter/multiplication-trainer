import { test, expect } from '@playwright/test';

// These should match the DEFAULT_TABLES in TableSelection.jsx
const DEFAULT_TABLES = [0.125, 0.25, 1, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 25];

test.describe('Table Selection Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the table selection page by logging in first
    await page.goto('/');
    await page.getByPlaceholder('Jouw naam').fill('Test User');
    await page.getByRole('button', { name: 'Start' }).click();
    await page.waitForURL('**/tables');
  });

  test('should display the scoreboard button and navigate to scores page when clicked', async ({ page }) => {
    // Verify the scoreboard button is visible
    const scoreboardButton = page.getByRole('button', { name: 'Bekijk Scorebord' });
    await expect(scoreboardButton).toBeVisible();
    
    // Click the scoreboard button
    await scoreboardButton.click();
    
    // Verify navigation to the scores page
    await expect(page).toHaveURL(/\/scores$/);
    
    // Verify the scores page content is displayed
    const scoresTitle = page.getByRole('heading', { name: /scorebord/i });
    await expect(scoresTitle).toBeVisible();
  });

  test('should display all default table buttons and navigate to practice screen when clicked', async ({ page }) => {
    // Test a subset of tables to keep the test fast
    const testTables = [1, 5, 10, 2.5]; // Testing different number formats
    
    for (const table of testTables) {
      // Navigate back to tables page if not already there
      if (!page.url().includes('/tables')) {
        await page.goto('/tables');
      }
      
      // Format the table number to match the button text (comma as decimal separator)
      const buttonText = table.toString().replace('.', ',');
      
      // Find and verify the button exists and is visible
      const tableButton = page.getByRole('button', { name: buttonText, exact: true });
      await expect(tableButton).toBeVisible();
      
      // Click the button
      await tableButton.click();
      
      // Verify navigation to the practice screen with the correct table
      await expect(page).toHaveURL(new RegExp(`/practice/${table}$`));
      
      // Verify we're on the practice screen by checking for the question input
      const questionInput = page.getByRole('textbox', { name: /antwoord/i });
      await expect(questionInput).toBeVisible();
      
      // Go back to tables page for the next iteration
      await page.goBack();
      await page.waitForURL('**/tables');
    }
  });

  test('should display all default table buttons', async ({ page }) => {
    // Verify all default table buttons are displayed
    for (const table of DEFAULT_TABLES) {
      const buttonText = table.toString().replace('.', ',');
      const tableButton = page.getByRole('button', { name: buttonText, exact: true });
      await expect(tableButton).toBeVisible();
    }
  });

  test('should allow custom table selection with valid numbers', async ({ page }) => {
    // Check that the custom input section exists
    const customLabel = page.getByText('Of kies je eigen getal:');
    await expect(customLabel).toBeVisible();
    
    // Find the custom input field
    const customInput = page.getByPlaceholder('Bijv. 7 of 1,5');
    await expect(customInput).toBeVisible();
    
    // Test valid inputs (both comma and dot as decimal separator)
    const validInputs = [
      { input: '7', expected: '7' },
      { input: '3.5', expected: '3.5' },
      { input: '12,75', expected: '12.75' },
      { input: '0.5', expected: '0.5' },
      { input: '100', expected: '100' }
    ];

    for (const { input, expected } of validInputs) {
      // Clear the input field
      await customInput.fill('');
      
      // Type the test input
      await customInput.type(input);
      
      // Verify the input value is correct (should accept both . and , as decimal separator)
      const inputValue = await customInput.inputValue();
      expect(inputValue).toBe(input);
      
      // Click the start button
      const startButton = page.getByRole('button', { name: 'Start' });
      await startButton.click();
      
      // Verify navigation to the practice screen with the correct table
      await expect(page).toHaveURL(new RegExp(`/practice/${expected}$`));
      
      // Verify we're on the practice screen
      const questionInput = page.getByRole('textbox', { name: /antwoord/i });
      await expect(questionInput).toBeVisible();
      
      // Go back to tables page for the next test case
      await page.goBack();
      await page.waitForURL('**/tables');
    }
  });

  test('should not allow non-numeric input in custom table field', async ({ page }) => {
    const customInput = page.getByPlaceholder('Bijv. 7 of 1,5');
    
    // Test various invalid inputs
    const invalidInputs = [
      'abc',
      '1a2b',
      '12!@#',
      'ten',
      '1.2.3',
      '1,2,3',
      '1.2,3',
      '1,2.3'
    ];

    for (const input of invalidInputs) {
      await customInput.fill('');
      await customInput.type(input);
      
      // Get the actual value after input
      const actualValue = await customInput.inputValue();
      
      // The input should either be empty or contain only numbers and at most one decimal separator
      const isValid = /^\d*[.,]?\d*$/.test(actualValue);
      expect(isValid).toBe(true);
      
      // The start button should be disabled if the input is invalid
      const startButton = page.getByRole('button', { name: 'Start' });
      const isDisabled = await startButton.getAttribute('disabled');
      
      // If the input is invalid (not a valid number), the button should be disabled
      if (!/^\d+([.,]\d+)?$/.test(actualValue) && actualValue !== '') {
        expect(isDisabled).not.toBeNull();
      }
    }
  });
});