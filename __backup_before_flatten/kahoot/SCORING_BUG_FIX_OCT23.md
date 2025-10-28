# Critical Bug Fix: Only First Question Scores Correctly

## Problem Description

**Symptom:** First question scores correctly, but all subsequent questions are marked as incorrect even when the correct answer is selected.

**Tested on:** Pixel 7, Firefox, Incognito Mode

## Root Cause

The quiz data structure in Firebase can be stored in two formats:
1. **Array format:** `questions: [question1, question2, question3]`
2. **Object format:** `questions: { "0": question1, "1": question2, "2": question3 }`

The code was only handling array format:
```javascript
const question = quiz.questions[questionIndex];  // ❌ Fails for object format
```

When `quiz.questions` is an object:
- `quiz.questions[0]` returns `undefined` (because key is "0", not 0)
- `quiz.questions[1]` returns `undefined`
- Only `quiz.questions["0"]` would work

This caused:
- Question 1 (index 0) to work by accident if stored as array
- All other questions to fail because `question` was `undefined`
- `calculateScore(undefined, answer)` always returns 0

## Fix Applied

Added handling for both formats in `StudentQuizPageNew.jsx`:

```javascript
// Convert to array regardless of storage format
const questions = Array.isArray(quiz.questions) 
  ? quiz.questions 
  : Object.values(quiz.questions || {});

const question = questions[questionIndex];  // ✅ Works for both formats
```

This is applied in two places:
1. **Line 86-89:** In `handleTimeUp()` when submitting answers
2. **Line 148-151:** In render when displaying current question

## Additional Improvements

### 1. Comprehensive Logging
Added console.log statements to track:
- Quiz loading and data structure
- Answer selection
- Score calculation
- Question data at submission time

### 2. Logging Points

**Quiz Load (Line 59-69):**
```javascript
console.log('Quiz loaded:', {
  quizId,
  questionsIsArray,
  questionsType,
  questionCount,
  firstQuestionAnswer
});
```

**Answer Selection (Line 128-132):**
```javascript
console.log('Answer selected:', {
  answer,
  questionIndex,
  timestamp
});
```

**Score Calculation (Line 91-105):**
```javascript
console.log('handleTimeUp - Question data:', {
  questionIndex,
  selectedAnswer,
  correctAnswer,
  questionType,
  questionText
});

console.log('handleTimeUp - Score result:', {
  score,
  isCorrect
});
```

## Testing Instructions

1. **Deploy the updated code**
2. **On Pixel 7 (Firefox, Incognito):**
   - Open browser console (if possible)
   - Join a quiz
   - Answer all questions correctly
   - Check console logs for each question

3. **Expected Console Output:**
   ```
   Quiz loaded: {questionsIsArray: true/false, ...}
   Answer selected: {answer: "Paris", questionIndex: 0}
   handleTimeUp - Question data: {selectedAnswer: "Paris", correctAnswer: "Paris"}
   handleTimeUp - Score result: {score: 10, isCorrect: true}
   ```

4. **Verify on feedback page:**
   - All correct answers should show green checkmarks
   - Score should be 10 points per correct answer

## Files Modified

- `src/pages/StudentQuizPageNew.jsx`

## Related Issues

This same bug likely exists in the old `StudentQuizPage.jsx` but since we're using the new version, it's not critical to fix both.

## Prevention

When creating quizzes in the teacher interface, ensure questions are stored as arrays. If using Firebase Realtime Database's `push()` method, it creates objects with auto-generated keys. Use `set()` with array index instead.
