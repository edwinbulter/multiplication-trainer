import { test, expect } from '@playwright/test';

test.describe('User Logout', () => {
  test('should log out and return to login screen when clicking Uitloggen button', async ({ page }) => {
    // Navigate to the table selection page by logging in first
    await page.goto('/');
    
    // Fill in the username and log in
    await page.getByPlaceholder('Jouw naam').fill('Test User');
    await page.getByRole('button', { name: 'Start' }).click();
    
    // Wait for navigation to the tables page
    await page.waitForURL('**/tables');
    
    // Verify we're on the tables page
    await expect(page.getByRole('heading', { name: 'Welk tafeltje wil je oefenen?' })).toBeVisible();
    
    // Find and click the logout button
    const logoutButton = page.getByRole('button', { name: 'Uitloggen' });
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();
    
    // Verify we're redirected back to the login page
    await page.waitForURL('/');
    
    // Verify login screen elements are visible
    await expect(page.getByRole('heading', { name: 'Voer je naam in' })).toBeVisible();
    await expect(page.getByPlaceholder('Jouw naam')).toBeVisible();
    
    // Verify we can't go back to the tables page without logging in again
    await page.goto('/tables');
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Voer je naam in' })).toBeVisible();
  });
});