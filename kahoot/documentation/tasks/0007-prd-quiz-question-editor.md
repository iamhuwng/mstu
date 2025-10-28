# PRD: Quiz Question Editor Feature

## 1. Introduction/Overview

Currently, the Teacher Lobby page provides an "Edit Timers" button that allows teachers to modify question timers for existing quizzes. However, teachers cannot edit other question details (question text, answer options, correct answers, etc.) without re-uploading the entire quiz. This limitation creates inefficiency and increases the risk of errors when teachers need to make minor corrections or updates to quiz content.

This feature will transform the existing "Edit Timers" functionality into a comprehensive "Edit Quiz" feature that allows teachers to edit all aspects of quiz questions directly within the application. The new interface will use a dual-dialog layout where clicking on a question in the left dialog opens a detailed editor in a right-side dialog.

**Problem Solved:** Teachers need a quick, efficient way to edit quiz question details without re-uploading entire quizzes.

**Goal:** Enable teachers to edit questions faster than re-uploading the entire quiz, reducing errors and improving workflow efficiency.

## 2. Goals

1. **Efficiency:** Reduce the time required to make changes to existing quiz questions by at least 50% compared to re-uploading
2. **Comprehensive Editing:** Allow editing of all question properties (text, answers, correct answer, timer, type, media)
3. **User-Friendly Interface:** Provide an intuitive dual-dialog interface with clear visual feedback
4. **Data Integrity:** Implement validation and warnings to prevent incomplete or invalid question data
5. **Flexibility:** Support auto-save to localStorage with explicit permanent save option

## 3. User Stories

1. **As a teacher**, I want to click an "Edit" button on a quiz card so that I can modify question details without re-uploading the entire quiz.

2. **As a teacher**, I want to see a list of all questions in the quiz so that I can quickly navigate to the question I need to edit.

3. **As a teacher**, I want to click on a specific question so that a detailed editor opens showing all editable fields for that question.

4. **As a teacher**, I want my changes to auto-save to localStorage so that I don't lose my work if I accidentally close the browser.

5. **As a teacher**, I want to see validation warnings for empty or invalid fields so that I can ensure my quiz is complete before saving permanently.

6. **As a teacher**, I want to navigate between questions using Previous/Next buttons so that I can edit multiple questions without closing and reopening dialogs.

7. **As a teacher**, I want to see which question I'm currently editing so that I don't get confused when working with multiple questions.

8. **As a teacher**, I want an undo/reset option so that I can revert changes if I make a mistake.

9. **As a teacher**, I want to resize the question list dialog so that I can adjust my workspace based on my screen size and preferences.

10. **As a teacher**, I want a clear "Save" button so that I can permanently commit my changes to the database when I'm satisfied with my edits.

## 4. Functional Requirements

### 4.1 Button and Modal Title Changes
1. The "Edit Timers" button on quiz cards must be renamed to "Edit"
2. The button icon must change from a timer icon to an edit/pencil icon
3. The modal title must change from "Edit Question Timers" to "Edit Quiz"

### 4.2 Dual-Dialog Layout
4. When "Edit" is clicked, the left dialog must display a list of all questions in the quiz (similar to current timer list)
5. The left dialog must be resizable by the user (drag to adjust width)
6. When a question in the left dialog is clicked, a right-side dialog must appear showing detailed edit fields
7. The left dialog must shift/compress to the left to make space for the right dialog
8. Clicking outside both dialogs must NOT close them (no-op)
9. Only the close button (X) on the top right of the question edit dialog must close that dialog
10. Clicking the same question again must close the right dialog
11. Clicking a different question must update the right dialog content to show that question's details

### 4.3 Editable Fields
12. The question edit dialog must allow editing of:
    - Question text (textarea/input)
    - All answer options (4 inputs for standard multiple choice)
    - Correct answer selection (radio buttons or dropdown)
    - Timer duration (number input)
    - Question type (dropdown, if multiple types exist)
    - Media/images (file upload or URL input, if applicable)

### 4.4 Auto-Save and Permanent Save
13. Changes must auto-save to localStorage as they are made (on blur or after a short debounce)
14. A "Save" button must be present to commit changes permanently to Firebase database
15. The localStorage key must be unique per quiz (e.g., `quiz_edit_${quizId}`)
16. On modal open, the system must check localStorage for unsaved changes and load them if present

### 4.5 Validation and Warnings
17. Empty question text fields must display a small red warning indicator below the field
18. When clicking "Save" or attempting to close the dialog, if any fields are empty or have been edited, a popup must appear listing which fields are incomplete or modified
19. The validation popup must allow the user to:
    - Continue editing (cancel the save/close action)
    - Save anyway (for permanent save)
    - Discard changes (for close action)

### 4.6 Undo/Reset Functionality
20. Each question edit dialog must have an "Undo" or "Reset" button
21. The reset button must revert the current question to its last saved state (from Firebase, not localStorage)
22. A confirmation dialog must appear before resetting to prevent accidental data loss

### 4.7 Navigation Between Questions
23. The question edit dialog must include "Previous" and "Next" buttons
24. These buttons must navigate to the adjacent question without closing the dialog
25. "Previous" must be disabled when on the first question
26. "Next" must be disabled when on the last question

### 4.8 Visual Indicators
27. The currently selected/edited question in the left dialog must have a distinct visual indicator (e.g., highlighted background, border, or icon)
28. Modified but unsaved questions must show a visual indicator (e.g., asterisk, dot, or different color) in the left dialog list
29. The question edit dialog must display the question number prominently (e.g., "Editing Question 3 of 10")

### 4.9 Data Persistence
30. Permanent saves must update the Firebase Realtime Database at `/quizzes/{quizId}/questions/{questionIndex}`
31. After successful permanent save, localStorage for that quiz must be cleared
32. A success notification must appear after successful save

## 5. Non-Goals (Out of Scope)

This feature will **NOT** include:
- Adding new questions to an existing quiz
- Deleting questions from a quiz
- Reordering/rearranging questions
- Bulk editing multiple questions simultaneously
- Duplicating questions
- Quiz-level metadata editing (title, description, category)
- Question bank or template system
- Collaborative editing (multiple teachers editing simultaneously)

## 6. Design Considerations

### 6.1 Layout
- **Left Dialog (Question List):**
  - Resizable with a drag handle on the right edge
  - Minimum width: 300px, Maximum width: 600px
  - Shows question number, truncated question text, and timer
  - Visual indicators for current selection and unsaved changes
  
- **Right Dialog (Question Editor):**
  - Fixed width: 500-600px
  - Slides in from the right when a question is clicked
  - Contains all editable fields in a scrollable container
  - Header shows question number and navigation buttons
  - Footer contains Reset, Cancel, and Save buttons

### 6.2 Visual Style
- Maintain consistency with existing design system (glassmorphism, modern components)
- Use existing color palette (lavender, sky, mint, rose, peach variants)
- Follow existing button styles (primary, glass, danger variants)
- Use Mantine components where applicable for consistency

### 6.3 Icons
- Edit button: Pencil/edit icon (replace timer icon)
- Previous/Next: Chevron or arrow icons
- Reset: Rotate/undo icon
- Save: Floppy disk or checkmark icon
- Warning: Exclamation triangle icon (red)

### 6.4 Responsive Behavior
- On smaller screens (<1024px), consider stacking dialogs or using a single full-width dialog with tabs
- Ensure touch-friendly button sizes for tablet users

## 7. Technical Considerations

### 7.1 Component Structure
- Rename `EditTimersModal.jsx` to `EditQuizModal.jsx` (or create new component)
- Create sub-component `QuestionEditorPanel.jsx` for the right dialog
- Use React hooks for state management (useState, useEffect, useRef)
- Consider using `useReducer` for complex question edit state

### 7.2 State Management
- Main modal state: `showEditModal`, `selectedQuiz`
- Left dialog state: `questions`, `selectedQuestionIndex`, `modifiedQuestions`
- Right dialog state: `currentQuestion`, `editedFields`, `validationErrors`
- LocalStorage state: `unsavedChanges`

### 7.3 LocalStorage Schema
```json
{
  "quiz_edit_<quizId>": {
    "timestamp": "ISO timestamp",
    "questions": {
      "0": { "question": "...", "options": [...], "correctAnswer": "...", "timer": 10 },
      "1": { ... }
    }
  }
}
```

### 7.4 Firebase Integration
- Use existing Firebase `update()` function for batch updates
- Update path: `/quizzes/{quizId}/questions/{index}`
- Maintain existing quiz structure compatibility

### 7.5 Validation Logic
- Implement field-level validation (onBlur)
- Implement form-level validation (onSave, onClose)
- Use a validation schema (consider Yup or Zod if not already in use)

### 7.6 Performance
- Debounce auto-save to localStorage (300-500ms)
- Memoize question list rendering to prevent unnecessary re-renders
- Use React.memo for QuestionEditorPanel if performance issues arise

### 7.7 Dependencies
- Existing: React, Mantine UI, Firebase, react-router-dom
- Potentially needed: react-resizable or similar for resizable dialog
- Validation library (if not already present)

## 8. Success Metrics

### Primary Metric
1. **Edit Speed:** Teachers can edit a question in under 30 seconds (compared to 2+ minutes for re-upload)

### Secondary Metrics
2. **Adoption Rate:** 80% of teachers use the Edit feature within first month of release
3. **Error Reduction:** 50% reduction in quiz content errors (measured by teacher corrections)
4. **User Satisfaction:** Positive feedback from teacher surveys (>4/5 rating)
5. **Usage Frequency:** Average of 3+ quiz edits per teacher per week

### Technical Metrics
6. **Save Success Rate:** 99%+ successful permanent saves
7. **LocalStorage Recovery:** 100% recovery of unsaved changes on browser refresh
8. **Performance:** Dialog opens in <500ms, question switching in <200ms

## 9. Open Questions

1. **Question Types:** Does the current system support multiple question types (multiple choice, true/false, short answer)? If so, what are they?
   
2. **Media Support:** Are images/media currently supported in questions? If yes, what's the storage mechanism (Firebase Storage, URLs)?

3. **Character Limits:** Are there existing character limits for questions and answers in the database schema?

4. **Concurrent Editing:** What should happen if two teachers try to edit the same quiz simultaneously? (Out of scope for this feature, but worth noting)

5. **Undo History:** Should undo support multiple levels (undo stack) or just a single reset to original?

6. **Mobile Support:** What's the priority for mobile/tablet support? Should we implement a different UX for small screens?

7. **Accessibility:** Are there specific WCAG compliance requirements for this feature?

8. **Localization:** Does the app support multiple languages? If so, should all UI text be externalized?

9. **Audit Trail:** Should we log who edited what and when for accountability purposes?

10. **Keyboard Shortcuts:** Should we implement keyboard shortcuts (e.g., Ctrl+S to save, Esc to close)?

---

## Appendix: UI Flow Diagram

```
Teacher Lobby Page
    ↓
[Edit] button clicked on quiz card
    ↓
Left Dialog Opens (Resizable)
├─ Question 1 (timer: 10s) ← Currently selected
├─ Question 2 (timer: 15s) *
├─ Question 3 (timer: 20s)
└─ [Save Changes] [Cancel]
    ↓
Click on Question 1
    ↓
Right Dialog Slides In
┌─────────────────────────────────┐
│ Editing Question 1 of 3         │
│ [← Previous] [Next →]           │
├─────────────────────────────────┤
│ Question Text:                  │
│ [________________________]      │
│                                 │
│ Answer Options:                 │
│ A: [__________________]         │
│ B: [__________________]         │
│ C: [__________________]         │
│ D: [__________________]         │
│                                 │
│ Correct Answer: (•) A ( ) B    │
│                 ( ) C ( ) D    │
│                                 │
│ Timer: [10] seconds             │
├─────────────────────────────────┤
│ [Reset] [Cancel] [Save]         │
└─────────────────────────────────┘
```

---

**Document Version:** 1.0  
**Created:** 2025-10-22  
**Author:** AI Assistant (based on user requirements)  
**Status:** Draft - Pending Review
