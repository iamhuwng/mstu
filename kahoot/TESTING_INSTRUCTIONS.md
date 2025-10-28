# Testing Instructions - Quiz Feedback Bug
## Date: October 21, 2025, 11:54 PM

---

## 🎯 Objective

Test the quiz flow using `tests/comprehensive-mock-quiz.json` to verify that the feedback screen bug is resolved.

---

## 🔧 Recent Fixes Applied

1. **Variable Definition Order** - Moved `hasQuestions` definition before navigation effect
2. **Navigation Guards** - Enhanced guards to check all required data before navigating
3. **Timer Guards** - Added `isReadyToShowTimer` to prevent premature timer rendering
4. **Session Initialization** - Added `status: 'waiting'` to initial session data
5. **Comprehensive Logging** - Added detailed console logs to track state changes

---

## 📋 Pre-Test Setup

### Step 1: Clear Firebase Data

**IMPORTANT**: Before testing, you must clear any old session data from Firebase to avoid conflicts.

1. Open Firebase Console: https://console.firebase.google.com
2. Navigate to your project
3. Go to **Realtime Database**
4. Find `game_sessions/active_session`
5. **Delete the entire `active_session` node**
6. This ensures a clean start with no leftover `status: 'feedback'` data

### Step 2: Import Test Quiz

The test quiz is located at: `tests/comprehensive-mock-quiz.json`

**Quiz Details**:
- **Title**: "Comprehensive Mock Test - General Knowledge"
- **Questions**: 31 questions
- **Types**: Multiple choice, multiple select, completion, matching, diagram labeling
- **Timers**: 15-60 seconds per question

**To Import**:
1. Open the app in browser: http://127.0.0.1:50425
2. Login as teacher/admin
3. Go to Lobby page
4. Click "Add Mock Quiz" button (if available)
5. OR manually import the JSON into Firebase under `quizzes/`

---

## 🧪 Testing Procedure

### Test 1: Basic Quiz Flow

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
3. **Clear console** (Ctrl+L or click clear button)
4. **Navigate to Lobby** (http://127.0.0.1:50425/lobby)
5. **Select "Comprehensive Mock Test"**
6. **Click "Start" button**
7. **Verify**: Should navigate to waiting room (`/teacher-wait/active_session`)

### Test 2: Start Quiz

1. **On waiting room page**, click "Start Quiz" button
2. **Watch console output** - Should see:
   ```
   🔄 Game session updated: { status: 'in-progress', currentQuestionIndex: 0, ... }
   📚 Loading quiz data for quizId: [quiz-id]
   ✅ Quiz loaded: { title: 'Comprehensive Mock Test...', questionCount: 31 }
   ```
3. **Verify**: Should navigate to quiz page (`/teacher-quiz/active_session`)
4. **Verify**: Question 1 should display immediately
5. **Verify**: Timer should be visible and counting down from 15 seconds
6. **Verify**: Answer choices should be visible: ["London", "Berlin", "Paris", "Madrid"]
7. **Verify**: Question text: "What is the capital of France?"

### Test 3: Timer Behavior

1. **Watch the timer count down**: 15, 14, 13, ..., 1, 0
2. **Watch console output** - Should see:
   ```
   ⏱️ Timer check: { timeRemaining: 15, totalTime: 15, hasStarted: true, willFire: false }
   ⏱️ Timer check: { timeRemaining: 14, totalTime: 15, hasStarted: true, willFire: false }
   ...
   ⏱️ Timer check: { timeRemaining: 0, totalTime: 15, hasStarted: true, willFire: true }
   🔥 Calling onTimeUp!
   ⏰ Timer expired! Setting status to feedback
   🔄 Game session updated: { status: 'feedback', currentQuestionIndex: 0, ... }
   ✅ Valid feedback navigation
   ```
3. **Verify**: Should navigate to feedback page ONLY after timer reaches 0
4. **Verify**: Should NOT navigate before timer expires

### Test 4: Feedback Screen

1. **On feedback page**, verify:
   - Shows correct answer: "Paris"
   - Shows answer aggregation (if students answered)
   - Shows countdown: "Auto-advancing in 5 seconds..."
   - Shows student lists (correct/incorrect)
2. **Watch console** - Should see countdown: 5, 4, 3, 2, 1, 0
3. **After 5 seconds**, should auto-advance to next question
4. **Verify**: Should navigate back to quiz page with Question 2

### Test 5: Question 2

1. **Verify**: Question 2 displays: "Which planet is known as the Red Planet?"
2. **Verify**: Timer shows 20 seconds (different from Q1)
3. **Verify**: Answer choices: ["Venus", "Mars", "Jupiter", "Saturn"]
4. **Wait for timer to expire**
5. **Verify**: Goes to feedback, then auto-advances to Question 3

### Test 6: Multiple Question Types

Test at least these questions:
- **Q1** (Multiple choice, 15s timer)
- **Q3** (Multiple select, 25s timer)
- **Q6** (Multiple choice with passage, 20s timer)
- **Q21** (Completion with word bank, 20s timer)
- **Q27** (Matching, 40s timer)

### Test 7: Manual Navigation

1. **On any question**, click "Next ➡" button before timer expires
2. **Verify**: Should go to feedback immediately
3. **On feedback page**, click "Next ➡" button before 5-second countdown
4. **Verify**: Should advance to next question immediately

### Test 8: Previous Button

1. **On Question 2 or later**, click "⬅ Previous" button
2. **Verify**: Should go back to previous question
3. **Verify**: Timer resets for that question

---

## ✅ Success Criteria

The bug is **FIXED** if ALL of the following are true:

- [ ] Question displays immediately when quiz starts (no flash)
- [ ] Timer is visible and counts down properly
- [ ] Answer choices are visible
- [ ] Can see question for FULL timer duration (15 seconds for Q1)
- [ ] Does NOT jump to feedback before timer expires
- [ ] After timer expires, navigates to feedback screen
- [ ] Feedback screen shows correct answer and student lists
- [ ] Auto-advances to next question after 5 seconds
- [ ] Repeats correctly for all questions
- [ ] Console logs show proper sequence (no errors)
- [ ] No "⚠️ Feedback status but data not ready" messages during normal flow

---

## ❌ Failure Indicators

The bug is **STILL PRESENT** if ANY of these occur:

- [ ] Quiz jumps to feedback immediately after starting
- [ ] Question flashes briefly then disappears
- [ ] Timer doesn't appear or shows 0
- [ ] Answer choices don't display
- [ ] Navigates to feedback before timer expires
- [ ] Console shows "⚠️ Feedback status but data not ready" repeatedly
- [ ] Console shows "🔥 Calling onTimeUp!" immediately on page load

---

## 🐛 Debugging Steps (If Bug Persists)

### Step 1: Check Console Logs

Look for these specific patterns:

**Pattern 1: Immediate Navigation**
```
🔄 Game session updated: { status: 'feedback', ... }
⚠️ Feedback status but data not ready, ignoring
✅ Quiz loaded: { title: '...', questionCount: 31 }
✅ Valid feedback navigation
```
**Diagnosis**: Status is 'feedback' from the start (old Firebase data)
**Fix**: Clear Firebase `game_sessions/active_session` node

**Pattern 2: Premature Timer Fire**
```
⏱️ Timer check: { timeRemaining: 0, totalTime: 0, hasStarted: false, willFire: false }
```
**Diagnosis**: Timer initialized with 0
**Fix**: Check `currentQuestion.timer` value

**Pattern 3: Missing Quiz Data**
```
📚 Loading quiz data for quizId: [quiz-id]
❌ Quiz not found in database
```
**Diagnosis**: Quiz not in Firebase
**Fix**: Import `comprehensive-mock-quiz.json` to Firebase

### Step 2: Check Firebase Data

1. Open Firebase Console
2. Navigate to `game_sessions/active_session`
3. Check current values:
   - `status` should be 'in-progress' when on quiz page
   - `currentQuestionIndex` should match current question
   - `quizId` should point to valid quiz
4. Navigate to `quizzes/[quiz-id]`
5. Verify quiz data exists and has `questions` array

### Step 3: Check Network Tab

1. Open DevTools → Network tab
2. Filter by "Firebase" or "firebaseio"
3. Check for:
   - Successful GET requests for quiz data
   - Successful PATCH/PUT requests for status updates
   - No 404 or 500 errors

---

## 📊 Expected Console Output (Full Sequence)

### Starting Quiz
```
🔄 Game session updated: { status: 'in-progress', currentQuestionIndex: 0, quizId: '...', hasPlayers: false }
📚 Loading quiz data for quizId: [quiz-id]
✅ Quiz loaded: { title: 'Comprehensive Mock Test - General Knowledge', questionCount: 31 }
```

### During Question (every second)
```
⏱️ Timer check: { timeRemaining: 15, totalTime: 15, hasStarted: true, willFire: false }
⏱️ Timer check: { timeRemaining: 14, totalTime: 15, hasStarted: true, willFire: false }
⏱️ Timer check: { timeRemaining: 13, totalTime: 15, hasStarted: true, willFire: false }
...
```

### Timer Expires
```
⏱️ Timer check: { timeRemaining: 0, totalTime: 15, hasStarted: true, willFire: true }
🔥 Calling onTimeUp!
⏰ Timer expired! Setting status to feedback
🔄 Game session updated: { status: 'feedback', currentQuestionIndex: 0, ... }
✅ Valid feedback navigation
```

### On Feedback Page (auto-advance after 5s)
```
🔄 Game session updated: { status: 'in-progress', currentQuestionIndex: 1, ... }
```

---

## 📞 Reporting Results

After testing, please report:

1. **Did the bug occur?** (Yes/No)
2. **Which test failed?** (Test 1-8)
3. **Console output** (copy/paste relevant logs)
4. **Firebase data** (screenshot of `game_sessions/active_session`)
5. **Browser and version** (e.g., Chrome 120)
6. **Any error messages**

---

## 🎯 Test Status

- [ ] Pre-test setup complete (Firebase cleared)
- [ ] Test 1: Basic Quiz Flow
- [ ] Test 2: Start Quiz
- [ ] Test 3: Timer Behavior
- [ ] Test 4: Feedback Screen
- [ ] Test 5: Question 2
- [ ] Test 6: Multiple Question Types
- [ ] Test 7: Manual Navigation
- [ ] Test 8: Previous Button

**Overall Result**: ⏳ Pending Testing

---

**Browser Preview URL**: http://127.0.0.1:50425

**Test Quiz**: `tests/comprehensive-mock-quiz.json` (31 questions)

**Expected Duration**: ~10-15 minutes for full test suite
