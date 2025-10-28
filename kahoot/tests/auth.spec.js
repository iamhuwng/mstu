import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(msg.text()));
  });

test('Student can join the game', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/?test=true');

    // Fill in the student name
    const uniqueStudentName = `Test Student ${Date.now()}`;
    await page.fill('input[placeholder="Enter your name"]', uniqueStudentName);

    // Click the join button
    await page.click('button:has-text("Join")');

    // Verify redirection to the waiting room
    await expect(page).toHaveURL(/\/student-(wait|quiz)\/.+/);
    await expect(page.getByPlaceholder('Enter your name')).not.toBeVisible();
  });

test('Admin can log in', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/');

    // Click the admin login button
    await page.click('button:has-text("Admin Login")');

    // Fill in the admin credentials and login
    const adminUsername = process.env.VITE_ADMIN_USERNAME ?? 'admin';
    const adminPassword = process.env.VITE_ADMIN_PASSWORD ?? 'admin';

    await page.getByLabel('Username').fill(adminUsername);
    await page.getByLabel('Password').fill(adminPassword);
    await page.click('[data-testid="admin-login-button"]');

    // Verify redirection to the teacher lobby
    await expect(page).toHaveURL('/lobby');
    await expect(page.getByRole('heading', { name: 'Teacher Lobby' })).toBeVisible();
  });
});
