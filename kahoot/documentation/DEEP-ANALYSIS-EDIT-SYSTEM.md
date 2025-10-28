# Deep Analysis: Edit Button System

**Date:** October 22, 2025

## Executive Summary

The Edit system consists of 3 components working together:
1. **TeacherLobbyPage** - Entry point with Edit button
2. **EditQuizModal** - Orchestrator with dual-modal UI
3. **QuestionEditorPanel** - Individual question editor

---

## 1. Component Flow

### TeacherLobbyPage → EditQuizModal

```javascript
// Button click triggers modal
<Button onClick={() => handleEditQuiz(quiz)}>Edit</Button>

const handleEditQuiz = (quiz) => {
  setSelectedQuiz(quiz);      // Store quiz data
  setShowEditModal(true);     // Show modal
};

// Modal rendering
{selectedQuiz && (
  <EditQuizModal 
    show={showEditModal} 
    handleClose={() => setShowEditModal(false)} 
    quiz={selectedQuiz} 
  />
)}
```

---

## 2. EditQuizModal Architecture

### State Management

| State | Type | Purpose |
|-------|------|---------|
| `selectedQuestionIndex` | number\|null | Currently selected question |
| `editedQuestions` | Object | Map of edited questions by index |
| `modifiedQuestions` | Set | Tracks modified questions |
| `showValidationPopup` | boolean | Controls validation modal |
| `validationErrors` | Array | List of validation errors |
| `pendingAction` | string\|null | Action waiting after validation |

### LocalStorage Strategy

**Key:** `quiz_edit_{quizId}`

**Data Structure:**
```json
{
  "timestamp": "2025-10-22T10:00:00.000Z",
  "questions": { "0": {...}, "1": {...} },
  "modified": [0, 2, 5]
}
```

**Auto-save:** Triggers on every `editedQuestions` or `modifiedQuestions` change

### Three-Modal System

1. **Left Modal (z-index: 200)**
   - Question list
   - Position: Center → Left (2rem) when editor opens
   - Size: 500px × 70vh
   - Transition: 0.3s ease

2. **Right Modal (z-index: 300)**
   - Question editor
   - Position: Fixed right (2rem from edge)
   - Size: 900px × 85vh
   - Overlay: Transparent (left modal stays visible)

3. **Validation Modal (default z-index)**
   - Error display
   - Actions: Continue/Save Anyway/Discard

---

## 3. Data Flow

```
User clicks Edit
  ↓
TeacherLobbyPage.handleEditQuiz(quiz)
  ↓
EditQuizModal receives quiz prop
  ↓
useEffect: Load from localStorage OR initialize from quiz
  ↓
User clicks question
  ↓
setSelectedQuestionIndex(index)
  ↓
Right modal renders with QuestionEditorPanel
  ↓
User edits field
  ↓
QuestionEditorPanel.handleFieldChange()
  ↓
onUpdate callback → EditQuizModal.handleQuestionUpdate()
  ↓
Update editedQuestions & modifiedQuestions
  ↓
useEffect: Auto-save to localStorage
  ↓
User clicks Save
  ↓
validateQuestions()
  ↓
If valid: performSave() → Firebase update()
If invalid: Show validation modal
  ↓
On success: Clear localStorage, close modal
```

---

## 4. Key Interactions

### Question Selection
```javascript
handleQuestionClick(index) → setSelectedQuestionIndex(index)
```
- Highlights question in left modal (purple border)
- Opens right modal with editor
- Left modal slides to left edge

### Question Update
```javascript
QuestionEditorPanel onChange → handleFieldChange()
  → setLocalQuestion() + validateFields() + onUpdate()
    → EditQuizModal.handleQuestionUpdate()
      → Update editedQuestions + Mark as modified
        → Auto-save to localStorage
```

### Save Flow
```javascript
handleSave()
  → validateQuestions()
    → If errors: Show validation modal
    → If valid: performSave()
      → Firebase batch update
      → Clear localStorage
      → Close modal
```

### Close with Unsaved Changes
```javascript
handleCloseAttempt()
  → Check modifiedQuestions.size > 0
    → Show validation modal with options:
      - Continue Editing
      - Discard Changes (clear localStorage)
```

---

## 5. Validation System

### Two-Level Validation

**1. Real-time (QuestionEditorPanel)**
- Runs on every field change
- Shows field-level warnings
- Visual: Red borders + warning text
- Non-blocking

**2. Pre-save (EditQuizModal)**
- Runs before save/close
- Validates all questions
- Shows modal with all errors
- Blocking (requires user action)

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Question text | Not empty | "Question X: Question text is empty" |
| Options (string) | Not empty | "Question X: Option Y is empty" |
| Options (object) | Has `text` property | "Question X: Option Y is missing text" |
| Answer (string) | Not empty | "Question X: Correct answer is not set" |
| Answer (array) | Length > 0 | "Question X: Correct answer is not set" |
| Answer (any) | Exists | "Question X: Correct answer is not set" |

---

## 6. Critical Issues & Fixes

### Issue 1: Type Safety in Validation ✅ FIXED
**Problem:** Calling `.trim()` on non-string values
**Solution:** Type checking before `.trim()`
```javascript
if (typeof opt === 'string' && (!opt || opt.trim() === ''))
```

### Issue 2: Z-Index Conflicts ✅ FIXED
**Problem:** Modals competing for same layer
**Solution:** Explicit z-index configuration
- Left modal: 200
- Right modal: 300 (transparent overlay)
- Validation modal: default

### Issue 3: Data Structure Assumptions
**Problem:** Code assumes `options` are always strings
**Current:** Handles strings and objects
**Limitation:** May not handle all question types (matching, completion)

---

## 7. Potential Improvements

### Performance
1. **Debounce auto-save** - Currently saves on every keystroke
2. **Memoize validation** - Avoid re-validating unchanged questions
3. **Lazy load editor** - Only render when needed

### UX
1. **Keyboard shortcuts** - Arrow keys for navigation, Esc to close
2. **Undo/Redo** - Track edit history
3. **Bulk edit** - Select multiple questions
4. **Preview mode** - See how question appears to students

### Data Integrity
1. **Optimistic locking** - Detect concurrent edits
2. **Change tracking** - Show diff of changes
3. **Backup before save** - Keep previous version

### Accessibility
1. **ARIA labels** - Screen reader support
2. **Focus management** - Proper tab order
3. **Keyboard navigation** - Full keyboard support

---

## 8. Testing Checklist

- [ ] Edit button opens modal
- [ ] LocalStorage restore works
- [ ] Question selection highlights correctly
- [ ] Left modal slides to left
- [ ] Right modal appears on right
- [ ] Field changes update immediately
- [ ] Auto-save triggers
- [ ] Modified indicator shows
- [ ] Navigation buttons work
- [ ] Reset button restores original
- [ ] Validation catches errors
- [ ] Save succeeds with valid data
- [ ] Save blocked with invalid data
- [ ] Close with changes shows warning
- [ ] Discard clears localStorage
- [ ] Multiple question types supported

---

## 9. File Locations

- `src/pages/TeacherLobbyPage.jsx` - Edit button (lines 131-139)
- `src/components/EditQuizModal.jsx` - Main orchestrator (464 lines)
- `src/components/QuestionEditorPanel.jsx` - Editor UI (402 lines)

---

## 10. Dependencies

**React:** useState, useEffect  
**Mantine:** Modal, Text, Stack, Textarea, TextInput, NumberInput, Radio  
**Firebase:** database, ref, update  
**Browser:** localStorage

---

## Summary

The Edit system is a sophisticated three-modal interface with:
- ✅ Auto-save to localStorage
- ✅ Real-time validation
- ✅ Batch Firebase updates
- ✅ Type-safe validation
- ✅ Proper z-index layering
- ✅ Smooth animations
- ⚠️ Limited question type support
- ⚠️ No concurrent edit detection
- ⚠️ No undo/redo functionality
