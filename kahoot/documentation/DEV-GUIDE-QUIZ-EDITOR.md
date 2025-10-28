# Developer Guide: Quiz Question Editor

**Quick reference for developers working with the Quiz Question Editor feature**

---

## Quick Start

### Running the Feature
```bash
# Start dev server
npm run dev

# Navigate to Teacher Lobby
http://localhost:5173/lobby

# Click "Edit" on any quiz card
```

### File Locations
```
src/
├── components/
│   ├── EditQuizModal.jsx          # Main modal (540 lines)
│   └── QuestionEditorPanel.jsx    # Editor panel (350 lines)
└── pages/
    └── TeacherLobbyPage.jsx        # Updated button (5 changes)

documentation/
├── tasks/
│   └── 0007-prd-quiz-question-editor.md
├── IMPLEMENTATION-QUIZ-EDITOR-2025-10-22.md
├── TESTING-GUIDE-QUIZ-EDITOR.md
└── FINAL-SUMMARY-QUIZ-EDITOR-2025-10-22.md
```

---

## Component API

### EditQuizModal

**Props:**
```typescript
interface EditQuizModalProps {
  show: boolean;           // Controls modal visibility
  handleClose: () => void; // Callback when modal closes
  quiz: Quiz;             // Quiz object with id and questions
}
```

**Key State:**
```javascript
const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
const [leftPanelWidth, setLeftPanelWidth] = useState(400);
const [editedQuestions, setEditedQuestions] = useState({});
const [modifiedQuestions, setModifiedQuestions] = useState(new Set());
```

**LocalStorage Key:**
```javascript
const storageKey = `quiz_edit_${quiz.id}`;
```

### QuestionEditorPanel

**Props:**
```typescript
interface QuestionEditorPanelProps {
  question: Question;              // Current question data
  questionIndex: number;           // 0-based index
  totalQuestions: number;          // Total count
  onUpdate: (q: Question) => void; // Update callback
  onClose: () => void;            // Close panel
  onReset: () => void;            // Reset to original
  onPrevious: () => void;         // Navigate to previous
  onNext: () => void;             // Navigate to next
  isFirst: boolean;               // Disable previous
  isLast: boolean;                // Disable next
}
```

**Key State:**
```javascript
const [localQuestion, setLocalQuestion] = useState(question);
const [validationWarnings, setValidationWarnings] = useState({});
```

---

## Data Structures

### Quiz Object
```typescript
interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  passage?: Passage;
}
```

### Question Object (Multiple Choice)
```typescript
interface Question {
  type: 'multiple-choice';
  question: string;
  options: string[];      // Array of 4 options
  answer: string;         // Correct answer text
  timer: number;          // Seconds (5-300)
  points?: number;        // Optional
  passage?: Passage;      // Optional question-specific passage
}
```

### LocalStorage Data
```typescript
interface StoredQuizEdit {
  timestamp: string;      // ISO timestamp
  questions: {
    [index: number]: Question;
  };
  modified: number[];     // Array of modified indices
}
```

---

## Key Functions

### Auto-Save to LocalStorage
```javascript
useEffect(() => {
  if (quiz && Object.keys(editedQuestions).length > 0) {
    const storageKey = getStorageKey();
    const dataToSave = {
      timestamp: new Date().toISOString(),
      questions: editedQuestions,
      modified: Array.from(modifiedQuestions)
    };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  }
}, [editedQuestions, modifiedQuestions, quiz]);
```

### Validation
```javascript
const validateQuestions = () => {
  const errors = [];
  Object.entries(editedQuestions).forEach(([index, question]) => {
    if (!question.question?.trim()) {
      errors.push(`Question ${parseInt(index) + 1}: Question text is empty`);
    }
    // ... more validation
  });
  return errors;
};
```

### Save to Firebase
```javascript
const performSave = () => {
  const updates = {};
  Object.entries(editedQuestions).forEach(([index, question]) => {
    updates[`/quizzes/${quiz.id}/questions/${index}`] = question;
  });
  
  update(ref(database), updates)
    .then(() => {
      localStorage.removeItem(getStorageKey());
      alert('Quiz saved successfully!');
      handleClose();
    })
    .catch(error => {
      console.error('Error saving quiz:', error);
      alert('Error saving quiz. Please try again.');
    });
};
```

---

## Styling Guide

### Color Palette
```javascript
const colors = {
  primary: '#8b5cf6',      // Purple (selection, hover)
  danger: '#ef4444',       // Red (validation errors)
  warning: '#f59e0b',      // Orange (modified indicator)
  success: '#10b981',      // Green (success messages)
  border: '#e2e8f0',       // Light gray (borders)
  background: '#f8fafc',   // Very light gray (backgrounds)
  text: '#1e293b',         // Dark gray (primary text)
  textMuted: '#64748b'     // Medium gray (secondary text)
};
```

### Common Styles
```javascript
// Card with hover effect
style={{
  padding: '1rem',
  background: '#ffffff',
  borderRadius: '0.5rem',
  border: '2px solid #e2e8f0',
  transition: 'all 0.2s ease',
  cursor: 'pointer'
}}

// Validation error field
style={{
  border: '2px solid #ef4444',
  borderRadius: '0.5rem'
}}

// Modified indicator dot
style={{
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: '#f59e0b'
}}
```

---

## Common Tasks

### Adding a New Editable Field

1. **Update Question Interface** (if needed)
```typescript
interface Question {
  // ... existing fields
  newField: string;  // Add new field
}
```

2. **Add to QuestionEditorPanel**
```jsx
<TextInput
  label="New Field"
  value={localQuestion.newField || ''}
  onChange={(e) => handleFieldChange('newField', e.target.value)}
  styles={{ /* ... */ }}
/>
```

3. **Add Validation** (if required)
```javascript
if (!q.newField || q.newField.trim() === '') {
  warnings.newField = 'New field is empty';
}
```

### Supporting a New Question Type

1. **Check Question Type**
```javascript
if (question.type === 'new-type') {
  // Render custom UI
}
```

2. **Create Custom Editor Component**
```jsx
const NewTypeEditor = ({ question, onUpdate }) => {
  // Custom editing UI
};
```

3. **Integrate in QuestionEditorPanel**
```jsx
{question.type === 'new-type' ? (
  <NewTypeEditor question={question} onUpdate={onUpdate} />
) : (
  // Default editor
)}
```

### Debugging LocalStorage

```javascript
// View stored data
const storageKey = `quiz_edit_${quizId}`;
const data = JSON.parse(localStorage.getItem(storageKey));
console.log('Stored data:', data);

// Clear stored data
localStorage.removeItem(storageKey);

// View all quiz edits
Object.keys(localStorage)
  .filter(key => key.startsWith('quiz_edit_'))
  .forEach(key => {
    console.log(key, localStorage.getItem(key));
  });
```

---

## Troubleshooting

### Modal Not Opening
```javascript
// Check props
console.log('show:', show);
console.log('quiz:', quiz);

// Verify quiz has questions
console.log('questions:', quiz?.questions?.length);
```

### Auto-Save Not Working
```javascript
// Check useEffect dependencies
useEffect(() => {
  console.log('Auto-save triggered');
  console.log('editedQuestions:', editedQuestions);
  console.log('modifiedQuestions:', modifiedQuestions);
}, [editedQuestions, modifiedQuestions, quiz]);

// Check localStorage quota
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
} catch (e) {
  console.error('LocalStorage quota exceeded:', e);
}
```

### Validation Not Showing
```javascript
// Check validation state
console.log('validationWarnings:', validationWarnings);

// Verify validateFields is called
const validateFields = (q) => {
  console.log('Validating:', q);
  // ... validation logic
};
```

### Resizing Not Working
```javascript
// Check mouse event listeners
useEffect(() => {
  console.log('Adding mouse listeners');
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  return () => {
    console.log('Removing mouse listeners');
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
}, [show]);
```

---

## Performance Optimization

### Memoization
```javascript
import { useMemo, useCallback } from 'react';

// Memoize expensive calculations
const questionList = useMemo(() => {
  return quiz.questions.map((q, i) => ({
    index: i,
    text: q.question,
    modified: modifiedQuestions.has(i)
  }));
}, [quiz.questions, modifiedQuestions]);

// Memoize callbacks
const handleMouseMove = useCallback((e) => {
  if (!isResizing.current) return;
  // ... resize logic
}, []);
```

### Debouncing
```javascript
import { useEffect, useRef } from 'react';

const useDebouncedEffect = (callback, delay, deps) => {
  const timeoutRef = useRef();
  
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(callback, delay);
    
    return () => clearTimeout(timeoutRef.current);
  }, deps);
};

// Usage
useDebouncedEffect(() => {
  // Save to localStorage
}, 500, [editedQuestions]);
```

---

## Testing Utilities

### Mock Quiz Data
```javascript
const mockQuiz = {
  id: 'test-quiz-123',
  title: 'Test Quiz',
  questions: [
    {
      type: 'multiple-choice',
      question: 'Test question?',
      options: ['A', 'B', 'C', 'D'],
      answer: 'A',
      timer: 10
    }
  ]
};
```

### Test Helpers
```javascript
// Clear all quiz edits from localStorage
const clearAllQuizEdits = () => {
  Object.keys(localStorage)
    .filter(key => key.startsWith('quiz_edit_'))
    .forEach(key => localStorage.removeItem(key));
};

// Simulate validation errors
const createInvalidQuestion = () => ({
  question: '',  // Empty
  options: ['A', '', 'C', 'D'],  // Empty option
  answer: '',    // Empty
  timer: 10
});
```

---

## Firebase Integration

### Security Rules (Recommended)
```json
{
  "rules": {
    "quizzes": {
      "$quizId": {
        ".read": true,
        ".write": "auth != null && auth.token.isAdmin == true",
        "questions": {
          "$questionIndex": {
            ".validate": "newData.hasChildren(['question', 'options', 'answer', 'timer'])"
          }
        }
      }
    }
  }
}
```

### Update Pattern
```javascript
import { ref, update } from 'firebase/database';
import { database } from '../services/firebase';

// Batch update multiple questions
const updates = {};
updates[`/quizzes/${quizId}/questions/0`] = question0;
updates[`/quizzes/${quizId}/questions/1`] = question1;

update(ref(database), updates)
  .then(() => console.log('Success'))
  .catch(error => console.error('Error:', error));
```

---

## Code Conventions

### Naming
- **Components:** PascalCase (`EditQuizModal`)
- **Functions:** camelCase (`handleQuestionClick`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_PANEL_WIDTH`)
- **Props:** camelCase (`onUpdate`, `isFirst`)

### File Organization
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { Modal } from '@mantine/core';

// 2. Constants
const MIN_PANEL_WIDTH = 300;
const MAX_PANEL_WIDTH = 600;

// 3. Component
const EditQuizModal = ({ show, handleClose, quiz }) => {
  // 3a. State
  const [state, setState] = useState();
  
  // 3b. Effects
  useEffect(() => {}, []);
  
  // 3c. Handlers
  const handleClick = () => {};
  
  // 3d. Render
  return <div>...</div>;
};

// 4. Export
export default EditQuizModal;
```

### Comments
```javascript
// Single-line comment for simple explanations

/**
 * Multi-line comment for complex logic
 * Explains the why, not the what
 */

// TODO: Future enhancement
// FIXME: Known issue to address
// NOTE: Important consideration
```

---

## Useful Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run preview            # Preview production build

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run Playwright tests
npm run lint               # Run ESLint
npm run format             # Format with Prettier

# Firebase
firebase emulators:start   # Start local emulators
firebase deploy            # Deploy to production
```

---

## Resources

### Documentation
- [PRD](./tasks/0007-prd-quiz-question-editor.md)
- [Implementation Details](./IMPLEMENTATION-QUIZ-EDITOR-2025-10-22.md)
- [Testing Guide](./TESTING-GUIDE-QUIZ-EDITOR.md)
- [Final Summary](./FINAL-SUMMARY-QUIZ-EDITOR-2025-10-22.md)

### External Links
- [React Hooks](https://react.dev/reference/react)
- [Mantine UI](https://mantine.dev/)
- [Firebase Docs](https://firebase.google.com/docs)

---

**Last Updated:** October 22, 2025  
**Maintainer:** Development Team
