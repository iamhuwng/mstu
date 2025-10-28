# Race Condition Investigation

## New Problem Pattern

**After Object.values() fix:**
- Q1: Select answer → ✅ Correct
- Q2-Q5: Select answer → ❌ Incorrect  
- Jump to Q6: Select answer → ✅ Correct
- Q7+: Select answer → ❌ Incorrect

**This suggests a state management race condition, NOT a data structure issue.**

---

## Hypothesis: State Reset Race Condition

### The Sequence of Events

**When question changes:**
1. `gameSession.currentQuestionIndex` updates in Firebase
2. React detects change → `useEffect` fires
3. `setSelectedAnswer('')` → Clears selected answer
4. `hasSubmittedRef.current = false` → Allows submission
5. Component re-renders with new question
6. User sees new question and options

**When timer ends:**
1. `useSynchronizedTimer` detects `remaining === 0`
2. Calls `onTimeUp()` → `handleTimeUp()` executes
3. Reads current `selectedAnswer` state
4. Submits to Firebase

### The Race Condition

**Scenario 1: User selects answer BEFORE timer ends (Q1, Q6)**
```
Question loads → User taps answer → selectedAnswer = "Paris" → Timer ends → Submits "Paris" ✅
```

**Scenario 2: Timer ends BEFORE user selects (Q2-Q5)**
```
Question loads → selectedAnswer = "" → Timer ends → Submits "" → Marked incorrect ❌
```

**Scenario 3: Question changes while timer is running**
```
Q1 ends → Q2 loads → selectedAnswer reset to "" → Timer still running from Q1? → Submits "" ❌
```

---

## Possible Causes

### 1. **Timer Not Resetting Between Questions**

The timer might be carrying over from the previous question, causing it to end immediately when the new question loads.

**Evidence:**
- Q1 works (fresh timer)
- Q2-Q5 fail (timer already running?)
- Q6 works (manual jump resets timer)

**Check:** Does the timer restart properly when `currentQuestionIndex` changes?

### 2. **Mobile Touch Events Not Firing**

Radio button `onChange` might not fire on mobile browsers.

**Evidence:**
- Surface Pro works (desktop browser)
- Pixel 7 fails (mobile browser)

**Check:** Are `handleAnswerSelect` console logs appearing on mobile?

### 3. **State Update Timing**

`setSelectedAnswer(answer)` is async. The state might not update before `handleTimeUp` reads it.

**Evidence:**
- Intermittent failures
- Works when you have more time (Q6 after jump)

**Check:** Is there a delay between `handleAnswerSelect` and `handleTimeUp`?

### 4. **React State Batching**

React might batch state updates, causing `selectedAnswer` to not update immediately.

**Evidence:**
- Multiple rapid state changes (question change + answer selection)

**Check:** Does adding `console.log` after `setSelectedAnswer` show the new value?

---

## Debugging Steps

### Step 1: Check Console Logs on Pixel 7

**Expected logs for working question (Q1):**
```
Quiz loaded: {...}
Question changed: {from: null, to: 0}
handleAnswerSelect called: {answer: "Paris", questionIndex: 0}
selectedAnswer state updated to: Paris
handleTimeUp - Question data: {selectedAnswer: "Paris", correctAnswer: "Paris"}
handleTimeUp - Score result: {score: 10, isCorrect: true}
```

**Expected logs for failing question (Q2):**
```
Question changed: {from: 0, to: 1}
handleTimeUp - Question data: {selectedAnswer: "", correctAnswer: "London"}
handleTimeUp called but no answer selected - skipping submission
```

OR:

```
Question changed: {from: 0, to: 1}
handleAnswerSelect called: {answer: "London", questionIndex: 1}
selectedAnswer state updated to: London
handleTimeUp - Question data: {selectedAnswer: "", correctAnswer: "London"}  ← BUG: State didn't update!
```

### Step 2: Check Timer Behavior

Add logging to `SemicircleTimer` to see when timer starts/stops:

```javascript
useEffect(() => {
  console.log('Timer state changed:', {
    startTime: timerState?.startTime,
    totalTime: timerState?.totalTime,
    questionIndex: gameSession?.currentQuestionIndex
  });
}, [timerState]);
```

### Step 3: Test Manual Answer Selection

On Pixel 7:
1. Load Q1
2. **Wait 2 seconds** before tapping answer
3. Tap answer
4. Wait for timer to end
5. Check if it's marked correct

If this works, it confirms the race condition hypothesis.

---

## Potential Fixes

### Fix 1: Store Answer in Ref Instead of State

```javascript
const selectedAnswerRef = useRef('');

const handleAnswerSelect = (e) => {
  const answer = e.target.value;
  selectedAnswerRef.current = answer;  // Immediate, synchronous
  setSelectedAnswer(answer);  // For UI update
};

const handleTimeUp = () => {
  const answer = selectedAnswerRef.current;  // Read from ref, not state
  // Submit answer...
};
```

**Pros:** Eliminates state update timing issues  
**Cons:** More complex code

### Fix 2: Debounce Timer End

```javascript
const handleTimeUp = () => {
  // Wait a tiny bit for state to settle
  setTimeout(() => {
    const answer = selectedAnswer;
    // Submit answer...
  }, 50);
};
```

**Pros:** Simple  
**Cons:** Hacky, doesn't solve root cause

### Fix 3: Don't Auto-Submit Empty Answers

```javascript
const handleTimeUp = () => {
  if (!selectedAnswer || selectedAnswer === '') {
    console.warn('No answer selected - skipping submission');
    return;
  }
  // Submit answer...
};
```

**Pros:** Prevents incorrect submissions  
**Cons:** Students who don't answer get nothing submitted (might be desired behavior)

### Fix 4: Submit on Answer Selection

```javascript
const handleAnswerSelect = (e) => {
  const answer = e.target.value;
  setSelectedAnswer(answer);
  
  // Submit immediately when answer is selected
  submitAnswer(answer);
};
```

**Pros:** No race condition, immediate feedback  
**Cons:** Changes UX (can't change answer after selection)

---

## Current Implementation

I've added:
1. **Comprehensive logging** to track state changes
2. **Empty answer check** in `handleTimeUp` to prevent submitting ""
3. **Question change logging** to see when resets happen

This will help us see EXACTLY what's happening on the Pixel 7.

---

## Next Steps

1. **Deploy** the updated code with logging
2. **Test on Pixel 7** and capture console logs
3. **Analyze logs** to see:
   - Is `handleAnswerSelect` being called?
   - What is `selectedAnswer` when `handleTimeUp` fires?
   - Is there a timing issue between state update and timer end?
4. **Implement appropriate fix** based on findings

---

## Expected Outcome

With the current fix (skipping submission if `selectedAnswer === ''`), you should see:

**Q1:** Answer selected → Submitted → ✅ Correct  
**Q2-Q5:** No answer selected (due to race condition) → Skipped → No score (0 points)  
**Q6:** Answer selected → Submitted → ✅ Correct

This is better than marking them incorrect, but we need to fix the root cause so students can actually answer Q2-Q5.
