# UI/UX Analysis: Edit Quiz Interface

**Date:** October 22, 2025  
**Component:** EditQuizModal + QuestionEditorPanel

---

## Overview

The Edit Quiz interface consists of a **dual-modal system** that appears after clicking the "Edit" button on a quiz card in the Teacher Lobby.

---

## Visual Layout

### Initial State (No Question Selected)

```
┌─────────────────────────────────────────────────┐
│  📝 Edit Quiz                              [X]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Mock Quiz for Testing                          │
│  2 questions                                    │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  Question 1                          10s  │ │
│  │  What is 2 + 2?                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  Question 2                          15s  │ │
│  │  What is the capital of France?           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ─────────────────────────────────────────────  │
│                        [Cancel] [Save Changes]  │
└─────────────────────────────────────────────────┘
         Center of screen (50%)
         500px wide × 70vh tall
```

### After Clicking a Question (Two-Modal Layout)

```
┌──────────────────┐                    ┌─────────────────────────────┐
│ 📝 Edit Quiz [X] │                    │ Editing Question 1 of 2 [X] │
├──────────────────┤                    ├─────────────────────────────┤
│                  │                    │ [← Previous]    [Next →]    │
│ Mock Quiz        │                    ├─────────────────────────────┤
│ 2 questions      │                    │                             │
│ ──────────────── │                    │ Question Text *             │
│                  │                    │ ┌─────────────────────────┐ │
│ ┌──────────────┐ │                    │ │ What is 2 + 2?          │ │
│ │ ● Question 1 │ │ ← Selected         │ └─────────────────────────┘ │
│ │ What is 2+2? │ │   (Purple border)  │                             │
│ │         10s  │ │                    │ Answer Options *            │
│ └──────────────┘ │                    │ A ┌───────────────────────┐ │
│                  │                    │   │ 3                     │ │
│ ┌──────────────┐ │                    │   └───────────────────────┘ │
│ │  Question 2  │ │                    │ B ┌───────────────────────┐ │
│ │  Capital?    │ │                    │   │ 4                     │ │
│ │         15s  │ │                    │   └───────────────────────┘ │
│ └──────────────┘ │                    │ C ┌───────────────────────┐ │
│                  │                    │   │ 5                     │ │
│ ──────────────── │                    │   └───────────────────────┘ │
│ [Cancel] [Save]  │                    │ D ┌───────────────────────┐ │
└──────────────────┘                    │   │ 6                     │ │
  2rem from left                        │   └───────────────────────┘ │
  500px × 70vh                          │                             │
                                        │ Correct Answer *            │
                                        │ ○ A: 3                      │
                                        │ ● B: 4  ← Selected          │
                                        │ ○ C: 5                      │
                                        │ ○ D: 6                      │
                                        │                             │
                                        │ Timer (seconds) *           │
                                        │ ┌─────────────────────────┐ │
                                        │ │ 10 seconds              │ │
                                        │ └─────────────────────────┘ │
                                        │                             │
                                        │ ──────────────────────────  │
                                        │ [Reset to Original]         │
                                        └─────────────────────────────┘
                                          2rem from right
                                          900px × 85vh
```

---

## Component Breakdown

### 1. Left Modal - Question List

**Purpose:** Browse and select questions to edit

**Dimensions:**
- Width: 500px (max)
- Height: 70vh
- Position: Center → Left (2rem from edge) when editor opens
- Z-index: 200

**Header:**
```
┌─────────────────────────────────────────┐
│ 📝 Edit Quiz                       [X]  │
└─────────────────────────────────────────┘
```
- Icon: Edit pencil icon
- Title: "Edit Quiz" (bold, #1e293b)
- Close button: X (triggers unsaved changes check)

**Quiz Info Section:**
```
┌─────────────────────────────────────────┐
│ Mock Quiz for Testing                   │
│ 2 questions                             │
└─────────────────────────────────────────┘
```
- Quiz title (bold, #1e293b)
- Question count (small, #64748b)

**Question Cards:**
```
┌─────────────────────────────────────────┐
│ ●                                       │  ← Modified indicator (orange dot)
│ Question 1                         10s  │
│ What is 2 + 2?                          │
└─────────────────────────────────────────┘
```

**States:**
- **Default:** White background, gray border (#e2e8f0)
- **Hover:** Light gray background (#f8fafc), darker border (#cbd5e1)
- **Selected:** Purple border (#8b5cf6), light background (#f1f5f9)
- **Modified:** Orange dot indicator (top-right, #f59e0b)

**Footer Buttons:**
```
┌─────────────────────────────────────────┐
│                  [Cancel] [Save Changes]│
└─────────────────────────────────────────┘
```
- Cancel: Glass variant (transparent with border)
- Save Changes: Primary variant (purple background)

---

### 2. Right Modal - Question Editor

**Purpose:** Edit individual question details

**Dimensions:**
- Width: 900px (max)
- Height: 85vh
- Position: Fixed 2rem from right edge
- Z-index: 300 (above left modal)

**Header:**
```
┌─────────────────────────────────────────┐
│ Editing Question 1 of 2            [X]  │
│ Changes are auto-saved to your browser  │
└─────────────────────────────────────────┘
```
- Current question number
- Auto-save notice (small, gray)
- Close button (X)

**Navigation Bar:**
```
┌─────────────────────────────────────────┐
│ [← Previous]              [Next →]      │
└─────────────────────────────────────────┘
```
- Previous: Disabled on first question
- Next: Disabled on last question

**Form Fields:**

1. **Question Text** (Textarea)
   - Label: "Question Text *"
   - 3-6 rows, auto-expanding
   - Red border if empty
   - Warning icon + message if invalid

2. **Answer Options** (TextInput array)
   - Label: "Answer Options *"
   - One input per option (A, B, C, D)
   - Red border if empty
   - Warning icon + message if invalid

3. **Correct Answer** (Radio Group)
   - Label: "Correct Answer *"
   - Radio buttons for each option
   - Shows option letter + text
   - Red warning if not selected

4. **Timer** (NumberInput)
   - Label: "Timer (seconds) *"
   - Min: 5, Max: 300, Step: 5
   - Suffix: " seconds"
   - Default: 10

5. **Question Type** (TextInput - Disabled)
   - Label: "Question Type"
   - Read-only field
   - Shows: "multiple-choice"
   - Gray background (#f8fafc)

6. **Passage** (Textarea - Conditional)
   - Only shown if question has passage
   - Label: "Passage"
   - 4-8 rows

**Footer:**
```
┌─────────────────────────────────────────┐
│ [Reset to Original]    ⚠️ 3 warnings    │
└─────────────────────────────────────────┘
```
- Reset button: Restores original question
- Validation counter: Shows number of warnings

---

### 3. Validation Modal

**Purpose:** Show validation errors before save/close

**Trigger:**
- Clicking "Save Changes" with errors
- Clicking "Cancel" with unsaved changes

**Layout:**
```
┌─────────────────────────────────────────┐
│ ⚠️ Validation Issues              [X]   │
├─────────────────────────────────────────┤
│ The following issues were found:        │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ • Question 1: Question text is empty│ │
│ │ • Question 1: Option A is empty     │ │
│ │ • Question 2: Correct answer not set│ │
│ └─────────────────────────────────────┘ │
│                                         │
│        [Continue Editing] [Save Anyway] │
└─────────────────────────────────────────┘
```

**Error Display:**
- Red background (#fef2f2)
- Red border (#fecaca)
- Red text (#991b1b)
- Scrollable (max 300px height)

**Action Buttons:**
- **Continue Editing:** Returns to editor
- **Save Anyway:** (Only on save) Saves despite errors
- **Discard Changes:** (Only on close) Discards all edits

---

## Interaction Flow

### Opening the Editor

1. User clicks "Edit" button on quiz card
2. `handleEditQuiz(quiz)` is called
3. `selectedQuiz` state is set
4. `showEditModal` state is set to `true`
5. Left modal appears centered on screen
6. Quiz data is loaded from localStorage or initialized
7. Question list is rendered

### Selecting a Question

1. User clicks on a question card
2. `handleQuestionClick(index)` is called
3. `selectedQuestionIndex` state is set
4. Left modal slides to left edge (2rem)
5. Right modal appears on right edge (2rem)
6. Question data is loaded into editor form
7. Validation runs automatically

### Editing a Field

1. User types in a field (e.g., question text)
2. `handleFieldChange(field, value)` is called
3. Local state updates immediately
4. Validation runs on updated data
5. `onUpdate(updated)` propagates to parent
6. Parent updates `editedQuestions` state
7. Question marked as modified (orange dot appears)
8. Auto-save to localStorage triggers

### Navigating Between Questions

1. User clicks "Previous" or "Next" button
2. `setSelectedQuestionIndex()` updates index
3. Right modal content updates
4. Previous question's changes are preserved
5. New question's data loads
6. Validation runs on new question

### Saving Changes

1. User clicks "Save Changes" button
2. `handleSave()` is called
3. All questions are validated
4. If errors exist:
   - Validation modal appears
   - User can continue editing or save anyway
5. If no errors:
   - `performSave()` is called
   - Batch update to Firebase
   - LocalStorage is cleared
   - Success alert shown
   - Modal closes

### Closing Without Saving

1. User clicks "Cancel" or X button
2. `handleCloseAttempt()` is called
3. Check if `modifiedQuestions.size > 0`
4. If modified:
   - Validation modal appears
   - User can continue, save, or discard
5. If not modified:
   - Modal closes immediately

---

## Visual Design

### Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Primary (Selected) | Purple | #8b5cf6 |
| Modified Indicator | Orange | #f59e0b |
| Error/Warning | Red | #ef4444 |
| Text Primary | Dark Gray | #1e293b |
| Text Secondary | Medium Gray | #64748b |
| Border Default | Light Gray | #e2e8f0 |
| Border Hover | Medium Gray | #cbd5e1 |
| Background Light | Very Light Gray | #f8fafc |
| Background White | White | #ffffff |

### Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Modal Title | xl | 700 | #1e293b |
| Section Title | sm | 700 | #1e293b |
| Question Number | sm | 700 | #1e293b |
| Question Text | sm | 400 | #475569 |
| Timer | xs | 600 | #64748b |
| Helper Text | xs | 400 | #64748b |
| Error Text | xs | 400 | #ef4444 |

### Spacing

| Element | Padding/Margin |
|---------|----------------|
| Modal Header | 1.5rem |
| Modal Body | 1rem - 1.5rem |
| Question Card | 1rem |
| Form Fields | 0.75rem - 1rem |
| Button Gap | 0.5rem - 0.75rem |

### Animations

| Element | Animation | Duration |
|---------|-----------|----------|
| Left Modal Slide | left + transform | 0.3s ease |
| Question Card Hover | background + border | 0.2s ease |
| Button Hover | background | 0.2s ease |

---

## Responsive Behavior

### Desktop (>1200px)
- Left modal: 500px
- Right modal: 900px
- Both modals visible side-by-side

### Tablet (768px - 1200px)
- Left modal: 400px
- Right modal: 700px
- May overlap slightly

### Mobile (<768px)
- **Current Implementation:** Not optimized
- **Recommendation:** Stack modals or use full-screen

---

## Accessibility Issues

### Current Problems

1. ❌ **No ARIA labels** on interactive elements
2. ❌ **No focus management** when modals open
3. ❌ **No keyboard navigation** for question list
4. ❌ **Close button lacks accessible name**
5. ❌ **Validation errors not announced** to screen readers
6. ❌ **No skip links** for keyboard users

### Recommendations

1. Add `aria-label` to all buttons
2. Add `role="dialog"` and `aria-modal="true"` to modals
3. Trap focus within active modal
4. Add keyboard shortcuts (Arrow keys, Esc, Enter)
5. Announce validation errors with `aria-live`
6. Add visible focus indicators

---

## UX Issues & Improvements

### Current Issues

1. **No visual feedback** when auto-save occurs
2. **Modified indicator** is small and easy to miss
3. **No undo/redo** functionality
4. **No bulk edit** capabilities
5. **No preview mode** to see student view
6. **Timer input** allows invalid values (can type letters)
7. **No confirmation** on Reset button (uses browser confirm)
8. **Validation runs on every keystroke** (performance concern)
9. **No loading state** during save
10. **Success/error messages** use browser alerts

### Recommended Improvements

#### High Priority

1. **Add visual auto-save indicator**
   ```
   ┌─────────────────────────────────────┐
   │ ✓ Saved 2 seconds ago               │
   └─────────────────────────────────────┘
   ```

2. **Enhance modified indicator**
   - Larger dot or badge
   - Show "Modified" text on hover
   - Count of changes

3. **Replace browser alerts**
   - Use toast notifications
   - Show in-app success/error messages

4. **Add loading states**
   - Spinner on Save button
   - Disable form during save

#### Medium Priority

5. **Add undo/redo**
   - Ctrl+Z / Ctrl+Y support
   - History stack
   - Visual undo button

6. **Debounce validation**
   - Wait 500ms after typing stops
   - Reduce performance impact

7. **Add preview mode**
   - Button to see student view
   - Modal showing how question appears

8. **Improve reset confirmation**
   - Custom modal instead of browser confirm
   - Show diff of changes

#### Low Priority

9. **Add bulk edit**
   - Select multiple questions
   - Apply timer to all
   - Batch operations

10. **Add keyboard shortcuts**
    - Ctrl+S to save
    - Esc to close
    - Arrow keys to navigate

---

## Performance Considerations

### Current Performance

| Operation | Performance | Notes |
|-----------|-------------|-------|
| Open modal | ✅ Fast | <100ms |
| Select question | ✅ Fast | <50ms |
| Type in field | ⚠️ Medium | Validates on every keystroke |
| Auto-save | ⚠️ Medium | Saves on every change |
| Save to Firebase | ⚠️ Slow | Network dependent |

### Optimization Opportunities

1. **Debounce auto-save** - Save after 1s of inactivity
2. **Debounce validation** - Validate after 500ms of inactivity
3. **Memoize validation** - Cache results for unchanged questions
4. **Lazy load editor** - Only render when question selected
5. **Virtual scrolling** - For quizzes with 100+ questions

---

## Technical Implementation

### State Management

```javascript
// EditQuizModal.jsx
const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
const [editedQuestions, setEditedQuestions] = useState({});
const [modifiedQuestions, setModifiedQuestions] = useState(new Set());
const [showValidationPopup, setShowValidationPopup] = useState(false);
const [validationErrors, setValidationErrors] = useState([]);
const [pendingAction, setPendingAction] = useState(null);
```

### Data Flow

```
User Input
  ↓
QuestionEditorPanel (local state)
  ↓
onUpdate callback
  ↓
EditQuizModal (editedQuestions state)
  ↓
Auto-save to localStorage
  ↓
User clicks Save
  ↓
Validate all questions
  ↓
Firebase batch update
  ↓
Clear localStorage
  ↓
Close modal
```

### LocalStorage Schema

```json
{
  "quiz_edit_abc123": {
    "timestamp": "2025-10-22T12:00:00.000Z",
    "questions": {
      "0": { "question": "...", "options": [...], "answer": "..." },
      "1": { "question": "...", "options": [...], "answer": "..." }
    },
    "modified": [0, 1]
  }
}
```

---

## Conclusion

### Strengths ✅

- Clean, modern design
- Dual-modal layout provides good separation
- Auto-save prevents data loss
- Real-time validation
- Smooth animations
- Visual feedback for selection and modification

### Weaknesses ❌

- Poor accessibility
- No undo/redo
- Browser alerts for messages
- Performance issues with validation
- Not mobile-optimized
- No bulk edit capabilities

### Priority Fixes

1. Add toast notifications (replace alerts)
2. Add loading states
3. Debounce validation and auto-save
4. Improve accessibility (ARIA labels, focus management)
5. Add visual auto-save indicator
6. Optimize for mobile

---

## Files

- `src/components/EditQuizModal.jsx` (473 lines)
- `src/components/QuestionEditorPanel.jsx` (402 lines)
- `src/pages/TeacherLobbyPage.jsx` (326 lines)
