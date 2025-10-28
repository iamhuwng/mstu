# Product Requirements Document: Teacher Interface Enhancement

**Project:** Interactive Learning Environment (Kahoot-Style)
**Feature:** Teacher Interface UI/UX Overhaul
**Created:** 2025-10-19
**Priority:** P0 (Critical) for UI/Controls/Answer Display, P1 (High) for Admin Persistence
**Target Version:** 2.1 (Post Phase 2)
**Status:** Approved - All Open Questions Resolved

---

## 1. Introduction/Overview

This PRD outlines a comprehensive enhancement to the teacher's quiz interface, addressing UX pain points and adding advanced classroom management features. The current teacher view has several limitations:

- **Material/Passage visibility:** Passages currently occupy fixed space, reducing room for questions/answers
- **Answer visibility:** Correct answers are shown immediately during countdown, spoiling the quiz flow
- **Limited navigation:** Teachers cannot review previous questions or easily terminate sessions
- **Missing feedback screen:** No teacher-side feedback screen exists between questions
- **Cluttered interface:** Controls and player lists compete for screen space
- **Student tracking removal:** Real-time answer aggregation creates unnecessary distraction

**Problem Statement:** Teachers need a cleaner, more flexible interface that prioritizes question content, provides better classroom management tools, and maintains engaging visual feedback without cluttering the experience.

**Goal:** Transform the teacher quiz interface into a professional, streamlined experience with collapsible materials, enhanced controls, and integrated feedback visualization.

---

## 2. Goals

1. **Maximize Question Visibility:** Prioritize question and answer choices display by making materials collapsible
2. **Improve Quiz Flow:** Implement proper feedback screens for teachers matching student experience
3. **Enhance Classroom Management:** Add player management, navigation controls, and session termination
4. **Reduce Cognitive Load:** Remove real-time answer aggregation during questions
5. **Maintain Engagement:** Integrate Rocket Race into feedback screens for visual excitement
6. **Persist Teacher Sessions:** Keep admin/teacher logged in across page reloads
7. **Fix Critical Bugs:** Resolve last-question results screen bug

---

## 3. User Stories

### Story 1: Collapsible Material Panel
> **As a teacher**, I want to collapse the passage/material panel when not needed, **so that** I can maximize screen space for questions and answer choices.

**Acceptance Criteria:**
- When a question has an associated passage, a hamburger menu (☰) button appears in the top-left corner
- Clicking the button opens a left-side panel showing the passage/material
- The divider between passage and question is draggable, allowing custom width adjustment
- The panel collapses/resets to hidden state for each new question
- If a question has no passage, the hamburger button does not appear

---

### Story 2: Answer Display Control
> **As a teacher**, I want correct answers hidden during the countdown timer, **so that** I can observe student responses without spoilers and reveal answers during the feedback phase.

**Acceptance Criteria:**
- While the timer is counting down, NO correct answer is highlighted or indicated
- When the timer expires (or teacher skips the question), the system transitions to a feedback screen
- The feedback screen highlights the correct answer
- If the teacher manually clicks "Next Question" (skip), the feedback screen appears immediately

---

### Story 3: Teacher Feedback Screen
> **As a teacher**, I want a dedicated feedback screen after each question, **so that** I can review the correct answer and see updated scores in the Rocket Race visualization.

**Acceptance Criteria:**
- After a question ends (timer expiry or manual skip), a feedback screen appears
- The feedback screen displays:
  - The Rocket Race chart showing updated student scores
  - A designated area within/near the Rocket Race showing the correct answer text clearly
  - A list showing which students answered correctly and which answered incorrectly
- The feedback screen displays for 5 seconds (matching student experience) with auto-advance to next question
- Teacher can manually click "Next Question" to proceed early
- Score updates happen ONLY on the feedback screen (not during the question)

---

### Story 4: Enhanced Footer Navigation Bar
> **As a teacher**, I want all quiz controls in a fixed footer bar, **so that** I can manage the quiz session without interface clutter.

**Acceptance Criteria:**
- A footer bar spans the bottom of the screen during the quiz
- **Right side buttons (in order):**
  1. "Previous Question" - Navigate back to previous questions with re-answer/re-timing capability
  2. "Pause/Resume" - Pause/resume the current question timer
  3. "Next Question" - Skip to next question or advance from feedback screen
- **Left side buttons:**
  1. "Player (X)" - Shows current participant count; clicking opens a slide-in panel showing player list
  2. "Ban" - Opens slide-in panel showing banned players with IP addresses and "Remove" buttons
  3. "Back" - Terminates quiz session, redirects teacher to lobby, redirects students to waiting room
- "Previous Question" button is available at any time during the quiz
- All buttons use clear iconography and labels

---

### Story 5: Player Management Panel
> **As a teacher**, I want to view and manage participants without leaving the quiz screen, **so that** I can handle disruptions quickly.

**Acceptance Criteria:**
- Clicking "Player (X)" button opens a slide-in panel from the left or right side
- The panel displays:
  - Current active players with names and scores
  - "Kick" button next to each player
- Kicking a player:
  - Marks them as "banned" but keeps their answers in the session data
  - Adds them to the ban list with their IP address
  - Prevents that IP from rejoining THIS session
  - Student is redirected to waiting room with no message
- Panel can be closed by clicking outside or a close button

---

### Story 6: Ban List Management
> **As a teacher**, I want to review and manage banned players, **so that** I can unban students if needed (e.g., accidental kick).

**Acceptance Criteria:**
- Clicking "Ban" button opens a slide-in panel
- The panel shows:
  - List of banned players with names and IP addresses
  - "Remove" button next to each banned player
- Clicking "Remove" unbans the player and removes their IP from the block list, allowing them to rejoin
- Banned players' quiz data remains in the session (for grading purposes)

---

### Story 7: Quiz Termination
> **As a teacher**, I want to end a quiz session early and return to the lobby, **so that** I can restart or abandon a session if needed.

**Acceptance Criteria:**
- Clicking "Back" button in the footer bar terminates the quiz session
- Teacher is redirected to TeacherLobbyPage
- All students are silently redirected to WaitingRoom (no termination message shown)
- The Firebase session node is deleted immediately
- No session data is retained after termination

---

### Story 8: Admin Login Persistence
> **As a teacher**, I want my admin login to persist across page reloads, **so that** I don't have to re-enter credentials after accidental refreshes.

**Acceptance Criteria:**
- After admin login, the authentication state is stored persistently (localStorage or Firebase Auth)
- Reloading the page does not log the teacher out
- A "Logout" button is available in the teacher interface (lobby or settings)
- Login persists indefinitely until explicit logout

---

### Story 9: Remove Real-Time Answer Aggregation
> **As a teacher**, I want student answers hidden during the question countdown, **so that** I can focus on timing and pacing without distraction.

**Acceptance Criteria:**
- During the question phase (while timer is active), NO student answer statistics are shown
- The TeacherQuizPage does NOT display:
  - How many students selected each option
  - Which students answered
  - Real-time answer counts or percentages
- Answer aggregation and statistics ARE shown on the feedback screen (after question ends)
- The Rocket Race score chart updates ONLY on feedback screens (not in real-time during questions)

---

### Story 10: Last Question Results Screen Bug Fix
> **As a teacher**, I want to see the results screen after the last question times out, **so that** I can review final scores and conclude the quiz properly.

**Acceptance Criteria:**
- When the final question's timer expires, the system shows the feedback screen (5 seconds)
- After the feedback screen, the system auto-advances to the results screen (TeacherResultsPage)
- The "Return to Waiting Room" button is removed from the TeacherResultsPage
- Navigation flow matches all other questions (feedback → results)

---

## 4. Functional Requirements

### FR-4.1: Layout & Material Panel (P0)

**FR-4.1.1:** The teacher quiz view SHALL be restructured with a single-column layout by default, displaying the full question and all answer choices centered on screen.

**FR-4.1.2:** When a question contains a `passage` or `material` field, a hamburger menu icon (☰) SHALL appear in the top-left corner.

**FR-4.1.3:** Clicking the hamburger icon SHALL expand a left-side panel showing the passage/material content.

**FR-4.1.4:** The divider between the passage panel and question panel SHALL be draggable, allowing the teacher to adjust the width ratio.

**FR-4.1.5:** The passage panel SHALL default to collapsed (hidden) state when navigating to a new question.

**FR-4.1.6:** If a question has no passage, the hamburger icon SHALL NOT be rendered.

**FR-4.1.7:** The question and answer choices SHALL occupy the full width when the passage panel is collapsed.

---

### FR-4.2: Answer Display & Feedback Screen (P0)

**FR-4.2.1:** During the question countdown phase, the correct answer SHALL NOT be highlighted, indicated, or visually distinguished in any way.

**FR-4.2.2:** When the question timer reaches zero, the system SHALL transition to a Teacher Feedback Screen.

**FR-4.2.3:** When the teacher clicks "Next Question" (skip), the system SHALL immediately transition to the Teacher Feedback Screen.

**FR-4.2.4:** The Teacher Feedback Screen SHALL display:
- The Rocket Race visualization with updated scores
- A clear text area within or adjacent to the Rocket Race stating the correct answer (e.g., "Correct Answer: B. Paris")
- A list showing which students answered correctly and which answered incorrectly (with student names)

**FR-4.2.5:** The Teacher Feedback Screen SHALL auto-advance to the next question after 5 seconds.

**FR-4.2.6:** The teacher MAY click "Next Question" to proceed before the 5-second timer expires.

**FR-4.2.7:** Score updates in the Rocket Race SHALL occur ONLY when the feedback screen loads, NOT in real-time during the question phase.

**FR-4.2.8:** After the final question's feedback screen, the system SHALL auto-advance to TeacherResultsPage.

---

### FR-4.3: Footer Navigation Bar (P0)

**FR-4.3.1:** A footer bar SHALL be rendered at the bottom of the TeacherQuizPage, spanning the full width.

**FR-4.3.2:** The footer SHALL contain the following buttons on the RIGHT side (left-to-right order):
1. "Previous Question" button with left arrow icon
2. "Pause/Resume" button with pause/play icon
3. "Next Question" button with right arrow/forward icon

**FR-4.3.3:** The footer SHALL contain the following buttons on the LEFT side (left-to-right order):
1. "Player (X)" button showing active participant count
2. "Ban" button with ban/block icon
3. "Back" button with left arrow/home icon

**FR-4.3.4:** The "Previous Question" button SHALL be enabled at all times during the quiz (any question, any phase).

**FR-4.3.5:** Clicking "Previous Question" SHALL:
- Navigate to the previous question in the quiz
- Allow re-timing (restart the timer for that question)
- Allow students to re-submit answers
- Preserve original answers unless overwritten

**FR-4.3.6:** The "Pause/Resume" button SHALL pause/resume the current question timer and sync state to all students.

**FR-4.3.7:** The "Next Question" button SHALL advance to the next question or skip the current question to the feedback screen.

---

### FR-4.4: Player Management (P0)

**FR-4.4.1:** Clicking the "Player (X)" button SHALL open a slide-in panel from the left or right edge of the screen.

**FR-4.4.2:** The player panel SHALL display:
- List of all active players with names and current scores
- "Kick" button next to each player
- Close button (X) to dismiss the panel

**FR-4.4.3:** Clicking "Kick" next to a player SHALL:
- Mark the player as "banned" in the Firebase session
- Store the player's IP address in a ban list
- Prevent that IP from joining this session again
- Preserve the player's submitted answers (marked as "banned" for grading)
- Redirect the player to WaitingRoom with no message

**FR-4.4.4:** The player count (X) SHALL update in real-time as students join/leave/get kicked.

**FR-4.4.5:** Clicking outside the panel or the close button SHALL dismiss the panel.

---

### FR-4.5: Ban List Management (P0)

**FR-4.5.1:** Clicking the "Ban" button SHALL open a slide-in panel showing banned players.

**FR-4.5.2:** The ban list panel SHALL display:
- Player name
- IP address
- "Remove" button to unban

**FR-4.5.3:** Clicking "Remove" SHALL:
- Remove the IP from the ban list
- Allow that player to rejoin the session
- Keep the player's historical data intact

**FR-4.5.4:** If no players are banned, the panel SHALL display "No banned players."

---

### FR-4.6: Quiz Termination (P0)

**FR-4.6.1:** Clicking the "Back" button SHALL immediately terminate the quiz session.

**FR-4.6.2:** The teacher SHALL be redirected to TeacherLobbyPage.

**FR-4.6.3:** All active students SHALL be redirected to WaitingRoom (silently, no message).

**FR-4.6.4:** The Firebase session node SHALL be deleted immediately (no archiving).

**FR-4.6.5:** No data loss prevention - session is terminated and data is deleted. (Session archiving deferred to future phase if needed.)

---

### FR-4.7: Admin Login Persistence (P1)

**FR-4.7.1:** After successful admin login, the authentication state SHALL be stored persistently (localStorage + Firebase Auth if applicable).

**FR-4.7.2:** Reloading the page SHALL NOT log the teacher out.

**FR-4.7.3:** The teacher SHALL remain logged in until:
- Explicit logout via "Logout" button
- Browser local storage is cleared
- Firebase Auth token expires (if using Firebase Auth)

**FR-4.7.4:** A "Logout" button SHALL be available on:
- TeacherLobbyPage
- TeacherQuizPage (possibly in a settings menu or top-right corner)

**FR-4.7.5:** Clicking "Logout" SHALL clear authentication state and redirect to the admin login page.

---

### FR-4.8: Remove Real-Time Answer Aggregation (P0)

**FR-4.8.1:** During the question phase (timer active), the TeacherQuizPage SHALL NOT display:
- Student answer counts per option
- Percentage breakdowns
- Live updates of who answered
- "X students answered" indicators

**FR-4.8.2:** The AnswerAggregationDisplay component (or equivalent) SHALL NOT render during the question phase.

**FR-4.8.3:** Answer aggregation and detailed student results SHALL be displayed ONLY on the Teacher Feedback Screen, showing:
- Correct answer text
- List of students who answered correctly
- List of students who answered incorrectly

**FR-4.8.4:** The Rocket Race chart SHALL NOT update in real-time during questions; updates SHALL occur only when the feedback screen loads.

---

### FR-4.9: Bug Fix - Last Question Results Screen (P1)

**FR-4.9.1:** When the final question's timer expires, the system SHALL display the Teacher Feedback Screen (matching behavior of all other questions).

**FR-4.9.2:** After the 5-second feedback screen (or early advance), the system SHALL navigate to TeacherResultsPage.

**FR-4.9.3:** The "Return to Waiting Room" button SHALL be removed from TeacherResultsPage (teacher view only).

**FR-4.9.4:** The navigation flow SHALL match all other questions: Question → Feedback → Results (if last question).

---

## 5. Non-Goals (Out of Scope)

1. **Student Interface Changes:** This PRD does NOT modify student-facing pages (StudentQuizPage, StudentFeedbackPage, StudentResultsPage remain unchanged).

2. **Quiz Builder UI:** No changes to quiz creation/editing workflows (deferred to Phase 3).

3. **Analytics Dashboard:** No new analytics or reporting features beyond existing score display.

4. **Mobile Optimization:** Focus on desktop teacher experience; mobile responsiveness is deferred.

5. **Accessibility Enhancements:** WCAG compliance improvements are deferred to Phase 3 (Epic 4).

6. **Multi-Teacher Sessions:** No support for multiple teachers controlling the same session.

7. **Permanent IP Banning:** IP bans are session-scoped only, not global or teacher-level.

8. **Session Recording/Playback:** No video recording or replay functionality.

9. **Custom Feedback Duration:** The 5-second feedback timer is fixed (not configurable in this release).

10. **Answer Aggregation Removal from Student View:** Students still see their own results; only teacher view is affected.

---

## 6. Design Considerations

### 6.1 Layout Structure

**Before (Current):**
```
┌─────────────────────────────────────────┐
│  Passage/Material  │  Question & Answers │
│   (Fixed Left)     │   (Fixed Right)     │
│                    │                     │
│  Player List       │  Controls           │
└─────────────────────────────────────────┘
```

**After (Enhanced):**
```
┌─────────────────────────────────────────┐
│ [☰] (if passage exists)                 │
│                                         │
│         QUESTION TEXT                   │
│         A. Option 1                     │
│         B. Option 2                     │
│         C. Option 3                     │
│         D. Option 4                     │
│                                         │
├─────────────────────────────────────────┤
│ Player(X)  Ban  Back  │ ◄ ⏸ ►  Next    │
└─────────────────────────────────────────┘
```

**With Passage Expanded:**
```
┌──────────────┬──────────────────────────┐
│ Passage/     │    QUESTION TEXT         │
│ Material     │    A. Option 1           │
│              │    B. Option 2           │
│  [Draggable] │    C. Option 3           │
│  divider     │    D. Option 4           │
│              │                          │
├──────────────┴──────────────────────────┤
│ Player(X)  Ban  Back  │ ◄ ⏸ ►  Next    │
└─────────────────────────────────────────┘
```

### 6.2 Teacher Feedback Screen Layout

```
┌─────────────────────────────────────────┐
│                                         │
│  ┌─────────────────────────────────┐   │
│  │    ROCKET RACE VISUALIZATION    │   │
│  │  🚀 Player 1 ████████ 80pts     │   │
│  │  🚀 Player 2 ██████ 60pts       │   │
│  │  🚀 Player 3 ████ 40pts         │   │
│  │                                 │   │
│  │  Correct Answer: B. Paris       │   │
│  │                                 │   │
│  │  ✓ Correct: Alice, Bob          │   │
│  │  ✗ Incorrect: Carol             │   │
│  │                                 │   │
│  │  ⏱ Auto-advancing in 3s...      │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│ Player(X)  Ban  Back  │ ◄ ⏸ ►  Next    │
└─────────────────────────────────────────┘
```

### 6.3 Slide-In Panel Design

**Player Panel (Right Side):**
```
                       ┌───────────────────┐
                       │ ACTIVE PLAYERS  X │
                       ├───────────────────┤
                       │ Alice - 80 pts    │
                       │          [Kick]   │
                       ├───────────────────┤
                       │ Bob - 60 pts      │
                       │          [Kick]   │
                       ├───────────────────┤
                       │ Carol - 40 pts    │
                       │          [Kick]   │
                       └───────────────────┘
```

**Ban Panel (Right Side):**
```
                       ┌───────────────────┐
                       │ BANNED PLAYERS  X │
                       ├───────────────────┤
                       │ David             │
                       │ IP: 192.168.1.5   │
                       │        [Remove]   │
                       ├───────────────────┤
                       │ Eve               │
                       │ IP: 192.168.1.9   │
                       │        [Remove]   │
                       └───────────────────┘
```

### 6.4 Component Hierarchy

**New Components to Create:**
- `TeacherFeedbackPage.jsx` - New page for teacher feedback screen
- `CollapsiblePassagePanel.jsx` - Draggable passage/material panel
- `TeacherFooterBar.jsx` - Navigation and control footer
- `PlayerManagementPanel.jsx` - Slide-in player list with kick functionality
- `BanListPanel.jsx` - Slide-in ban list management

**Components to Modify:**
- `TeacherQuizPage.jsx` - Restructure layout, integrate footer, remove answer aggregation
- `TeacherResultsPage.jsx` - Remove "Return to Waiting Room" button
- `TeacherLobbyPage.jsx` - Add logout button, persist admin auth
- `AdminLoginPage.jsx` (or equivalent) - Implement persistent login

### 6.5 Color & Styling Guidance

- **Hamburger Icon:** Mantine's `ActionIcon` with `IconMenu2` from `@tabler/icons-react`
- **Footer Bar:** Fixed position, `height: 60px`, `bg: gray.1`, border-top
- **Slide-In Panels:** Mantine `Drawer` component, `position: right`, `size: 300px`
- **Correct Answer Highlight:** Same green highlight used in student feedback
- **Draggable Divider:** Visual indicator (e.g., `width: 4px`, `bg: gray.4`, cursor: `col-resize`)

---

## 7. Technical Considerations

### 7.1 Firebase Schema Changes

**Add to Session Node:**
```json
{
  "sessions": {
    "sessionId123": {
      "bannedPlayers": {
        "playerId1": {
          "name": "David",
          "ip": "192.168.1.5",
          "bannedAt": 1234567890
        }
      },
      "currentPhase": "question" | "feedback" | "results",
      "isTerminated": false,
      "questionHistory": [
        {
          "questionIndex": 0,
          "completed": true,
          "answersLocked": true
        }
      ]
    }
  }
}
```

### 7.2 IP Address Capture

**Method:** Use Firebase Realtime Database's `onDisconnect()` metadata or a lightweight Node.js Cloud Function to capture client IP.

**Privacy:** Store IP temporarily (session-scoped only), delete after session ends.

**Fallback:** If IP capture fails, use player ID only for ban tracking.

### 7.3 Admin Authentication Persistence

**Option 1 (Current - Simple PIN):**
- Store admin PIN validation in `localStorage` with a flag: `isAdminAuthenticated: true`
- Clear flag on logout

**Option 2 (Future - Firebase Auth):**
- Migrate to Firebase Authentication for admin accounts
- Use `onAuthStateChanged()` to persist login across reloads
- Store admin UID in session to verify teacher identity

**Recommendation:** Start with Option 1 (localStorage flag) for quick implementation; migrate to Option 2 in Phase 3.

### 7.4 Previous Question Navigation Logic

**Challenge:** Allowing re-timing and re-answering requires:
1. Storing original answers in Firebase with timestamps
2. Resetting `currentQuestionIndex` in session
3. Broadcasting "question reset" event to all students
4. Handling edge cases (e.g., student disconnected between original and re-attempt)

**Recommendation:**
- Store answer history with timestamps: `answers: { playerId: [{ attempt: 1, answer: "A", timestamp: 123 }, { attempt: 2, answer: "B", timestamp: 456 }] }`
- Use the LATEST attempt for scoring
- Display "Re-attempting Question X" message to students (optional)

### 7.5 Draggable Panel Implementation

**Library Recommendation:** Use `react-resizable-panels` or `react-split-pane` for draggable divider.

**Alternative:** Custom implementation with `onMouseDown` + `onMouseMove` event handlers.

**State Management:** Store panel width in component state (does NOT persist across questions per FR-4.1.5).

### 7.6 Performance Considerations

**Concern:** Removing real-time answer aggregation reduces Firebase reads.

**Impact:** Fewer `onValue` listeners during questions → lower Firebase costs.

**Score Update Strategy:** Batch score updates when feedback screen loads using `get()` instead of continuous `onValue()`.

---

## 8. Success Metrics

### 8.1 Functional Completeness
- [ ] All 10 user stories implemented and tested
- [ ] Zero regression bugs in existing functionality
- [ ] 100% unit test pass rate maintained
- [ ] End-to-end test covering full quiz flow (question → feedback → next question → results)

### 8.2 User Experience
- [ ] Teachers report improved clarity (survey: 90%+ satisfaction)
- [ ] Average time to access passage/material < 1 second
- [ ] Zero UI layout bugs across screen sizes (1920x1080, 1366x768)
- [ ] Footer controls accessible within 1 click at all times

### 8.3 Performance
- [ ] Firebase reads during questions reduced by 40%+ (due to removed real-time aggregation)
- [ ] Feedback screen loads in < 500ms
- [ ] Draggable panel resize is smooth (60 FPS)
- [ ] No memory leaks from unclosed listeners

### 8.4 Bug Resolution
- [ ] Last question results screen bug confirmed fixed
- [ ] No admin logout on page reload (tested with 10+ refreshes)
- [ ] Banned players cannot rejoin (tested with IP spoofing attempts)

---

## 9. Open Questions

### Q1: Session Archiving ✅ RESOLVED
**Question:** Should terminated sessions be archived for later review, or deleted immediately?

**Decision:** Delete immediately.

**Impact:** No additional Firebase storage structure needed. Session data is deleted when "Back" button is clicked.

**Implementation:** FR-4.6.4 will delete the Firebase session node immediately upon termination.

---

### Q2: "Previous Question" Re-Timing Behavior ✅ RESOLVED
**Question:** When navigating to a previous question, should the timer restart from full time, or resume from remaining time?

**Decision:** Restart from full time (allow full re-attempt).

**Implementation:** When "Previous Question" is clicked, the timer resets to the question's original `timer` value and restarts from 0. All students are forced to navigate back to the previous question and can re-submit answers.

---

### Q3: Feedback Screen Answer Aggregation Detail Level ✅ RESOLVED
**Question:** On the feedback screen, should answer aggregation show:
- A) Just correct answer highlight
- B) Correct answer + percentage who got it right
- C) Correct answer + list of which students answered correctly/incorrectly

**Decision:** Option C - Correct answer + list of which students answered correctly/incorrectly

**Implementation:** The Teacher Feedback Screen will display:
- Correct answer text (e.g., "Correct Answer: B. Paris")
- List of students who answered correctly (with names)
- List of students who answered incorrectly (with names)
- This is integrated into the Rocket Race visualization area

---

### Q4: Passage Panel Default Width ✅ RESOLVED
**Question:** When the passage panel is first expanded, what should the default width ratio be?
- A) 50/50 split
- B) 40/60 split (passage smaller)
- C) 30/70 split (maximize question space)

**Decision:** Option A - 50/50 split

**Implementation:** When the hamburger menu is clicked and the passage panel opens, it will default to 50% width (left) and 50% width (right) for the question/answers. The teacher can then adjust this ratio using the draggable divider.

---

### Q5: Mobile Teacher View ✅ RESOLVED
**Question:** Should this enhancement support tablet/mobile teacher view, or is desktop-only acceptable?

**Decision:** Desktop-only

**Scope:** This PRD focuses exclusively on desktop teacher experience (minimum screen size: 1366x768). Mobile/tablet responsiveness is deferred to Phase 3 or future enhancements.

**Impact:** No mobile-specific CSS or responsive design work required for this release.

---

### Q6: Concurrent "Previous Question" Navigation ✅ RESOLVED
**Question:** If a teacher navigates to a previous question while students are still on the current question, what happens?
- A) All students are forced back to the previous question
- B) Students finish current question, then see "Teacher went back" message
- C) Not allowed - disable "Previous Question" if students are active

**Decision:** Option A - All students are forced back to the previous question

**Implementation:** When the teacher clicks "Previous Question", the `currentQuestionIndex` in Firebase is decremented. All student clients listening to this field will immediately navigate back to the previous question, interrupting their current question. The timer will restart from full time for all students.

---

### Q7: Ban List IP Display Privacy ✅ RESOLVED
**Question:** Should IP addresses be visible in plain text, or partially masked (e.g., `192.168.*.***`)?

**Decision:** Plain text (full IP address visible)

**Implementation:** The ban list panel will display IP addresses in full plain text format (e.g., `192.168.1.5`).

**Privacy Note:** Teachers should be informed that IP addresses are session-scoped only and deleted when the session terminates. Ensure compliance with local data privacy laws (GDPR, COPPA if applicable). Consider adding a privacy notice in the ban panel UI.

---

## 10. Dependencies

### 10.1 External Libraries
- `react-resizable-panels` or `react-split-pane` for draggable divider (if using library)
- Mantine `Drawer` component (already in use)
- `@tabler/icons-react` for iconography (already in use)

### 10.2 Firebase Features
- Firebase Realtime Database (existing)
- (Optional) Firebase Cloud Functions for IP capture
- (Future) Firebase Authentication for admin persistence upgrade

### 10.3 Existing Components
- `RocketRaceChart.jsx` - Must integrate into TeacherFeedbackPage
- `QuestionRenderer.jsx` - Must work with CollapsiblePassagePanel
- `TimerDisplay.jsx` - Must continue functioning in new layout

---

## 11. Implementation Phases (Recommended)

### Phase 1: Layout & Material Panel (Week 1-2)
- FR-4.1: Implement collapsible passage panel with draggable divider
- Restructure TeacherQuizPage layout

### Phase 2: Footer Bar & Navigation (Week 2-3)
- FR-4.3: Build TeacherFooterBar component
- FR-4.6: Implement "Back" button and session termination
- FR-4.3.5: Implement "Previous Question" navigation logic

### Phase 3: Feedback Screen (Week 3-4)
- FR-4.2: Create TeacherFeedbackPage component
- Integrate Rocket Race into feedback screen
- Remove answer aggregation from question phase (FR-4.8)

### Phase 4: Player Management (Week 4-5)
- FR-4.4: Build PlayerManagementPanel with kick functionality
- FR-4.5: Build BanListPanel with IP tracking
- Implement IP-based session blocking

### Phase 5: Admin Persistence & Bug Fixes (Week 5-6)
- FR-4.7: Implement persistent admin login
- FR-4.9: Fix last question results screen bug
- End-to-end testing and bug fixes

---

## 12. Acceptance Testing Checklist

- [ ] **Test 1:** Load question with passage → hamburger icon appears → click to expand → panel opens → drag divider → width adjusts → go to next question → panel collapses
- [ ] **Test 2:** Load question without passage → no hamburger icon appears
- [ ] **Test 3:** During question countdown → correct answer is NOT shown → timer expires → feedback screen appears → correct answer IS highlighted
- [ ] **Test 4:** During question → click "Next Question" → feedback screen appears immediately
- [ ] **Test 5:** On feedback screen → Rocket Race shows updated scores → correct answer text is visible → auto-advance after 5 seconds
- [ ] **Test 6:** Click "Previous Question" → navigate to previous question → timer restarts → students can re-answer
- [ ] **Test 7:** Click "Player (X)" → slide-in panel opens → player list shown → click "Kick" → player is banned → panel updates
- [ ] **Test 8:** Click "Ban" → banned player list shown with IP → click "Remove" → player unbanned
- [ ] **Test 9:** Banned IP tries to rejoin → connection rejected or redirected
- [ ] **Test 10:** Click "Back" → session terminates → teacher goes to lobby → students go to waiting room
- [ ] **Test 11:** Admin login → reload page → still logged in → click "Logout" → redirected to login
- [ ] **Test 12:** Last question timer expires → feedback screen appears → auto-advance to results screen → "Return to Waiting Room" button absent

---

**Document Version:** 1.1
**Last Updated:** 2025-10-19
**Status:** All Open Questions Resolved - Ready for Implementation
**Owner:** Development Team
**Next Steps:**
1. ✅ Review and approve this PRD (User approved with clarifications)
2. Create detailed technical design document
3. Break down into subtasks (similar to `phase-2-task-list.md`)
4. Begin implementation Phase 1

---

**End of PRD**
