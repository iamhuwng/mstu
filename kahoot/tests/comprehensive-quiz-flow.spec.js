import { test, expect } from '@playwright/test';

test.describe('Comprehensive Quiz Flow', () => {
  test('a student can complete a comprehensive quiz', async ({ browser }) => {
    // Teacher context
    const teacherContext = await browser.newContext();
    const teacherPage = await teacherContext.newPage();

    // Student context
    const studentContext = await browser.newContext();
    const studentPage = await studentContext.newPage();

    const clickNextQuestion = async () => {
      const nextButton = teacherPage.locator('[data-testid="teacher-next-button"] button');
      await nextButton.waitFor({ state: 'visible' });
      await nextButton.click();
    };

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
    const uniqueStudentName = `Comprehensive Student ${Date.now()}`;
    await studentPage.fill('input[placeholder="Enter your name"]', uniqueStudentName);
    await studentPage.click('button:has-text("Join")');
    await expect(studentPage).toHaveURL(/\/student-(wait|quiz)\/active_session/);

    // Teacher starts the quiz
    await teacherPage.click('button:has-text("Start Quiz")');
    await expect(teacherPage).toHaveURL('/teacher-quiz/active_session');

    // --- Question 1: Multiple Choice ---
    await studentPage.click('button:has-text("Paris")');
    await clickNextQuestion();

    // --- Question 2: Multiple Choice ---
    await studentPage.click('button:has-text("Mars")');
    await clickNextQuestion();

    // --- Question 3: Multiple Select ---
    await studentPage.check('input[type="checkbox"][value="Red"]');
    await studentPage.check('input[type="checkbox"][value="Blue"]');
    await studentPage.check('input[type="checkbox"][value="Yellow"]');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 4: Multiple Choice ---
    await studentPage.click('button:has-text("56")');
    await clickNextQuestion();

    // --- Question 5: Multiple Select ---
    await studentPage.check('input[type="checkbox"][value="Python"]');
    await studentPage.check('input[type="checkbox"][value="JavaScript"]');
    await studentPage.check('input[type="checkbox"][value="Java"]');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 6: Multiple Choice ---
    await studentPage.click('button:has-text("William Shakespeare")');
    await clickNextQuestion();

    // --- Question 7: Multiple Select ---
    await studentPage.check('input[type="checkbox"][value="Dolphin"]');
    await studentPage.check('input[type="checkbox"][value="Whale"]');
    await studentPage.check('input[type="checkbox"][value="Bat"]');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 8: Multiple Choice ---
    await studentPage.click('button:has-text("Au")');
    await clickNextQuestion();

    // --- Question 9: Multiple Select ---
    await studentPage.check('input[type="checkbox"][value="Canada"]');
    await studentPage.check('input[type="checkbox"][value="Mexico"]');
    await studentPage.check('input[type="checkbox"][value="United States"]');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 10: Multiple Choice ---
    await studentPage.click('button:has-text("7")');
    await clickNextQuestion();

    // --- Question 11: Multiple Select ---
    await studentPage.check('input[type="checkbox"][value="Solar"]');
    await studentPage.check('input[type="checkbox"][value="Wind"]');
    await studentPage.check('input[type="checkbox"][value="Hydroelectric"]');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 12: Multiple Choice ---
    await studentPage.click('button:has-text("Pacific Ocean")');
    await clickNextQuestion();

    // --- Question 13: Multiple Select ---
    await studentPage.check('input[type="checkbox"][value="Equilateral"]');
    await studentPage.check('input[type="checkbox"][value="Scalene"]');
    await studentPage.check('input[type="checkbox"][value="Isosceles"]');
    await studentPage.check('input[type="checkbox"][value="Right"]');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 14: Multiple Choice ---
    await studentPage.click('button:has-text("1945")');
    await clickNextQuestion();

    // --- Question 15: Multiple Select ---
    await studentPage.check('input[type="checkbox"][value="Chrome"]');
    await studentPage.check('input[type="checkbox"][value="Firefox"]');
    await studentPage.check('input[type="checkbox"][value="Safari"]');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 16: Multiple Choice ---
    await studentPage.click('button:has-text("2")');
    await clickNextQuestion();

    // --- Question 17: Multiple Select ---
    await studentPage.check('input[type="checkbox"][value="Hamlet"]');
    await studentPage.check('input[type="checkbox"][value="Macbeth"]');
    await studentPage.check('input[type="checkbox"][value="Othello"]');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 18: Multiple Choice ---
    await studentPage.click('button:has-text("300,000 km/s")');
    await clickNextQuestion();

    // --- Question 19: Multiple Select ---
    await studentPage.check('input[type="checkbox"][value="Windows"]');
    await studentPage.check('input[type="checkbox"][value="Linux"]');
    await studentPage.check('input[type="checkbox"][value="macOS"]');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 20: Multiple Choice ---
    await studentPage.click('button:has-text("Leonardo da Vinci")');
    await clickNextQuestion();

    // --- Question 21: Completion (Word Bank) ---
    await studentPage.click('button:has-text("Tokyo")');
    await clickNextQuestion();

    // --- Question 22: Completion (Word Bank) ---
    await studentPage.click('button:has-text("0")');
    await clickNextQuestion();

    // --- Question 23: Completion (Word Bank) ---
    await studentPage.click('button:has-text("H2O")');
    await clickNextQuestion();

    // --- Question 24: Completion (Word Bank) ---
    await studentPage.click('button:has-text("George Washington")');
    await clickNextQuestion();

    // --- Question 25: Completion (Word Bank) ---
    await studentPage.click('button:has-text("Nile")');
    await clickNextQuestion();

    // --- Question 26: Completion (Typed) ---
    await studentPage.fill('input[type="text"]', 'Rome');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 27: Matching ---
    await studentPage.selectOption('select:near(:text("Japan"))', 'opt-b');
    await studentPage.selectOption('select:near(:text("Canada"))', 'opt-c');
    await studentPage.selectOption('select:near(:text("Australia"))', 'opt-a');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 28: Matching ---
    await studentPage.selectOption('select:near(:text("Oxygen"))', 'opt-a');
    await studentPage.selectOption('select:near(:text("Carbon"))', 'opt-b');
    await studentPage.selectOption('select:near(:text("Nitrogen"))', 'opt-c');
    await studentPage.selectOption('select:near(:text("Hydrogen"))', 'opt-d');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 29: Matching ---
    await studentPage.selectOption('select:near(:text("Mercury"))', 'opt-a');
    await studentPage.selectOption('select:near(:text("Venus"))', 'opt-b');
    await studentPage.selectOption('select:near(:text("Earth"))', 'opt-c');
    await studentPage.selectOption('select:near(:text("Mars"))', 'opt-d');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 30: Matching ---
    await studentPage.selectOption('select:near(:text("Addition"))', 'opt-a');
    await studentPage.selectOption('select:near(:text("Subtraction"))', 'opt-b');
    await studentPage.selectOption('select:near(:text("Multiplication"))', 'opt-c');
    await studentPage.selectOption('select:near(:text("Division"))', 'opt-d');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 31: Matching ---
    await studentPage.selectOption('select:near(:text("Variable"))', 'opt-a');
    await studentPage.selectOption('select:near(:text("Function"))', 'opt-b');
    await studentPage.selectOption('select:near(:text("Loop"))', 'opt-c');
    await studentPage.selectOption('select:near(:text("Condition"))', 'opt-d');
    await studentPage.click('button:has-text("Submit")');
    await clickNextQuestion();

    // --- Question 32: Diagram Labeling ---
    await studentPage.fill('input:near(:text("Converts light energy into chemical energy."))', 'Chloroplast');
    await studentPage.fill('input:near(:text("The rigid outer layer of a plant cell."))', 'Cell wall');
    await studentPage.click('button:has-text("Submit")');
    await teacherPage.click('button:has-text("Finish Quiz")');

    // ... and so on for all the questions

    // After the last question, navigate to the results page
    await expect(teacherPage).toHaveURL('/teacher-results/active_session');
    await expect(studentPage).toHaveURL('/student-results/active_session');

    // Verify the student's score
    const studentScore = await studentPage.textContent('[data-testid="student-score"]');
    expect(studentScore).toBe('100'); // Or whatever the expected score is
  });
});
