# PRD: Interactive Learning Environment (Kahoot-Style)

## 1. Introduction/Overview

This document outlines the requirements for a real-time, interactive learning application designed for students and teachers. The platform allows teachers (admins) to host quizzes, manage content, and control the flow of the game, while students join from their devices (e.g., phones) using a simplified interface. The goal is to create an engaging, competitive, and fun learning environment modeled after popular quiz platforms, with a specific focus on accommodating complex question formats found in standardized tests like the IELTS.

## 2. Goals

*   **Develop an MVP:** Create a stable, functional Minimum Viable Product for a real-time quiz application.
*   **Engage Students:** Foster a fun and competitive learning environment through interactive elements like real-time feedback and leaderboards.
*   **Empower Teachers:** Provide teachers with robust tools to manage quizzes, control the game session, and view student progress in real-time.
*   **Support Complex Content:** Build a flexible system capable of handling all IELTS Reading and Listening question formats.

## 3. User Stories

### Student User Story

*   **As a student,** I want to join a game easily by just entering my name so I can get into the quiz quickly.
*   **As a student,** I want to see who else has joined while I wait so I know the session is active.
*   **As a student,** I want a very simple interface on my phone (e.g., just A,B,C,D buttons) so I can focus on the main screen projected by the teacher for the full question text.
*   **As a student,** I want to get immediate feedback on my answer (correct/incorrect, my score) so I know how I performed.
*   **As a student,** I want to see my final score and rank at the end of the quiz to understand my overall performance.

### Teacher (Admin) User Story

*   **As a teacher,** I want to log in securely to an admin panel to manage my quizzes.
*   **As a teacher,** I want to add new quizzes by uploading a structured JSON file to easily import complex content.
*   **As a teacher,** I want to manage my quiz library by searching, editing timers, and deleting quizzes.
*   **As a teacher,** I want to control the quiz session by deciding when to start, when to move to the next question, and pausing the timer if needed.
*   **As a teacher,** I want to see live, aggregated results for each question to gauge class understanding.
*   **As a teacher,** I want the ability to remove a disruptive player from the game and prevent them from rejoining.
*   **As a teacher,** I want a celebratory, visually impressive results screen to share with the class at the end.

## 4. Functional Requirements

### FR-1: User Roles & Authentication
1.  The system shall support two roles: **Student** and **Teacher (Admin)**.
2.  **Students** join by providing a name. The system must not allow duplicate names in the same waiting room.
3.  **Teachers** log in using credentials specified in environment variables (e.g., `ADMIN_USER`, `ADMIN_PASS`).

### FR-2: Screens & Views
1.  **Login Screen:**
    *   A field for student name entry and a "Join" button.
    *   An "Admin" button that opens a dialog for teacher ID and password.
2.  **Waiting Room:**
    *   Visible to both students and teachers after joining/selecting a quiz.
    *   Displays a list of joined players (using randomly assigned avatars and truncated names).
    *   Displays the title of the selected quiz.
    *   For teachers, a "Start Quiz for Everyone" button must be visible.
3.  **Teacher Lobby:**
    *   Teacher-only screen.
    *   Displays a list of available quizzes.
    *   Provides "Add", "Edit Timer", and "Delete" functionality for quizzes.
    *   Includes a search box to filter quizzes by name, tags, or level.
    *   An "Add" button opens a dialog to upload a quiz JSON file.
4.  **Quiz Screen (Teacher View):**
    *   A two-column layout with resizable column borders (passage/material on the right, questions on the left). This layout must stack vertically on smaller screens.
    *   Displays the full question, passage/map/diagram, and full-text answer choices.
    *   Displays a live aggregation of student answers (e.g., count per MCQ choice, list of submitted completion answers).
    *   Displays the "Rocket Race" marathon chart, showing player rockets advancing or stalling.
    *   Includes a Teacher Control Panel with "Pause", "Next Question", and "Kick Player" buttons.
    *   Includes an IP Ban management panel (list of banned IPs with "Unban" buttons).
5.  **Quiz Screen (Student View):**
    *   A minimal interface showing only the necessary controls to submit an answer (e.g., large A, B, C, D buttons; dropdowns for matching; text fields for completion).
6.  **Feedback Screen (Student View):**
    *   Displayed for 5 seconds after a question ends (or until the teacher proceeds).
    *   Shows if the answer was "Correct" or "Incorrect".
    *   Shows the correct answer.
    *   Shows the student's new total score.
7.  **Results Screen (Teacher View):**
    *   A visually "phenomenal" and celebratory screen.
    *   Displays a final ranked list of all students and their scores.
    *   May include animations, confetti, and a clear winner announcement.
    *   Buttons to "Return to Waiting Room" or "Return to Teacher Lobby".
8.  **Results Screen (Student View):**
    *   Displays the student's final score.
    *   Displays their final rank (e.g., "3rd out of 10").
    *   Displays a "ladder" of the top 5 players.
    *   A button to "Return to the waiting room".

### FR-3: Quiz & Question Logic
1.  **Quiz Creation:** Teachers can add quizzes by uploading a valid JSON file. The system must validate the file and provide specific error messages if it's invalid.
2.  **Quiz Editing:** Teachers can edit the timers for a quiz via a modal dialog. This dialog will feature a list of questions, an input for each timer, and a global "Apply to All" field. Changes are saved to `localStorage` and committed with a "Save" button.
3.  **Question Types:** The system must support all IELTS Reading & Listening formats, including:
    *   Multiple Choice (Single Answer)
    *   Multiple Select (Multiple Answers)
    *   Completion (from word bank or typed)
    *   Matching (using dropdowns per item; supports reusable answers)
    *   Diagram/Map Labeling (students see related sentences and answer via MCQ/completion; diagram is on teacher screen only).
4.  **Timer:** Can be set per-question or for the whole quiz. The timer continues from where it left off after being paused.
5.  **Answer Matching:** Typed answers will be matched case-insensitively and will ignore leading/trailing whitespace.

### FR-4: In-Game Management
1.  **Kick/Ban Player:** Teachers can kick a player via a confirmation dialog. The player is removed from the quiz, and their IP is added to a ban list for the session.
2.  **Connectivity:** Students who disconnect can rejoin a quiz in progress with the same name.

## 5. Non-Goals (Out of Scope)

*   Student accounts with passwords or profiles.
*   Detailed historical analytics and reporting for teachers.
*   An in-app editor for creating or modifying quiz *content* (all content comes from JSON files).
*   Support for question types beyond those specified for IELTS.

## 6. Design Considerations

*   **Tech Stack:** React (Frontend), Firebase Realtime Database (Backend), Bootstrap (Styling).
*   **UI/UX:**
    *   The student interface must be minimal, clean, and mobile-first.
    *   The teacher interface should be comprehensive, optimized for projection and control.
    *   The "Rocket Race" chart should be a dynamic, engaging animation with a space theme.
    *   The final results screen for the teacher must be highly polished and celebratory.
    *   The application should include simple sound effects for key events (e.g., clicks, correct/incorrect answers).
*   **Responsiveness:** All views must be responsive. The teacher's two-column layout should be resizable on desktop and stack vertically on smaller screens.

## 7. Technical Considerations

*   **Player Limit:** The initial player limit should be determined by the Firebase free tier limitations (e.g., 100 simultaneous connections for the Spark plan).
*   **JSON Structure:** The JSON format for quizzes must be robust and well-defined to handle all specified question types, resources (passages/images), answer keys, and metadata like timers and reusable answer flags.
    *   Question types will be defined by a string key (e.g., `"type": "matching"`).
    *   Word banks will be an array of objects (e.g., `[{"word": "example"}]`).
    *   Matching answers will be defined by mapping question numbers/IDs to answer IDs.
*   **Admin Credentials:** Must be loaded from environment variables, not hardcoded.

## 8. Success Metrics

*   Successful completion of a full quiz session by a group of 5+ test users.
*   Teacher is able to successfully add, manage, and launch a quiz.
*   All specified IELTS question types are functional and render correctly on both student and teacher views.

## 9. Open Questions

*   None at this time. The requirements are considered detailed enough for an initial development phase.

