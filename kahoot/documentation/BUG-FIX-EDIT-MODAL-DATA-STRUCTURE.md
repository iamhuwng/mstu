# Bug Fix: Edit Modal Data Structure Mismatch

**Date:** October 22, 2025  
**Severity:** Critical  
**Status:** ✅ FIXED

---

## Problem Summary

The Edit button opens a modal that displays broken UI with empty question text and fails to load quiz data correctly.

---

## Root Cause Analysis

### Data Structure Mismatch

The `EditQuizModal` component expects quiz questions to follow this structure:
```javascript
{
  type: 'multiple-choice',
  question: 'What is 2 + 2?',      // ← Expected field name
  options: ['3', '4', '5', '6'],
  answer: '4',                      // ← Expected field name
  timer: 10,
  points: 10
}
```

However, the mock quiz creation function in `TeacherLobbyPage.jsx` was using an **outdated structure**:
```javascript
{
  text: 'What is 2 + 2?',           // ❌ Wrong field name
  options: ['3', '4', '5', '6'],
  correctAnswer: '4'                // ❌ Wrong field name
}
```

### Impact

When the Edit modal tries to access:
- `question.question` → Returns `undefined` (because the field is named `text`)
- `question.answer` → Returns `undefined` (because the field is named `correctAnswer`)

This causes:
1. ❌ Question text displays as "(Empty)"
2. ❌ Correct answer validation fails
3. ❌ Editor panel cannot load question data
4. ❌ Save functionality breaks

---

## Evidence

### File: `src/pages/TeacherLobbyPage.jsx` (Line 52-76)

**BEFORE (Broken):**
```javascript
const createMockQuiz = () => {
  const mockQuiz = {
    title: 'Mock Quiz for Testing',
    questions: [
      { text: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: '4' },
      { text: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctAnswer: 'Paris' }
    ]
  };
  const quizzesRef = ref(database, 'quizzes');
  push(quizzesRef, mockQuiz);
};
```

**AFTER (Fixed):**
```javascript
const createMockQuiz = () => {
  const mockQuiz = {
    title: 'Mock Quiz for Testing',
    questions: [
      { 
        type: 'multiple-choice',
        question: 'What is 2 + 2?', 
        options: ['3', '4', '5', '6'], 
        answer: '4',
        timer: 10,
        points: 10
      },
      { 
        type: 'multiple-choice',
        question: 'What is the capital of France?', 
        options: ['London', 'Berlin', 'Paris', 'Madrid'], 
        answer: 'Paris',
        timer: 15,
        points: 10
      }
    ]
  };
  const quizzesRef = ref(database, 'quizzes');
  push(quizzesRef, mockQuiz);
};
```

---

## Code References

### EditQuizModal.jsx - Expected Structure

**Line 91-92:** Validation expects `question.question`
```javascript
if (!question.question || question.question.trim() === '') {
  errors.push(`Question ${questionNum}: Question text is empty`);
}
```

**Line 109-114:** Validation expects `question.answer`
```javascript
if (!question.answer) {
  errors.push(`Question ${questionNum}: Correct answer is not set`);
} else if (typeof question.answer === 'string' && question.answer.trim() === '') {
  errors.push(`Question ${questionNum}: Correct answer is not set`);
}
```

**Line 308:** Display expects `question.question`
```javascript
{editedQuestion.question || '(Empty)'}
```

### QuestionEditorPanel.jsx - Expected Structure

**Line 28-29:** Validation expects `q.question`
```javascript
if (!q.question || q.question.trim() === '') {
  warnings.question = 'Question text is empty';
}
```

**Line 175:** Input field expects `localQuestion.question`
```javascript
<Textarea
  value={localQuestion.question || ''}
  onChange={(e) => handleFieldChange('question', e.target.value)}
/>
```

---

## Correct Data Structure (Standard)

Based on `tests/comprehensive-mock-quiz.json` and `tests/sample-quiz.json`:

```javascript
{
  "type": "multiple-choice",           // Required: Question type
  "question": "Question text here",    // Required: Question text (NOT 'text')
  "options": ["A", "B", "C", "D"],    // Required: Answer options
  "answer": "B",                       // Required: Correct answer (NOT 'correctAnswer')
  "timer": 20,                         // Required: Time limit in seconds
  "points": 10                         // Optional: Points for correct answer
}
```

### Supported Question Types
- `multiple-choice` - Single correct answer
- `multiple-select` - Multiple correct answers (answer is array)
- `matching` - Match pairs (options are objects)
- `completion` - Fill in blanks (answer is string or array)

---

## Testing

### Manual Test Steps

1. ✅ **Create Mock Quiz**
   - Click "Create Mock Quiz" button
   - Verify quiz appears in list

2. ✅ **Open Edit Modal**
   - Click "Edit" button on mock quiz
   - Verify modal opens with question list

3. ✅ **View Question Details**
   - Click on a question in the list
   - Verify question text displays correctly (not "(Empty)")
   - Verify options display correctly
   - Verify correct answer is selected

4. ✅ **Edit Question**
   - Change question text
   - Verify changes are saved to localStorage
   - Verify modified indicator (orange dot) appears

5. ✅ **Save Changes**
   - Click "Save Changes" button
   - Verify no validation errors
   - Verify success message
   - Verify changes persist in Firebase

### Expected Results

- ✅ Question text displays correctly
- ✅ Options display correctly
- ✅ Correct answer is pre-selected
- ✅ Timer value displays correctly
- ✅ Validation passes
- ✅ Save succeeds

---

## Related Issues

### Potential Data Migration Needed

If there are existing quizzes in Firebase with the old structure (`text`, `correctAnswer`), they will also fail to load in the Edit modal.

**Solution Options:**

1. **Database Migration Script** - Convert all existing quizzes to new structure
2. **Backward Compatibility Layer** - Add fallback logic in EditQuizModal
3. **Manual Cleanup** - Delete old quizzes and re-upload

**Recommended:** Option 2 (Backward Compatibility)

```javascript
// Add to EditQuizModal.jsx initialization (line 36)
quiz.questions.forEach((q, index) => {
  // Normalize old structure to new structure
  const normalized = {
    ...q,
    question: q.question || q.text,           // Fallback to 'text'
    answer: q.answer || q.correctAnswer,      // Fallback to 'correctAnswer'
    type: q.type || 'multiple-choice',        // Default type
    timer: q.timer || 10,                     // Default timer
    points: q.points || 10                    // Default points
  };
  initial[index] = normalized;
});
```

---

## Files Modified

1. ✅ `src/pages/TeacherLobbyPage.jsx` (Line 52-76)
   - Fixed `createMockQuiz()` function
   - Changed `text` → `question`
   - Changed `correctAnswer` → `answer`
   - Added `type`, `timer`, `points` fields

---

## Prevention

### Code Review Checklist

- [ ] Verify data structure matches schema
- [ ] Check field names against existing code
- [ ] Test with actual Firebase data
- [ ] Validate against test fixtures

### Documentation

- [ ] Update API documentation with correct structure
- [ ] Add TypeScript interfaces (if applicable)
- [ ] Document migration path for old data

---

## Conclusion

**Root Cause:** Data structure mismatch between mock quiz creation and EditQuizModal expectations

**Fix:** Updated `createMockQuiz()` to use correct field names (`question`, `answer`) and include all required fields

**Status:** ✅ Fixed - Mock quizzes now work correctly with Edit modal

**Next Steps:** 
1. Test with uploaded quizzes
2. Consider adding backward compatibility layer
3. Add TypeScript types to prevent future mismatches
