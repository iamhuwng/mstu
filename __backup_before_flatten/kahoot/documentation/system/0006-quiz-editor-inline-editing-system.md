# Quiz Editor Inline Editing System

**Last Updated:** October 23, 2025  
**Version:** 1.0  
**Component:** EditQuizModal

---

## 1. Overview

The Quiz Editor now supports inline editing for question timers, allowing teachers to quickly modify timer values without opening the full question editor. This system provides a fast, intuitive way to make bulk timer adjustments.

---

## 2. Architecture

### 2.1. Component Structure

```
EditQuizModal
├── Question Cards (map)
│   ├── Question Info (clickable)
│   ├── Timer Display (double-clickable)
│   │   ├── Clock Icon
│   │   └── Timer Value / Input Field
│   └── Action Buttons
│       ├── Hide/Unhide Button
│       └── Delete Button
```

### 2.2. State Management

```javascript
// Local state in EditQuizModal
const [editingTimerIndex, setEditingTimerIndex] = useState(null);
const [tempTimerValue, setTempTimerValue] = useState('');

// Parent state in QuizEditor
const [editedQuestions, setEditedQuestions] = useState({});
const [modifiedQuestions, setModifiedQuestions] = useState(new Set());
```

### 2.3. Data Flow

```
User Double-Click
    ↓
handleTimerDoubleClick(index)
    ↓
setEditingTimerIndex(index)
setTempTimerValue(currentTimer)
    ↓
Input Field Renders
    ↓
User Types → handleTimerChange(value)
    ↓
User Presses Enter/Clicks Outside → handleTimerBlur(index)
    ↓
Validate & Clamp (5-300)
    ↓
onUpdateQuestionTimer(index, updatedQuestion)
    ↓
QuizEditor.handleQuestionUpdate()
    ↓
Update editedQuestions state
Mark question as modified
    ↓
Auto-save to localStorage
    ↓
UI Updates with new timer value
```

---

## 3. Implementation Details

### 3.1. Event Handlers

#### handleTimerDoubleClick
**Purpose:** Activate edit mode for a specific timer

**Logic:**
1. Get current timer value from `editedQuestions` or `quiz.questions`
2. Set `editingTimerIndex` to current question index
3. Set `tempTimerValue` to current timer as string
4. Input field auto-renders and focuses

**Code:**
```javascript
const handleTimerDoubleClick = (index) => {
  const currentTimer = (editedQuestions && editedQuestions[index] 
    ? editedQuestions[index].timer 
    : quiz.questions[index].timer) || 10;
  setEditingTimerIndex(index);
  setTempTimerValue(currentTimer.toString());
};
```

#### handleTimerChange
**Purpose:** Update temporary value as user types

**Logic:**
1. Receive new value from input onChange event
2. Update `tempTimerValue` state
3. No validation yet (happens on blur)

**Code:**
```javascript
const handleTimerChange = (value) => {
  setTempTimerValue(value);
};
```

#### handleTimerBlur
**Purpose:** Save timer value when input loses focus

**Logic:**
1. Parse `tempTimerValue` to integer (default 10 if invalid)
2. Clamp value between 5 and 300 seconds
3. Get current question data
4. Create updated question object with new timer
5. Call parent's `onUpdateQuestionTimer` callback
6. Reset `editingTimerIndex` to null (hide input)

**Code:**
```javascript
const handleTimerBlur = (index) => {
  const newTimer = parseInt(tempTimerValue) || 10;
  // Clamp between 5 and 300
  const clampedTimer = Math.max(5, Math.min(300, newTimer));
  
  // Update the question timer through parent
  if (onUpdateQuestionTimer) {
    const question = editedQuestions && editedQuestions[index] 
      ? editedQuestions[index] 
      : quiz.questions[index];
    const updated = { ...question, timer: clampedTimer };
    onUpdateQuestionTimer(index, updated);
  }
  
  setEditingTimerIndex(null);
};
```

#### handleTimerKeyDown
**Purpose:** Handle keyboard shortcuts

**Logic:**
- **Enter:** Save and close (call `handleTimerBlur`)
- **Escape:** Cancel and close (reset `editingTimerIndex`)

**Code:**
```javascript
const handleTimerKeyDown = (e, index) => {
  if (e.key === 'Enter') {
    handleTimerBlur(index);
  } else if (e.key === 'Escape') {
    setEditingTimerIndex(null);
  }
};
```

---

### 3.2. UI Components

#### Timer Display Container

**Features:**
- Double-click to activate edit mode
- Tooltip: "Double-click to edit timer"
- Prevents click propagation to question card
- Displays clock icon + value/input

**Styling:**
```javascript
{
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.75rem',
  color: '#64748b',
  fontWeight: 600
}
```

#### Timer Input Field

**Features:**
- Type: `number`
- Auto-focus on render
- Min: 5, Max: 300
- Width: 40px (compact)
- Purple border (matches theme)
- Centered text
- Click stops propagation

**Styling:**
```javascript
{
  width: '40px',
  padding: '0.125rem 0.25rem',
  border: '2px solid #8b5cf6',
  borderRadius: '0.25rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  textAlign: 'center',
  color: '#1e293b',
  background: '#ffffff',
  outline: 'none'
}
```

#### Timer Display Text

**Features:**
- Shows current timer value + "s" suffix
- Cursor: pointer (indicates clickable)
- Reads from `displayQuestion.timer` (edited or original)

**Example:** `10s`, `30s`, `60s`

---

### 3.3. Validation Rules

| Rule | Value | Behavior |
|------|-------|----------|
| **Minimum** | 5 seconds | Values < 5 clamped to 5 |
| **Maximum** | 300 seconds | Values > 300 clamped to 300 |
| **Invalid** | NaN, null, undefined | Defaults to 10 |
| **Empty** | "" | Defaults to 10 |
| **Decimal** | 10.5 | Parsed to 10 (integer) |
| **Negative** | -5 | Clamped to 5 |

**Validation Code:**
```javascript
const newTimer = parseInt(tempTimerValue) || 10;
const clampedTimer = Math.max(5, Math.min(300, newTimer));
```

---

### 3.4. Parent Integration

#### Props Required

**EditQuizModal receives:**
```javascript
{
  editedQuestions: Object,           // Current edited state
  onUpdateQuestionTimer: Function    // Callback to update parent
}
```

**onUpdateQuestionTimer signature:**
```javascript
(index: number, updatedQuestion: Object) => void
```

#### Parent Handler

**QuizEditor.handleQuestionUpdate:**
```javascript
const handleQuestionUpdate = (index, updatedQuestion) => {
  setEditedQuestions(prev => ({
    ...prev,
    [index]: updatedQuestion
  }));
  setModifiedQuestions(prev => new Set([...prev, index]));
};
```

**Effects:**
1. Updates `editedQuestions` state with new question data
2. Adds question index to `modifiedQuestions` set
3. Triggers auto-save to localStorage (via useEffect)
4. Marks question as having unsaved changes

---

## 4. User Interaction Flow

### 4.1. Edit Timer

```
1. User sees timer value "10s" next to clock icon
2. User double-clicks on timer area
3. Input field appears with "10" selected
4. User types "30"
5. User presses Enter (or clicks outside)
6. Input field disappears
7. Timer now shows "30s"
8. Question card shows modified indicator
9. Changes auto-saved to localStorage
```

### 4.2. Cancel Edit

```
1. User double-clicks timer
2. Input field appears
3. User types new value
4. User presses Escape
5. Input field disappears
6. Timer shows original value (unchanged)
```

### 4.3. Invalid Input

```
1. User double-clicks timer
2. Input field appears
3. User types "abc" or leaves empty
4. User presses Enter
5. Input field disappears
6. Timer shows "10s" (default)
7. Question marked as modified
```

### 4.4. Out of Range

```
1. User double-clicks timer
2. Input field appears
3. User types "500" (> 300)
4. User presses Enter
5. Input field disappears
6. Timer shows "300s" (clamped to max)
7. Question marked as modified
```

---

## 5. State Synchronization

### 5.1. Local State (EditQuizModal)

**Purpose:** Track which timer is being edited and temporary value

**State:**
```javascript
editingTimerIndex: number | null    // Which question's timer is being edited
tempTimerValue: string              // Temporary input value
```

**Lifecycle:**
- **Idle:** `editingTimerIndex = null`
- **Editing:** `editingTimerIndex = <index>`, `tempTimerValue = "<value>"`
- **Saved:** `editingTimerIndex = null` (reset)

### 5.2. Parent State (QuizEditor)

**Purpose:** Store all question edits and track modifications

**State:**
```javascript
editedQuestions: { [index: number]: Question }  // All edited questions
modifiedQuestions: Set<number>                  // Indices of modified questions
```

**Update Flow:**
```
handleTimerBlur
    ↓
onUpdateQuestionTimer(index, updatedQuestion)
    ↓
setEditedQuestions({ ...prev, [index]: updatedQuestion })
setModifiedQuestions(new Set([...prev, index]))
```

### 5.3. Persistence (localStorage)

**Trigger:** `useEffect` in QuizEditor watches `editedQuestions` and `modifiedQuestions`

**Storage Key:** `quiz_edit_${quiz.id}`

**Data Structure:**
```javascript
{
  timestamp: "2025-10-23T01:30:00.000Z",
  questions: {
    0: { /* question 0 data */ },
    1: { /* question 1 data */ },
    // ...
  },
  modified: [0, 1, 3, 5]  // Array of modified indices
}
```

**Restoration:** On component mount, load from localStorage and restore state

---

## 6. Edge Cases & Handling

### 6.1. Multiple Edits
**Scenario:** User edits timer, then edits again before saving

**Handling:**
- Each edit updates `editedQuestions` state
- Previous edit is overwritten
- Only final value is saved to Firebase
- All intermediate states auto-saved to localStorage

### 6.2. Edit During Save
**Scenario:** User edits timer while save is in progress

**Handling:**
- Save button disabled during save (`isSaving` state)
- Timer editing still allowed (independent operation)
- New edits marked as modified
- User can save again after first save completes

### 6.3. Edit Hidden Question
**Scenario:** User edits timer of a hidden question

**Handling:**
- Timer editing works normally
- Hidden state independent of timer value
- Both changes tracked separately
- Both persist to Firebase on save

### 6.4. Rapid Double-Clicks
**Scenario:** User double-clicks multiple timers rapidly

**Handling:**
- Only one timer can be in edit mode at a time
- Opening new edit closes previous edit
- Previous edit auto-saves on blur
- No data loss

### 6.5. Click Outside While Editing
**Scenario:** User clicks question card while editing timer

**Handling:**
- `onClick={(e) => e.stopPropagation()}` on input
- Prevents question selection
- Input blur saves timer
- Then question can be selected

---

## 7. Performance Considerations

### 7.1. Re-render Optimization

**Minimal Re-renders:**
- Only edited question card re-renders
- Other question cards unaffected
- Parent component doesn't re-render unnecessarily

**Key:** Proper state isolation and event handling

### 7.2. Event Handling

**Efficient:**
- `stopPropagation()` prevents event bubbling
- No unnecessary parent handlers triggered
- Click events handled at lowest level

### 7.3. State Updates

**Batched:**
- React batches state updates automatically
- Multiple `setState` calls in same handler batched
- Single re-render per user action

---

## 8. Accessibility

### 8.1. Keyboard Support

| Key | Action |
|-----|--------|
| **Double-click** | Activate edit mode |
| **Tab** | Navigate to input (auto-focused) |
| **Type** | Update value |
| **Enter** | Save and close |
| **Escape** | Cancel and close |
| **Click outside** | Save and close |

### 8.2. Visual Indicators

- **Cursor: pointer** on timer display (indicates clickable)
- **Tooltip** on hover: "Double-click to edit timer"
- **Purple border** on input (indicates active state)
- **Auto-focus** on input (clear edit target)

### 8.3. Screen Readers

**Current:** Basic support (input field is standard HTML)

**Future Enhancements:**
- Add `aria-label` to timer display
- Add `aria-live` region for value changes
- Add `role="spinbutton"` to input
- Add `aria-valuemin`, `aria-valuemax`, `aria-valuenow`

---

## 9. Testing Strategy

### 9.1. Unit Tests (Future)

```javascript
describe('Inline Timer Editing', () => {
  test('double-click activates edit mode', () => {});
  test('enter key saves value', () => {});
  test('escape key cancels edit', () => {});
  test('blur saves value', () => {});
  test('invalid input defaults to 10', () => {});
  test('value < 5 clamped to 5', () => {});
  test('value > 300 clamped to 300', () => {});
  test('parent callback called with correct data', () => {});
});
```

### 9.2. Integration Tests (Future)

```javascript
describe('Timer Edit Integration', () => {
  test('edited timer persists to localStorage', () => {});
  test('edited timer persists to Firebase on save', () => {});
  test('edited timer marked as modified', () => {});
  test('multiple timer edits tracked correctly', () => {});
});
```

### 9.3. Manual Testing Checklist

- [x] Double-click activates input
- [x] Input auto-focuses
- [x] Typing updates value
- [x] Enter saves and closes
- [x] Escape cancels and closes
- [x] Click outside saves and closes
- [x] Invalid input defaults to 10
- [x] Values clamped correctly
- [x] Question marked as modified
- [x] Changes persist to localStorage
- [x] Changes persist to Firebase
- [x] Multiple edits work correctly
- [x] Edit during save works
- [x] Edit hidden question works

---

## 10. Future Enhancements

### 10.1. Inline Editing Extensions

**Other Fields:**
- Points (double-click to edit)
- Question text (click to edit)
- Answer options (click to edit)

**Bulk Operations:**
- Select multiple questions
- Edit all selected timers at once
- Apply timer to selected questions

### 10.2. UI Improvements

**Visual Feedback:**
- Highlight edited fields with subtle color
- Show "Edited" badge on modified questions
- Animate value change

**Validation:**
- Show error message for invalid input
- Highlight invalid values in red
- Provide suggested values

### 10.3. Advanced Features

**Smart Defaults:**
- Remember last used timer value
- Suggest common timer values (10, 30, 60)
- Auto-adjust based on question complexity

**Keyboard Shortcuts:**
- Arrow up/down to increment/decrement
- Ctrl+Z to undo last edit
- Ctrl+S to save all changes

---

## 11. Related Systems

### 11.1. Hide Button System
- Uses same `editedQuestions` state
- Independent visual feedback
- Both changes tracked in `modifiedQuestions`

### 11.2. Save System
- Collects all `editedQuestions` changes
- Validates before save
- Persists to Firebase
- Clears `modifiedQuestions` on success

### 11.3. Auto-Save System
- Watches `editedQuestions` and `modifiedQuestions`
- Saves to localStorage on every change
- Restores on component mount
- Prevents data loss

---

## 12. API Reference

### 12.1. Props

#### EditQuizModal

```typescript
interface EditQuizModalProps {
  quiz: Quiz;
  editedQuestions: { [index: number]: Question };
  onQuestionSelect: (index: number) => void;
  selectedQuestionIndex: number | null;
  onSaveChanges: () => void;
  onCancel: () => void;
  showEditor: boolean;
  onSetAllTimers: (timer: number) => void;
  onUpdateQuestionTimer: (index: number, question: Question) => void;
  onHideQuestion: (index: number) => void;
  onDeleteQuestion: (index: number) => void;
  onAddQuestion: () => void;
  isSaving: boolean;
  showSaveSuccess: boolean;
}
```

### 12.2. State

```typescript
interface EditQuizModalState {
  commonTimer: number;
  editingTimerIndex: number | null;
  tempTimerValue: string;
}
```

### 12.3. Handlers

```typescript
function handleTimerDoubleClick(index: number): void;
function handleTimerChange(value: string): void;
function handleTimerBlur(index: number): void;
function handleTimerKeyDown(e: KeyboardEvent, index: number): void;
```

---

**Status:** ✅ Implemented  
**Version:** 1.0  
**Last Updated:** October 23, 2025
