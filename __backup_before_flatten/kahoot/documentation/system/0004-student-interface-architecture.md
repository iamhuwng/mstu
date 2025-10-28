# Student Interface Architecture

## 1. Overview

This document describes the architecture of the student quiz interface, which was redesigned on October 22, 2025, to provide an engaging, Kahoot-style interactive experience.

## 2. Component Hierarchy

```
StudentQuizPage
├── TimerDisplay (centered, absolute positioned)
└── StudentAnswerInput
    ├── MultipleChoiceInput (quadrant/grid layout)
    ├── MultipleSelectInput (grid with checkboxes)
    ├── MatchingInput (drag-and-drop)
    ├── CompletionInput (word bank or text input)
    └── DiagramLabelingInput (labeled text inputs)
```

## 3. Core Components

### 3.1. StudentQuizPage

**Location:** `src/pages/StudentQuizPage.jsx`

**Purpose:** Main container for student quiz experience. Manages game state, answer submission, and timer integration.

**Key Responsibilities:**
- Listen to game session updates from Firebase
- Track current answer selection
- Handle auto-submit on timer end
- Display submission status
- Navigate between waiting room, quiz, and results

**State Management:**
```javascript
const [gameSession, setGameSession] = useState(null);
const [quiz, setQuiz] = useState(null);
const [currentAnswer, setCurrentAnswer] = useState(null);
const [timeSpent, setTimeSpent] = useState(0);
const hasSubmittedRef = useRef(false);
const currentQuestionIndexRef = useRef(null);
const questionStartTimeRef = useRef(null);
```

**Key Methods:**
- `submitAnswer(answer)` - Submits answer to Firebase with time tracking
- `handleAnswerChange(answer)` - Updates current answer without submitting
- `handleTimeUp()` - Auto-submits answer when timer reaches zero

**Layout Structure:**
```javascript
<div style={{ /* Full-screen gradient background */ }}>
  {/* Centered Timer */}
  <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
    <TimerDisplay />
  </div>
  
  {/* Answer Input Area */}
  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
    <StudentAnswerInput />
  </div>
  
  {/* Submission Indicator */}
  {hasSubmittedRef.current && <div>✓ Answer Submitted</div>}
</div>
```

### 3.2. StudentAnswerInput

**Location:** `src/components/StudentAnswerInput.jsx`

**Purpose:** Router component that renders the appropriate input interface based on question type.

**Question Type Mapping:**
```javascript
switch (question.type) {
  case 'multiple-choice':
    return <MultipleChoiceInput {...commonProps} />;
  case 'multiple-select':
    return <MultipleSelectInput {...commonProps} />;
  case 'matching':
    return <MatchingInput {...commonProps} />;
  case 'completion':
    return <CompletionInput {...commonProps} />;
  case 'diagram-labeling':
    return <DiagramLabelingInput {...commonProps} />;
  default:
    return <MultipleChoiceInput {...commonProps} />;
}
```

**Common Props:**
```javascript
{
  question: Object,        // Question data
  onAnswerSubmit: Function, // Callback when answer changes
  currentAnswer: Any       // Currently selected answer
}
```

### 3.3. MultipleChoiceInput

**Purpose:** Displays MCQ options in adaptive layouts based on option count.

**Layout Logic:**
```javascript
const getLayout = () => {
  if (optionCount === 2) return 'two-row';      // 2 full-width rows
  if (optionCount === 3) return 'three-quadrant'; // 3 quadrants
  if (optionCount === 4) return 'four-quadrant';  // 4 quadrants (2x2)
  return 'grid';                                  // Responsive grid
};
```

**Color Scheme:**
- Option 1 (Top-left): Red `#e74c3c`
- Option 2 (Top-right): Blue `#3498db`
- Option 3 (Bottom-left): Orange `#f39c12`
- Option 4 (Bottom-right): Green `#2ecc71`
- Selected: Green `#27ae60` with white border

**Responsive Design:**
```javascript
fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'  // Scales with viewport
minHeight: '120px'                       // Touch-friendly
```

### 3.4. MultipleSelectInput

**Purpose:** Allows selection of multiple answers with visual checkmarks.

**Features:**
- Grid layout with colorful buttons
- Toggle selection on click
- Checkmark indicator for selected items
- Auto-submits array of selected answers

**Selection Logic:**
```javascript
const handleToggle = (option) => {
  const newSelected = selectedAnswers.includes(option)
    ? selectedAnswers.filter(item => item !== option)
    : [...selectedAnswers, option];
  
  setSelectedAnswers(newSelected);
  onAnswerSubmit(newSelected);
};
```

### 3.5. MatchingInput

**Purpose:** Provides drag-and-drop interface for matching questions.

**Layout:**
```
┌─────────────────┬─────────────────┐
│   Items         │   Answers       │
│   (Left)        │   (Right)       │
├─────────────────┼─────────────────┤
│ Item 1 (Blue)   │ Answer A (Org)  │
│ Item 2 (Blue)   │ Answer B (Org)  │
│ Item 3 (Blue)   │ Answer C (Org)  │
└─────────────────┴─────────────────┘
```

**Drag-and-Drop Implementation:**
```javascript
// Drag start
const handleDragStart = (e, item, type) => {
  if (type === 'item') {
    setDraggedItem(item);
  } else {
    setDraggedOption(item);
  }
  e.dataTransfer.effectAllowed = 'move';
};

// Drop handling
const handleDrop = (e, target, type) => {
  e.preventDefault();
  
  if (type === 'item' && draggedOption) {
    // Dropping an option onto an item
    const newMatches = { ...matches, [target.id]: draggedOption.id };
    setMatches(newMatches);
    onAnswerSubmit(newMatches);
  }
  // ... handle other scenarios
};
```

**Visual Feedback:**
- Matched pairs show connection indicator
- Matched items turn green
- Hover effects on all draggable elements

### 3.6. CompletionInput

**Purpose:** Handles fill-in-the-blank questions with or without word bank.

**Two Modes:**

**With Word Bank:**
```javascript
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
  {question.wordBank.map((word, index) => (
    <button onClick={() => handleWordClick(word)}>
      {word}
    </button>
  ))}
</div>
```

**Without Word Bank:**
```javascript
<input
  type="text"
  value={typedAnswer}
  onChange={(e) => {
    setTypedAnswer(e.target.value);
    onAnswerSubmit(e.target.value);
  }}
  placeholder="Type your answer here..."
/>
```

### 3.7. DiagramLabelingInput

**Purpose:** Displays multiple labeled text inputs for diagram labeling questions.

**Structure:**
```javascript
{question.labels?.map((label, index) => (
  <div key={label.id}>
    <div>{index + 1}. {label.sentence}</div>
    <input
      type="text"
      value={answers[label.id] || ''}
      onChange={(e) => handleAnswerChange(label.id, e.target.value)}
    />
  </div>
))}
```

## 4. Data Flow

### 4.1. Answer Submission Flow

```
User Action (Click/Drag/Type)
    ↓
Component State Update (setSelectedAnswer)
    ↓
onAnswerSubmit Callback
    ↓
StudentQuizPage.handleAnswerChange
    ↓
setCurrentAnswer (stored, not submitted yet)
    ↓
Timer Ends
    ↓
handleTimeUp()
    ↓
submitAnswer(currentAnswer)
    ↓
Calculate timeSpent
    ↓
Firebase Update
    ↓
{
  answer: <value>,
  isCorrect: <boolean>,
  score: <number>,
  timeSpent: <seconds>
}
```

### 4.2. Time Tracking Flow

```
Question Loads
    ↓
questionStartTimeRef.current = Date.now()
    ↓
Interval Timer (every 100ms)
    ↓
Calculate elapsed = (now - start) / 1000
    ↓
setTimeSpent(elapsed)
    ↓
Answer Submitted
    ↓
finalTimeSpent = (now - start) / 1000
    ↓
Save to Firebase
```

### 4.3. State Synchronization

```
Firebase Game Session
    ↓
onValue Listener
    ↓
setGameSession(data)
    ↓
useEffect (watch gameSession)
    ↓
Check currentQuestionIndex change
    ↓
Reset: currentAnswer, timeSpent, hasSubmitted
    ↓
Start new question timer
```

## 5. Styling Architecture

### 5.1. Color System

**Answer Colors (8 colors for grid layouts):**
```javascript
const GRID_COLORS = [
  { bg: '#e74c3c', hover: '#c0392b' }, // Red
  { bg: '#3498db', hover: '#2980b9' }, // Blue
  { bg: '#f39c12', hover: '#d68910' }, // Orange
  { bg: '#2ecc71', hover: '#27ae60' }, // Green
  { bg: '#9b59b6', hover: '#8e44ad' }, // Purple
  { bg: '#1abc9c', hover: '#16a085' }, // Teal
  { bg: '#e67e22', hover: '#d35400' }, // Dark Orange
  { bg: '#34495e', hover: '#2c3e50' }  // Dark Gray
];
```

**Selected State:**
```javascript
{
  backgroundColor: '#27ae60',
  border: '6px solid #fff',
  boxShadow: '0 8px 24px rgba(39, 174, 96, 0.4), inset 0 0 0 4px rgba(255, 255, 255, 0.3)'
}
```

### 5.2. Responsive Typography

All text uses `clamp()` for fluid scaling:
```javascript
fontSize: 'clamp(minSize, preferredSize, maxSize)'

// Examples:
fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'  // Large buttons
fontSize: 'clamp(1.2rem, 3vw, 1.8rem)'  // Medium buttons
fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' // Small text
```

### 5.3. Layout Patterns

**Quadrant Layout (4 options):**
```css
display: grid;
grid-template-columns: 1fr 1fr;
grid-template-rows: 1fr 1fr;
gap: 1rem;
```

**Three Quadrant (3 options):**
```css
display: grid;
grid-template-columns: 1fr 1fr;
grid-template-rows: 1fr 1fr;
gap: 1rem;

/* Third option spans full width */
grid-column: span 2;
```

**Responsive Grid (5+ options):**
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 1rem;
```

### 5.4. Animation & Transitions

**Hover Effects:**
```javascript
onMouseEnter={(e) => {
  e.currentTarget.style.backgroundColor = hoverColor;
  e.currentTarget.style.transform = 'scale(1.05)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.backgroundColor = normalColor;
  e.currentTarget.style.transform = 'scale(1)';
}}
```

**Transition Properties:**
```css
transition: all 0.3s ease;
```

## 6. Performance Considerations

### 6.1. Optimization Techniques

**Refs for Non-Render Values:**
```javascript
const hasSubmittedRef = useRef(false);  // Doesn't trigger re-render
const questionStartTimeRef = useRef(null);
```

**Memoization:**
- Layout calculations done once per render
- Color schemes defined as constants
- Event handlers use inline functions (React optimizes these)

**Efficient Updates:**
```javascript
// Update every 100ms instead of every frame
const interval = setInterval(() => {
  setTimeSpent(elapsed);
}, 100);
```

### 6.2. Bundle Size

**Component Size:**
- `StudentAnswerInput.jsx`: ~650 lines
- Total new code: ~1,200 lines
- No external dependencies added

## 7. Accessibility

### 7.1. Touch Targets

All interactive elements meet minimum size requirements:
- Buttons: minimum 80-120px height
- Touch-friendly spacing: 1rem gaps

### 7.2. Visual Feedback

- High contrast colors (WCAG AA compliant)
- Clear selected state (green + white border)
- Hover effects for desktop users
- Visual indicators for all actions

### 7.3. Future Improvements

- Add ARIA labels for screen readers
- Implement keyboard navigation
- Add focus indicators
- Support reduced motion preferences

## 8. Error Handling

### 8.1. Validation

**Player Existence Check:**
```javascript
if (!gameSession.players || !gameSession.players[playerId]) {
  console.warn('Player not found in session, skipping answer submission');
  hasSubmittedRef.current = true;
  return;
}
```

**Question Data Validation:**
```javascript
if (!question) {
  return <div>Waiting for question...</div>;
}
```

### 8.2. Fallback Values

```javascript
const finalTimeSpent = questionStartTimeRef.current 
  ? (Date.now() - questionStartTimeRef.current) / 1000 
  : 0;  // Fallback to 0 if no start time
```

## 9. Integration Points

### 9.1. Firebase Structure

**Answer Data:**
```javascript
game_sessions/
  {sessionId}/
    players/
      {playerId}/
        answers/
          {questionIndex}/
            answer: <value>
            isCorrect: <boolean>
            score: <number>
            timeSpent: <seconds>  // NEW in this version
```

### 9.2. Teacher View Integration

**MatchingView Enhancement:**
- Added instruction banner for students
- Shows "📱 Students: Drag and drop items on your device to match pairs"
- Styled to match student interface gradient

## 10. Testing Strategy

### 10.1. Unit Testing

Test each input component independently:
- Render with various option counts
- Simulate user interactions
- Verify state updates
- Check callback invocations

### 10.2. Integration Testing

Test full flow:
- Question loading
- Answer selection
- Timer countdown
- Auto-submit on timer end
- Firebase updates

### 10.3. Device Testing

Test on:
- Desktop (Chrome, Firefox, Safari, Edge)
- Tablet (iPad, Android tablets)
- Mobile (iOS, Android)
- Various screen sizes (320px to 2560px)

## 11. Future Enhancements

### 11.1. Planned Features

- Sound effects for answer selection
- Haptic feedback on mobile
- Animation when timer is low
- Bonus points for fast answers
- Streak tracking

### 11.2. Accessibility Improvements

- Screen reader support
- Keyboard navigation
- High contrast mode
- Reduced motion mode

### 11.3. Performance Optimizations

- Lazy load question components
- Preload next question
- Optimize re-renders
- Add service worker for offline support

---

**Last Updated:** October 22, 2025  
**Version:** 2.0  
**Related Documents:**
- [Student Quiz Redesign](../student-quiz-redesign.md)
- [Session Retrospective 2025-10-22](../SOP/0009-session-retrospective-2025-10-22.md)
