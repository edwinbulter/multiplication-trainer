import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Multiplication Trainer/);
});

test('displays "Voer je naam in" text above the input field', async ({ page }) => {
  await page.goto('/');
  
  // Find the heading with the text 'Voer je naam in'
  const heading = page.getByRole('heading', { name: 'Voer je naam in' });
  await expect(heading).toBeVisible();
  
  // Verify it's above the input field
  const input = page.getByPlaceholder('Jouw naam');
  await expect(input).toBeVisible();
  
  // Check that the heading is above the input field
  await expect(heading).toBeInViewport();
  await expect(input).toBeInViewport();
  
  // Get the positions to verify the heading is above the input
  const headingBox = await heading.boundingBox();
  const inputBox = await input.boundingBox();
  
  if (headingBox && inputBox) {
    expect(headingBox.y).toBeLessThan(inputBox.y);
  }
});

test('logs in with username and shows properly capitalized welcome message', async ({ page }) => {
    // Test different username cases
    const testCases = [
      { input: 'knappe kop', expected: 'Knappe kop' },
      { input: 'kNAPPE kOP', expected: 'Knappe kop' },
      { input: 'KnApPe KoP', expected: 'Knappe kop' },
      { input: 'KNARRE KOP', expected: 'Knarre kop' },
    ];

    for (const { input, expected } of testCases) {
      // Navigate to the login page
      await page.goto('/');

    // Fill in the username with different cases
    const inputField = page.getByPlaceholder('Jouw naam');
    await inputField.fill(input);
    
    const startButton = page.getByRole('button', { name: 'Start' });
    await startButton.click();

    // Wait for navigation to complete and verify URL
    await page.waitForURL('**/tables');
    
    // Verify the welcome message is displayed with the correctly capitalized username
    const welcomeMessage = page.getByRole('heading', {
      name: `Welkom ${expected}!`,
      exact: true
    });
    await expect(welcomeMessage).toBeVisible();
    
    // Verify the table selection screen is shown
    const tableSelectionTitle = page.getByText('Welk tafeltje wil je oefenen?');
    await expect(tableSelectionTitle).toBeVisible();
    
    // Log out for the next test case
    const logoutButton = page.getByRole('button', { name: 'Uitloggen' });
    await logoutButton.click();
    
    // Wait for navigation back to login
    await page.waitForURL('**/');
  }
});
