# Application Flow

This document describes the user flow for both students and teachers.

## 1. Entry Point

The application starts at the root URL (`/`). The `App.jsx` component renders the `LoginPage` by default.

## 2. Login

### 2.1. Student Login

-   The user enters their name in the input field on the `LoginPage`.
-   Upon clicking "Join", the application checks for duplicate names in the active game session.
-   If the name is unique, a new player is created in the Firebase Realtime Database under `game_sessions/active_session/players`.
-   The student is then navigated to the `StudentWaitingRoomPage` at `/student-wait/active_session`.

### 2.2. Teacher Login

-   The user clicks the "Admin Login" button on the `LoginPage`, which opens the `AdminLoginModal`.
-   The user enters the admin username and password (stored in environment variables).
-   Upon successful login, the `isAdmin` flag is set to `true` in `sessionStorage`, and the teacher is redirected to the `TeacherLobbyPage` at `/lobby`.

## 3. Teacher Flow

### 3.1. Lobby

-   **Page:** `TeacherLobbyPage.jsx` (`/lobby`)
-   **Functionality:**
    -   View a list of all available quizzes.
    -   Search for quizzes by title.
    -   Upload new quizzes in JSON format using the `UploadQuizModal`.
    -   Delete existing quizzes.
    -   Edit the timers for each question in a quiz using the `EditTimersModal`.
    -   Start a quiz by clicking the "Start" button.
-   **Action:** When a quiz is started, the `active_session` in Firebase is updated with the quiz ID, and the teacher is navigated to the `TeacherWaitingRoomPage`.

### 3.2. Waiting Room

-   **Page:** `TeacherWaitingRoomPage.jsx` (`/teacher-wait/:gameSessionId`)
-   **Functionality:**
    -   View the list of players who have joined the game.
    -   Start the quiz by clicking the "Start Quiz" button.
-   **Action:** When the quiz is started, the game session `status` is set to `in-progress`, and the teacher is navigated to the `TeacherQuizPage`.

### 3.3. Quiz

-   **Page:** `TeacherQuizPage.jsx` (`/teacher-quiz/:gameSessionId`)
-   **Functionality:**
    -   Displays the current question.
    -   If the question has a passage, it can be viewed in a collapsible panel.
    -   All quiz controls are available in the `TeacherFooterBar`:
        -   Pause/resume the timer.
        -   Navigate to the next or previous question.
        -   Jump to any question using the dropdown menus on the navigation buttons.
        -   View and manage players (kick, ban) in a resizable popover.
        -   End the quiz and return to the lobby.
-   **Action:** When the timer runs out, the `gameSession` status is updated to `feedback`. A `useEffect` hook listening for this change navigates the teacher to the `TeacherFeedbackPage`.

### 3.4. Feedback

-   **Page:** `TeacherFeedbackPage.jsx` (`/teacher-feedback/:gameSessionId`)
-   **Functionality:**
    -   Displays the results for the previous question.
    -   Shows a "Rocket Race" leaderboard with updated scores.
    -   Displays the correct answer.
    -   Lists the students who answered correctly and incorrectly.
    -   Has a 5-second auto-advance countdown to the next question, which can be paused.
-   **Action:** After the countdown, the application automatically navigates to the `TeacherQuizPage` for the next question. If it was the last question, it navigates to the `TeacherResultsPage`.

### 3.5. Results

-   **Page:** `TeacherResultsPage.jsx` (`/teacher-results/:gameSessionId`)
-   **Functionality:**
    -   Displays the final leaderboard with the top players.
    -   Shows confetti for celebration.
    -   Provides a button to return to the lobby.

## 4. Student Flow

### 4.1. Waiting Room

-   **Page:** `StudentWaitingRoomPage.jsx` (`/student-wait/:gameSessionId`)
-   **Functionality:**
    -   Displays the quiz title and the list of joined players.
    -   Waits for the teacher to start the quiz.
-   **Action:** When the teacher starts the quiz, the student is automatically navigated to the `StudentQuizPage`.

### 4.2. Quiz

-   **Page:** `StudentQuizPage.jsx` (`/student-quiz/:gameSessionId`)
-   **Functionality:**
    -   Displays the answer inputs for the current question (e.g., multiple-choice buttons, text input).
    -   Shows the timer for the question.
-   **Action:** When the student submits their answer, their score is calculated and updated in Firebase. The student's view then waits for the `gameSession` status to change to `feedback`, at which point a `useEffect` hook navigates them to the `StudentFeedbackPage`.

### 4.3. Feedback

-   **Page:** `StudentFeedbackPage.jsx` (`/student-feedback/:gameSessionId`)
-   **Functionality:**
    -   Shows whether their answer was correct or incorrect.
    -   Displays the correct answer.
    -   Shows the points they earned for the question and their new total score.
    -   Has a 5-second auto-advance countdown.
-   **Action:** After the countdown, the student is navigated to the `StudentQuizPage` for the next question. If it was the last question, they are navigated to the `StudentResultsPage`.

### 4.4. Results

-   **Page:** `StudentResultsPage.jsx` (`/student-results/:gameSessionId`)
-   **Functionality:**
    -   Displays their final rank and score.
    -   Shows the top 5 players.
    -   Provides a button to return to the waiting room for the next quiz.

## 5. Session Termination

The teacher has the ability to end a game session at any point from the `TeacherQuizPage`, `TeacherFeedbackPage`, or `TeacherResultsPage`.

-   **Action:** The teacher clicks the "End Session" button (or "Return to Lobby" on the results page).
-   **Effect (Teacher):** The teacher is navigated back to the `TeacherLobbyPage` (`/lobby`).
-   **Effect (Student):** The entire `game_sessions/active_session` object is deleted from Firebase. All student pages (`StudentWaitingRoomPage`, `StudentQuizPage`, `StudentFeedbackPage`, `StudentResultsPage`) are listening for this change. When the session becomes `null`, students are automatically redirected to the main login page (`/`).
