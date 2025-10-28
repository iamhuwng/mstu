# Testing Guide: Quiz Question Editor Feature

**Feature:** Comprehensive Quiz Question Editor  
**Implementation Date:** October 22, 2025  
**PRD Reference:** `documentation/tasks/0007-prd-quiz-question-editor.md`

## Pre-Testing Setup

### 1. Environment Preparation
```bash
# Ensure all dependencies are installed
npm install

# Start the development server
npm run dev

# In another terminal, start Firebase emulator (if using)
firebase emulators:start
```

### 2. Test Data Preparation
- Ensure you have at least one quiz in the database
- Use `tests/comprehensive-mock-quiz.json` for comprehensive testing
- Upload via Teacher Lobby → Upload Quiz button

### 3. Browser DevTools Setup
- Open Browser DevTools (F12)
- Navigate to Application → Local Storage
- Keep Console open for error monitoring

## Test Scenarios

### Scenario 1: Basic Modal Opening and Closing

**Objective:** Verify modal opens and closes correctly

**Steps:**
1. Navigate to Teacher Lobby (`/lobby`)
2. Click "Edit" button on any quiz card
3. Verify EditQuizModal opens with question list
4. Click outside the modal
   - **Expected:** Nothing happens (modal stays open)
5. Click "Cancel" button
   - **Expected:** Modal closes (no unsaved changes yet)
6. Click "Edit" again
7. Click the X button in modal header
   - **Expected:** Modal closes

**Pass Criteria:**
- ✅ Modal opens smoothly
- ✅ Question list displays all questions
- ✅ Click outside does nothing
- ✅ Cancel/X button closes modal

---

### Scenario 2: Question Selection and Editor Panel

**Objective:** Verify question selection and editor panel behavior

**Steps:**
1. Open Edit modal
2. Click on Question 1
   - **Expected:** Right panel slides in with editor
3. Verify editor shows:
   - Question number (e.g., "Editing Question 1 of 10")
   - Previous button (disabled on first question)
   - Next button (enabled)
   - All editable fields populated
4. Click on Question 1 again
   - **Expected:** Right panel closes
5. Click on Question 2
   - **Expected:** Right panel opens with Question 2 data
6. Click on Question 3 (without closing Question 2)
   - **Expected:** Right panel updates to show Question 3 data

**Pass Criteria:**
- ✅ Right panel slides in/out smoothly
- ✅ Correct question data displayed
- ✅ Navigation buttons state correct
- ✅ Panel updates when switching questions

---

### Scenario 3: Resizable Left Panel

**Objective:** Verify left panel resizing functionality

**Steps:**
1. Open Edit modal
2. Click on any question to open right panel
3. Locate the resize handle (gray bar between panels)
4. Hover over resize handle
   - **Expected:** Handle turns purple, cursor changes to col-resize
5. Click and drag handle to the left
   - **Expected:** Left panel shrinks (minimum 300px)
6. Drag handle to the right
   - **Expected:** Left panel expands (maximum 600px)
7. Try to drag beyond limits
   - **Expected:** Panel stops at min/max width

**Pass Criteria:**
- ✅ Resize handle visible and interactive
- ✅ Smooth resizing during drag
- ✅ Min/max constraints enforced
- ✅ Visual feedback on hover

---

### Scenario 4: Field Editing and Auto-Save

**Objective:** Verify field editing and localStorage auto-save

**Steps:**
1. Open Edit modal and select Question 1
2. Edit the question text (e.g., add "TEST" to the end)
3. Open DevTools → Application → Local Storage
4. Find key `quiz_edit_<quizId>`
   - **Expected:** Key exists with edited data
5. Edit an answer option
6. Check localStorage again
   - **Expected:** Updated with new option text
7. Change the timer value
8. Verify localStorage updated
9. Close the modal (click Cancel)
   - **Expected:** Validation popup appears (unsaved changes)
10. Click "Continue Editing"
11. Close browser tab and reopen
12. Navigate back to Teacher Lobby and click Edit
    - **Expected:** Modal loads with previously edited data

**Pass Criteria:**
- ✅ Changes auto-save to localStorage
- ✅ localStorage structure correct
- ✅ Data persists across modal close/open
- ✅ Data persists across browser refresh

---

### Scenario 5: Validation Warnings (Real-time)

**Objective:** Verify real-time validation warnings

**Steps:**
1. Open Edit modal and select Question 1
2. Clear the question text field completely
   - **Expected:** Red border appears, warning text shows below field
3. Clear Option A text
   - **Expected:** Red border on Option A, warning text appears
4. Restore question text
   - **Expected:** Red border and warning disappear
5. Check the validation counter in editor footer
   - **Expected:** Shows "1 validation warning" (for Option A)
6. Restore Option A
   - **Expected:** Counter disappears

**Pass Criteria:**
- ✅ Red borders appear on empty fields
- ✅ Warning text displays below fields
- ✅ Warnings disappear when fields filled
- ✅ Counter shows correct number of warnings

---

### Scenario 6: Validation Popup on Save

**Objective:** Verify validation popup when saving with errors

**Steps:**
1. Open Edit modal and select Question 1
2. Clear question text and Option B
3. Click "Save Changes" button
   - **Expected:** Validation popup appears
4. Verify popup shows:
   - Warning icon and title
   - List of errors (Question 1: Question text is empty, Option B is empty)
   - "Continue Editing" button
   - "Save Anyway" button
5. Click "Continue Editing"
   - **Expected:** Popup closes, editor remains open
6. Click "Save Changes" again
7. Click "Save Anyway"
   - **Expected:** Saves to Firebase, clears localStorage, closes modal

**Pass Criteria:**
- ✅ Popup appears with validation errors
- ✅ All errors listed correctly
- ✅ "Continue Editing" returns to editor
- ✅ "Save Anyway" saves despite errors

---

### Scenario 7: Validation Popup on Close

**Objective:** Verify validation popup when closing with unsaved changes

**Steps:**
1. Open Edit modal and select Question 1
2. Edit question text
3. Clear Option C (create validation error)
4. Click "Cancel" or X button
   - **Expected:** Validation popup appears
5. Verify popup shows:
   - List of errors
   - "Continue Editing" button
   - "Discard Changes" button (NOT "Save Anyway")
6. Click "Continue Editing"
   - **Expected:** Returns to editor
7. Click "Cancel" again
8. Click "Discard Changes"
   - **Expected:** Clears localStorage, closes modal

**Pass Criteria:**
- ✅ Popup appears on close attempt
- ✅ Shows "Discard Changes" option
- ✅ "Continue Editing" returns to editor
- ✅ "Discard Changes" clears localStorage and closes

---

### Scenario 8: Previous/Next Navigation

**Objective:** Verify question navigation buttons

**Steps:**
1. Open Edit modal and select Question 1
2. Verify "Previous" button is disabled
3. Click "Next" button
   - **Expected:** Editor shows Question 2, Previous enabled
4. Click "Next" repeatedly until last question
5. Verify "Next" button is disabled on last question
6. Click "Previous" button
   - **Expected:** Editor shows previous question
7. Make an edit on current question
8. Click "Next"
   - **Expected:** Edit auto-saved, next question loads

**Pass Criteria:**
- ✅ Previous disabled on first question
- ✅ Next disabled on last question
- ✅ Navigation updates editor content
- ✅ Edits preserved when navigating

---

### Scenario 9: Reset to Original

**Objective:** Verify reset functionality

**Steps:**
1. Open Edit modal and select Question 1
2. Edit question text, options, and timer
3. Verify modified indicator (orange dot) appears on Question 1 in left panel
4. Click "Reset to Original" button
   - **Expected:** Confirmation dialog appears
5. Click "Cancel" on confirmation
   - **Expected:** No changes, editor remains
6. Click "Reset to Original" again
7. Click "OK" on confirmation
   - **Expected:** All fields revert to original values
8. Verify orange dot disappears from Question 1

**Pass Criteria:**
- ✅ Confirmation dialog appears
- ✅ Cancel preserves edits
- ✅ OK reverts to original
- ✅ Modified indicator updates

---

### Scenario 10: Modified Question Indicators

**Objective:** Verify visual indicators for modified questions

**Steps:**
1. Open Edit modal
2. Select Question 1 and make an edit
3. Check left panel
   - **Expected:** Orange dot appears on Question 1
4. Select Question 3 and make an edit
   - **Expected:** Orange dot appears on Question 3
5. Select Question 1 and reset to original
   - **Expected:** Orange dot disappears from Question 1
6. Question 3 should still have orange dot

**Pass Criteria:**
- ✅ Orange dot appears on modified questions
- ✅ Multiple questions can be marked modified
- ✅ Dot disappears after reset
- ✅ Dots persist across question switches

---

### Scenario 11: Successful Save

**Objective:** Verify successful save to Firebase

**Steps:**
1. Open Edit modal
2. Select Question 1
3. Edit question text to "What is the capital of France? [EDITED]"
4. Edit Option A to "London [EDITED]"
5. Change timer to 25 seconds
6. Click "Save Changes"
   - **Expected:** No validation errors
7. Verify success message appears
8. Modal closes
9. Check Firebase database (or refresh page)
   - **Expected:** Changes persisted
10. Check localStorage
    - **Expected:** Key `quiz_edit_<quizId>` removed

**Pass Criteria:**
- ✅ Save completes without errors
- ✅ Success message displays
- ✅ Modal closes automatically
- ✅ Changes visible in Firebase
- ✅ localStorage cleared

---

### Scenario 12: Multiple Question Edits

**Objective:** Verify editing multiple questions in one session

**Steps:**
1. Open Edit modal
2. Edit Question 1 (change question text)
3. Navigate to Question 3 (using Next or clicking)
4. Edit Question 3 (change Option B)
5. Navigate to Question 5
6. Edit Question 5 (change timer)
7. Verify left panel shows 3 orange dots
8. Click "Save Changes"
9. Verify all 3 questions saved correctly

**Pass Criteria:**
- ✅ Can edit multiple questions
- ✅ All edits tracked in localStorage
- ✅ All modified questions marked
- ✅ All changes saved to Firebase

---

### Scenario 13: Student View Compatibility

**Objective:** Verify edited questions work in student view

**Steps:**
1. Edit a quiz question (e.g., change Question 1 text)
2. Save changes
3. Start a quiz session from Teacher Lobby
4. Join as a student (use different browser/incognito)
5. Verify Question 1 shows edited text
6. Answer the question
7. Verify answer submission works
8. Check teacher feedback page
   - **Expected:** Student answer recorded correctly

**Pass Criteria:**
- ✅ Edited questions display in student view
- ✅ Answer submission works
- ✅ Scoring works correctly
- ✅ Feedback shows correct data

---

### Scenario 14: Different Question Types

**Objective:** Verify editor handles different question types

**Steps:**
1. Upload `comprehensive-mock-quiz.json`
2. Open Edit modal
3. Test multiple-choice question (Question 1)
   - Verify all fields editable
4. Test multiple-select question (Question 3)
   - Verify answer field handles array
5. Test completion question (Question 21)
   - Verify wordBank field visible
6. Test matching question (Question 26)
   - Verify items and options visible
7. Test diagram-labeling question (Question 31)
   - Verify labels array visible

**Pass Criteria:**
- ✅ Multiple-choice questions fully editable
- ✅ Other question types display correctly
- ✅ No errors in console
- ✅ Can save all question types

**Note:** Current implementation focuses on multiple-choice. Other types may need additional UI components.

---

### Scenario 15: Edge Cases

**Objective:** Test edge cases and error handling

**Steps:**
1. **Empty Quiz:** Try to edit a quiz with 0 questions
   - **Expected:** Modal shows empty state or error
2. **Single Question:** Edit quiz with only 1 question
   - **Expected:** Both Previous and Next disabled
3. **Very Long Text:** Enter 1000+ characters in question text
   - **Expected:** Field handles gracefully
4. **Special Characters:** Enter emojis, unicode, HTML tags
   - **Expected:** Characters preserved correctly
5. **Network Error:** Disconnect internet, try to save
   - **Expected:** Error message displayed
6. **Concurrent Edits:** Open same quiz in two tabs, edit different questions, save both
   - **Expected:** Last save wins (known limitation)

**Pass Criteria:**
- ✅ Handles edge cases gracefully
- ✅ No crashes or console errors
- ✅ User-friendly error messages

---

## Performance Testing

### Load Testing
1. Upload quiz with 50+ questions
2. Open Edit modal
   - **Expected:** Opens in <1 second
3. Scroll through question list
   - **Expected:** Smooth scrolling
4. Switch between questions rapidly
   - **Expected:** No lag or freezing

### Memory Testing
1. Open Edit modal
2. Edit 20+ questions
3. Check browser memory usage
   - **Expected:** No memory leaks
4. Close modal
   - **Expected:** Memory released

---

## Browser Compatibility Testing

Test on the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

For each browser, verify:
- Modal opens and displays correctly
- Resizing works
- Auto-save to localStorage works
- All buttons and interactions work

---

## Mobile/Tablet Testing

**Note:** Current implementation optimized for desktop. Mobile testing is important for future iterations.

Test on:
- [ ] iPad (Safari)
- [ ] Android Tablet (Chrome)
- [ ] iPhone (Safari)
- [ ] Android Phone (Chrome)

Verify:
- Modal is usable (may need responsive adjustments)
- Touch interactions work
- Virtual keyboard doesn't break layout

---

## Regression Testing

Verify existing functionality still works:
- [ ] Upload Quiz modal
- [ ] Delete quiz
- [ ] Start quiz session
- [ ] Teacher quiz page
- [ ] Student quiz page
- [ ] Results and feedback pages

---

## Automated Testing (Future)

Recommended Playwright tests:
```javascript
// Example test structure
test('should open edit modal and edit question', async ({ page }) => {
  await page.goto('/lobby');
  await page.click('button:has-text("Edit")');
  await expect(page.locator('.modal-title')).toContainText('Edit Quiz');
  await page.click('text=Question 1');
  await page.fill('textarea[placeholder*="question"]', 'New question text');
  await page.click('button:has-text("Save Changes")');
  await expect(page.locator('text=saved successfully')).toBeVisible();
});
```

---

## Bug Reporting Template

If you find a bug, report using this format:

**Title:** Brief description

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happened

**Screenshots:**
Attach screenshots if applicable

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Quiz ID: abc123
- Console Errors: [paste errors]

---

## Test Sign-Off

| Test Scenario | Status | Tester | Date | Notes |
|--------------|--------|--------|------|-------|
| Scenario 1 | ⚠️ Pending | | | |
| Scenario 2 | ⚠️ Pending | | | |
| Scenario 3 | ⚠️ Pending | | | |
| Scenario 4 | ⚠️ Pending | | | |
| Scenario 5 | ⚠️ Pending | | | |
| Scenario 6 | ⚠️ Pending | | | |
| Scenario 7 | ⚠️ Pending | | | |
| Scenario 8 | ⚠️ Pending | | | |
| Scenario 9 | ⚠️ Pending | | | |
| Scenario 10 | ⚠️ Pending | | | |
| Scenario 11 | ⚠️ Pending | | | |
| Scenario 12 | ⚠️ Pending | | | |
| Scenario 13 | ⚠️ Pending | | | |
| Scenario 14 | ⚠️ Pending | | | |
| Scenario 15 | ⚠️ Pending | | | |
| Performance | ⚠️ Pending | | | |
| Browser Compat | ⚠️ Pending | | | |
| Mobile/Tablet | ⚠️ Pending | | | |
| Regression | ⚠️ Pending | | | |

**Overall Status:** 🟡 Ready for Testing

---

**Document Version:** 1.0  
**Last Updated:** October 22, 2025
