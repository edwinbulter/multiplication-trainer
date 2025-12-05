import { test, expect } from '@playwright/test';

// These should match the DEFAULT_TABLES in TableSelection.jsx
const DEFAULT_TABLES = [0.125, 0.25, 1, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 25];

test.describe('Table Selection Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the table selection page by logging in first
    await page.goto('http://localhost:5173');
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
        await page.goto('http://localhost:5173/tables');
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
});