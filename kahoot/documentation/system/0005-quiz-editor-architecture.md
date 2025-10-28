# Quiz Editor Architecture

**Last Updated:** October 22, 2025  
**Version:** 2.0 (Two-Modal System)

---

## 1. Overview

The Quiz Editor is a sophisticated two-modal system that allows teachers to edit quiz questions with a modern, intuitive interface. The system uses glassmorphism design principles and provides real-time auto-save functionality.

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     TeacherLobbyPage                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Quiz Card (per quiz)                     │  │
│  │  [Edit] [Delete] [Start Quiz]                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│                          │ onClick Edit                     │
│                          ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  QuizEditor (Modal)                   │  │
│  │  ┌────────────────┐         ┌──────────────────────┐ │  │
│  │  │ EditQuizModal  │ 1.5rem  │ QuestionEditorPanel  │ │  │
│  │  │   (350/450px)  │   gap   │      (650px)         │ │  │
│  │  │                │         │                      │ │  │
│  │  │ - Quiz Title   │         │ - Question Text      │ │  │
│  │  │ - Question List│         │ - Options            │ │  │
│  │  │ - Save/Cancel  │         │ - Correct Answer     │ │  │
│  │  │                │         │ - Timer/Points       │ │  │
│  │  └────────────────┘         └──────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 3. Component Hierarchy

### 3.1. QuizEditor (Container)

**Location:** `src/components/QuizEditor.jsx`

**Purpose:** Main container that manages the two-modal system, handles state, validation, and Firebase integration.

**Key Responsibilities:**
- Manage question selection and editing state
- Handle auto-save to localStorage
- Validate questions before saving
- Sync changes to Firebase Realtime Database
- Control modal visibility and positioning

**State Management:**
```javascript
const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
const [showEditor, setShowEditor] = useState(false);
const [editedQuestions, setEditedQuestions] = useState({});
const [modifiedQuestions, setModifiedQuestions] = useState(new Set());
const [showValidationPopup, setShowValidationPopup] = useState(false);
const [validationErrors, setValidationErrors] = useState([]);
const [pendingAction, setPendingAction] = useState(null);
```

**Layout Structure:**
```jsx
<Modal opened={show} size="auto" withCloseButton={false}>
  <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      <EditQuizModal showEditor={showEditor} />
      {showEditor && <Card><QuestionEditorPanel /></Card>}
    </div>
  </div>
</Modal>
```

### 3.2. EditQuizModal (Left Panel)

**Location:** `src/components/EditQuizModal.jsx`

**Purpose:** Displays quiz information and question list, allows question selection.

**Features:**
- **Dynamic Width:** 450px (alone) → 350px (with editor)
- **Smooth Transition:** 0.3s ease animation
- **Glassmorphism:** Purple-themed gradient background
- **Question List:** Scrollable list with selection state
- **Actions:** Save Changes, Cancel buttons

**Props:**
```javascript
{
  quiz: Object,                    // Quiz data
  onQuestionSelect: Function,      // Callback when question clicked
  selectedQuestionIndex: Number,   // Currently selected question
  onSaveChanges: Function,         // Save all changes
  onCancel: Function,              // Close without saving
  showEditor: Boolean              // Whether editor is visible
}
```

**Visual Design:**
```javascript
// Card styling
background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 245, 255, 0.95) 100%)'
border: '1px solid rgba(139, 92, 246, 0.2)'
boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)'

// Header gradient
background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)'

// Selected question
background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)'
border: '2px solid rgba(139, 92, 246, 0.5)'
```

### 3.3. QuestionEditorPanel (Right Panel)

**Location:** `src/components/QuestionEditorPanel.jsx`

**Purpose:** Provides full editing interface for individual questions.

**Features:**
- **Fixed Width:** 650px (larger than Edit Quiz)
- **Glassmorphism:** Blue-themed gradient background
- **Real-time Validation:** Shows warnings for empty fields
- **Navigation:** Previous/Next buttons
- **Reset:** Restore original question
- **Auto-save:** Changes saved to localStorage

**Props:**
```javascript
{
  question: Object,           // Question data
  questionIndex: Number,      // Current question index
  totalQuestions: Number,     // Total number of questions
  onUpdate: Function,         // Update question callback
  onClose: Function,          // Close editor
  onReset: Function,          // Reset to original
  onPrevious: Function,       // Navigate to previous
  onNext: Function,           // Navigate to next
  isFirst: Boolean,           // Is first question
  isLast: Boolean             // Is last question
}
```

**Editable Fields:**
- Question text (Textarea)
- Answer options (TextInput array)
- Correct answer (Radio group)
- Timer (NumberInput, 5-300 seconds)
- Points (NumberInput)
- Question type (disabled, read-only)
- Passage (Textarea, if applicable)

**Visual Design:**
```javascript
// Card styling
background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.95) 100%)'
border: '1px solid rgba(59, 130, 246, 0.2)'
boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)'

// Header gradient
background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)'
```

## 4. Data Flow

### 4.1. Loading Quiz Data

```
TeacherLobbyPage
  │
  ├─ Fetch quizzes from Firebase (/quizzes)
  │
  └─ User clicks "Edit" on quiz
      │
      └─ QuizEditor receives quiz prop
          │
          ├─ Check localStorage for saved edits
          │   └─ Load if exists, otherwise normalize quiz data
          │
          └─ Initialize editedQuestions state
```

### 4.2. Editing Flow

```
User clicks question in EditQuizModal
  │
  ├─ setSelectedQuestionIndex(index)
  │
  └─ setShowEditor(true)
      │
      └─ QuestionEditorPanel renders
          │
          ├─ User edits field
          │   │
          │   ├─ handleFieldChange(field, value)
          │   │   │
          │   │   ├─ Update localQuestion state
          │   │   ├─ Validate field
          │   │   └─ onUpdate(questionIndex, updatedQuestion)
          │   │       │
          │   │       └─ QuizEditor updates editedQuestions
          │   │           │
          │   │           └─ Auto-save to localStorage
          │   │
          │   └─ Validation warnings shown in real-time
          │
          └─ User clicks Previous/Next
              │
              └─ Navigate to different question
```

### 4.3. Saving Flow

```
User clicks "Save Changes"
  │
  ├─ validateQuestions()
  │   │
  │   ├─ Check all questions for:
  │   │   ├─ Empty question text
  │   │   ├─ Empty options
  │   │   └─ Missing correct answer
  │   │
  │   └─ If errors found
  │       │
  │       └─ Show validation popup
  │           │
  │           ├─ User can "Continue Editing"
  │           └─ User can "Save Anyway"
  │
  └─ If validation passes (or user forces save)
      │
      └─ performSave()
          │
          ├─ Build Firebase update object
          │   └─ /quizzes/{quizId}/questions/{index}
          │
          ├─ Update Firebase Realtime Database
          │
          ├─ Clear localStorage
          │
          ├─ Clear modifiedQuestions
          │
          └─ Show success message & close modal
```

## 5. State Management

### 5.1. Local State (Component)

**editedQuestions:** Object mapping question indices to question data
```javascript
{
  0: { question: "What is 2+2?", options: [...], answer: "4", ... },
  1: { question: "Capital of France?", options: [...], answer: "Paris", ... }
}
```

**modifiedQuestions:** Set of modified question indices
```javascript
Set([0, 3, 5]) // Questions 0, 3, and 5 have been modified
```

### 5.2. Persistent State (localStorage)

**Storage Key:** `quiz_edit_{quizId}`

**Data Structure:**
```javascript
{
  timestamp: "2025-10-22T23:45:00.000Z",
  questions: { /* editedQuestions object */ },
  modified: [0, 3, 5] // Array of modified indices
}
```

**Lifecycle:**
- **Save:** On every question update
- **Load:** When QuizEditor opens
- **Clear:** On successful save or discard

### 5.3. Remote State (Firebase)

**Path:** `/quizzes/{quizId}/questions/{index}`

**Update Strategy:** Batch update all modified questions on save

```javascript
const updates = {};
Object.entries(editedQuestions).forEach(([index, question]) => {
  updates[`/quizzes/${quizId}/questions/${index}`] = question;
});
update(ref(database), updates);
```

## 6. Validation System

### 6.1. Real-time Validation

**Trigger:** On every field change in QuestionEditorPanel

**Checks:**
- Question text not empty
- All options have text
- Correct answer is set
- Timer and points are valid numbers

**Display:** Warning icons and messages below fields

### 6.2. Pre-save Validation

**Trigger:** When user clicks "Save Changes"

**Checks:** Same as real-time, but for all questions

**Actions:**
- If errors: Show validation popup with list of issues
- If no errors: Proceed with save

**Popup Options:**
- **Continue Editing:** Return to editor
- **Save Anyway:** Force save despite errors (if triggered by save)
- **Discard Changes:** Close without saving (if triggered by close)

## 7. Design System

### 7.1. Color Palette

**Edit Quiz Modal (Purple Theme):**
- Primary: `rgba(139, 92, 246, *)` (Purple)
- Secondary: `rgba(59, 130, 246, *)` (Blue)
- Background: White to Lavender gradient

**Question Editor (Blue Theme):**
- Primary: `rgba(59, 130, 246, *)` (Blue)
- Secondary: `rgba(14, 165, 233, *)` (Cyan)
- Background: White to Sky gradient

**Text Colors:**
- Dark: `#1e293b`
- Medium: `#475569`
- Light: `#64748b`

### 7.2. Glassmorphism Effects

**Backdrop Blur:** `blur(20px)`  
**Background Opacity:** 95% (for readability)  
**Border:** 1px semi-transparent  
**Shadow:** Soft colored glow  
**Border Radius:** 0.5rem (8px)

### 7.3. Animations

**Width Transition:** `width 0.3s ease`  
**Opacity Transition:** `opacity 0.3s ease`  
**Hover Transform:** `translateY(-2px)`  
**Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`

## 8. Responsive Behavior

### 8.1. Desktop (>1024px)

- Both modals visible side-by-side
- Edit Quiz: 350px (with editor) or 450px (alone)
- Question Editor: 650px
- Gap: 1.5rem
- Both centered together as a pair

### 8.2. Tablet/Mobile (≤1024px)

**Future Implementation:**
- One modal at a time
- Edit Quiz opens full-width (max 450px)
- Question Editor opens full-screen
- Back button to return to Edit Quiz
- No side-by-side layout

## 9. Performance Considerations

### 9.1. Optimizations

- **Conditional Rendering:** Question Editor only renders when needed
- **Auto-save Debouncing:** Prevents excessive localStorage writes
- **Memoization:** Question list items could be memoized
- **Lazy Loading:** Question Editor could be code-split

### 9.2. Memory Management

- **localStorage Cleanup:** Cleared on successful save
- **State Reset:** Component unmounts clear all state
- **Ref Usage:** Prevents unnecessary re-renders for tracking

## 10. Error Handling

### 10.1. Firebase Errors

```javascript
.catch((error) => {
  console.error('Error saving quiz:', error);
  alert('Error saving quiz. Please try again.');
});
```

### 10.2. localStorage Errors

```javascript
try {
  const parsed = JSON.parse(savedData);
  // Use parsed data
} catch (error) {
  console.error('Error loading from localStorage:', error);
  // Fall back to original quiz data
}
```

### 10.3. Validation Errors

- Collected in array
- Displayed in modal with specific messages
- User can choose to continue editing or force save

## 11. Accessibility

### 11.1. Current Implementation

- Semantic HTML structure
- Keyboard navigation (Tab, Enter)
- Close on Escape key (Mantine Modal default)
- Focus management

### 11.2. Future Enhancements

- ARIA labels for screen readers
- Keyboard shortcuts (Ctrl+S for save, Arrow keys for navigation)
- Focus indicators
- Color contrast improvements
- Skip links

## 12. Testing Strategy

### 12.1. Unit Tests

- Question validation logic
- Answer normalization
- State management functions

### 12.2. Integration Tests

- Modal opening/closing
- Question selection
- Save/cancel flows
- localStorage persistence

### 12.3. E2E Tests

- Full editing workflow
- Multi-question navigation
- Validation scenarios
- Error handling

## 13. Related Components

- **TeacherLobbyPage:** Parent component that triggers editor
- **UploadQuizModal:** Alternative way to add quizzes
- **EditTimersModal:** Bulk timer editing (separate feature)
- **Modern Card/Button:** Shared UI components

## 14. Future Enhancements

### 14.1. Planned Features

- Drag-and-drop question reordering
- Bulk question operations
- Question templates
- Image upload support
- Undo/redo functionality
- Collaborative editing
- Question preview mode

### 14.2. Technical Improvements

- TypeScript migration
- React Query for data fetching
- Zustand for state management
- Optimistic updates
- Offline support

---

**Architecture Version:** 2.0  
**Last Major Update:** October 22, 2025  
**Status:** Production Ready
