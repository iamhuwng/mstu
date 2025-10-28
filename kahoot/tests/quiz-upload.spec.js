import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

test.describe('Quiz Upload Flow', () => {
  test('Teacher can upload a quiz', async ({ page }) => {
    page.on('console', msg => console.log(msg.text()));
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

    // Click the add quiz button
    await page.click('button:has-text("Upload Quiz")');

    const uploadModal = page.getByRole('dialog', { name: 'Upload New Quiz' });
    await expect(uploadModal).toBeVisible();

    // Upload the sample quiz file
    const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'sample-quiz.json');
    await page.setInputFiles('input[type="file"]', filePath);

    await uploadModal.locator('form').evaluate((form) => {
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    });

    await expect(uploadModal).not.toBeVisible();

    // Verify that the new quiz appears in the lobby
    await expect(page.getByRole('heading', { name: 'Sample Quiz for E2E Test' }).first()).toBeVisible();
  });
});
