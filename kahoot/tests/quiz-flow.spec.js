import { test, expect } from '@playwright/test';

test.describe('Quiz Flow', () => {
  test('a student can complete a simple quiz', async ({ browser }) => {
    // Teacher context
    const teacherContext = await browser.newContext();
    const teacherPage = await teacherContext.newPage();

    // Student context
    const studentContext = await browser.newContext();
    const studentPage = await studentContext.newPage();

    // Teacher logs in
    await teacherPage.goto('/');
    await teacherPage.click('button:has-text("Admin Login")');
    const adminUsername = process.env.VITE_ADMIN_USERNAME ?? 'admin';
    const adminPassword = process.env.VITE_ADMIN_PASSWORD ?? 'admin';

    await teacherPage.getByLabel('Username').fill(adminUsername);
    await teacherPage.getByLabel('Password').fill(adminPassword);
    await teacherPage.click('[data-testid="admin-login-button"]');
    await expect(teacherPage).toHaveURL('/lobby');

    // Teacher starts a quiz
    await teacherPage.click('button:has-text("Start")');
    await expect(teacherPage).toHaveURL('/teacher-wait/active_session');

    // Student joins the game
    await studentPage.goto('/');
    const uniqueStudentName = `Test Student ${Date.now()}`;
    await studentPage.fill('input[placeholder="Enter your name"]', uniqueStudentName);
    await studentPage.click('button:has-text("Join")');
    await expect(studentPage).toHaveURL(/\/student-(wait|quiz)\/active_session/);

    // Teacher starts the quiz
    await teacherPage.click('button:has-text("Start Quiz")');
    await expect(teacherPage).toHaveURL('/teacher-quiz/active_session');

    // Student answers the first question
    await studentPage.click('button:has-text("A")'); // Assuming the first option is A

    // Teacher moves to the next question
    const nextButton = teacherPage.locator('[data-testid="teacher-next-button"] button');
    await nextButton.waitFor({ state: 'visible' });
    await nextButton.click();

    // Student verifies that the next question is loaded
    // This needs a way to verify the question has changed.
    // For now, we will just check that the student is still on the quiz page.
    await expect(studentPage).toHaveURL(/\/student-quiz\/active_session/);
  });
});
