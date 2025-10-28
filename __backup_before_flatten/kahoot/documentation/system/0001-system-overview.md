# System Overview

This document provides an overview of the project's architecture, tech stack, and core functionalities.

## 1. Project Structure

The project is a standard Vite-powered React application with the following directory structure:

```
/src
|-- /assets
|-- /components
|-- /hooks
|-- /pages
|-- /services
|-- /test
|-- /utils
|-- App.jsx
|-- main.jsx
```

*   **`/components`**: Contains reusable React components used across multiple pages.
*   **`/pages`**: Contains the top-level components for each page of the application.
*   **`/services`**: Contains the Firebase configuration and initialization.
*   **`/test`**: Contains the test setup file (`setup.js`).
*   **`/utils`**: Contains utility functions, such as the JSON validation logic.

## 2. Tech Stack

*   **Frontend:** React, Vite
*   **UI Framework:** Mantine UI
*   **Backend:** Firebase Realtime Database
*   **Testing:** Vitest (unit tests), Playwright (end-to-end tests)

## 3. Core Functionalities

*   **Authentication:** Students can join a game by providing a name. Teachers can log in using a username and password stored in environment variables.
*   **Lobby:** Teachers have a lobby where they can manage quizzes (upload, delete, edit timers).
*   **Quiz Upload:** Teachers can upload quizzes in a structured JSON format.
*   **Real-time State Management:** The application uses Firebase Realtime Database to synchronize the game state between the teacher and the students.

## 4. Database Schema

The Firebase Realtime Database has two main top-level objects:

*   **`/quizzes`**: Stores the list of all available quizzes.
*   **`/game_sessions`**: Stores the state of the active game session. This includes the list of players, their scores, and the current question.

## 5. Teacher Interface Enhancements

Significant enhancements have been made to the teacher's quiz interface to improve usability and add new features.

### 5.1. Collapsible Passage Panel

*   **Component:** `CollapsiblePassagePanel.jsx`
*   **Description:** When a question has an associated passage, a hamburger menu icon appears, allowing the teacher to open a resizable panel to view the passage. This maximizes screen space for the question and answers.

### 5.2. Centralized Footer Bar

*   **Component:** `TeacherFooterBar.jsx`
*   **Description:** All quiz controls for the teacher have been centralized in a fixed footer bar. This includes navigation controls, player management, and the quiz timer.

### 5.3. Question Jump Dropdowns

*   **Description:** The "Next" and "Previous" buttons in the footer bar now have dropdown menus that allow the teacher to jump to any question in the quiz. This provides a quick way to navigate through the quiz.

### 5.4. Resizable Player and Ban Lists

*   **Components:** `ResizableBox.jsx`, `CustomResizableBox.jsx`
*   **Description:** The "Players" and "Ban" buttons in the footer now open a resizable popover box instead of a sidebar. This allows the teacher to view and manage players without leaving the context of the quiz.

### 5.5. Timer in Footer

*   **Description:** The question countdown timer has been moved from the main content area to the center of the footer bar for better visibility and a cleaner layout.

## 6. Application Pages and User Flow

The application has a clear and distinct user flow for students and teachers. The flow is managed through a combination of React Router and real-time updates from Firebase.

For a detailed description of each page and the navigation flow, please see the [Application Flow](./0003-application-flow.md) document.

## 7. Component Library

This section provides an overview of the most important reusable components in the application.

### 7.1. Core Components

*   **`QuestionRenderer.jsx`**: This component is a router that renders the appropriate view for the current question type. It takes a `question` object as a prop and uses a `switch` statement to select the correct view from the `src/components/questions/` directory.

*   **`AnswerInputRenderer.jsx`**: This component renders the appropriate input controls for the student based on the question type. For example, it will show a grid of buttons for a multiple-choice question, and a text input for a completion question. It is used on the `StudentQuizPage`.

*   **`AnswerAggregationDisplay.jsx`**: This component is used on the `TeacherFeedbackPage` to display a summary of the students' answers for the current question. It shows how many students chose each option, and it uses different visualizations for different question types.

### 7.2. UI Components

*   **`SoundButton.jsx`**: A wrapper around the Mantine `Button` component that plays a click sound when pressed. It uses the `SoundService` to play the sound.

*   **`Avatar.jsx` / `CustomAvatar.jsx`**: These components display a user's avatar. It shows the first initial of the user's name on a colored background. The color is determined by the user's name.

*   **`RocketRaceChart.jsx`**: A component that visualizes the players' scores in a "rocket race" format. It is used on the `TeacherFeedbackPage` to show the leaderboard.

*   **`WordBank.jsx`**: This component displays a word bank for completion questions. Students can click on the words to select them as their answer.

### 7.3. Teacher-Specific Components

*   **`AdminLoginModal.jsx`**: A modal dialog that allows the teacher to log in. It takes a username and password and verifies them against the values stored in the environment variables.

*   **`UploadQuizModal.jsx`**: A modal dialog that allows the teacher to upload a new quiz in JSON format. It includes validation to ensure the JSON is in the correct format.

*   **`TeacherControlPanel.jsx`**: This component was part of the original teacher interface and provided controls for pausing the quiz and moving to the next question. It is now largely obsolete and has been replaced by the `TeacherFooterBar`.

### 7.4. Question Type Views

These components are located in `src/components/questions/` and are responsible for rendering the teacher's view of each question type.

*   **`MultipleChoiceView.jsx`**: Displays a multiple-choice question with the options listed. The correct answer is highlighted.

*   **`MultipleSelectView.jsx`**: Displays a multiple-select question with checkboxes for each option. The correct answers are checked.

*   **`CompletionView.jsx`**: Displays a fill-in-the-blank question. It can either show a word bank for the student to choose from, or a text input for them to type the answer.

*   **`MatchingView.jsx`**: Displays a matching question with two columns of items to be matched. It also shows the correct answer mapping.

*   **`DiagramLabelingView.jsx`**: Displays a diagram with labels to be filled in. It shows the diagram image and the sentences for each label, along with the correct answer.

## 8. Services

This section describes the services used in the application.

*   **`firebase.js`**: Initializes the Firebase application and exports the database instance.

*   **`SoundService.js`**: A service for playing sound effects. It is currently disabled but can be re-enabled easily by uncommenting the audio playback code.

*   **`ipService.js`**: A service to get the user's public IP address using the `ipify` API. This is used for the IP-based banning feature.

## 9. Utilities

This section describes the utility functions used in the application.

*   **`answerAggregation.js`**: A set of functions to aggregate student answers for display on the teacher's screen. This is used on the `TeacherFeedbackPage` to show how many students chose each option.

*   **`answerNormalization.js`**: A set of functions to normalize student answers (e.g., remove whitespace, convert to lowercase) for consistent comparison. This is used in the `scoring.js` utility to prevent students from being penalized for minor formatting differences.

*   **`scoring.js`**: A function to calculate the score for a student's answer based on the question type. It supports partial credit for multiple-select and matching questions.

*   **`validation.js`**: A function to validate the structure of a quiz JSON file when it is uploaded by the teacher.

## 10. Client-Side Storage

The application uses `sessionStorage` to manage client-side state that needs to persist within a single browser tab session. This was a deliberate architectural decision to move away from `localStorage`.

*   **`sessionStorage`**: Used to store the `isAdmin` flag and the `playerId`. This ensures that a user's session is isolated to a single tab, which is crucial for testing multiple roles (e.g., an admin and multiple students) simultaneously in the same browser. The trade-off is that the login state is not preserved if the tab is closed.

## 11. State Management and Synchronization

The primary mechanism for synchronizing state between the teacher and students is a `status` field within the `game_sessions/active_session` object in the Firebase Realtime Database.

*   **`status` field**: This field dictates the current phase of the game.
    *   `waiting`: The initial state when a session is created.
    *   `in-progress`: The state when the quiz is active.
    *   `feedback`: The state when the timer for a question ends, triggering the display of the feedback/results page for that question.
*   **Application Flow**: Both teacher and student applications have `useEffect` hooks that listen for changes to the `gameSession` object. They use the `status` field to determine which page to render, ensuring their views are always in sync with the game state controlled by the teacher.

## Update to Core Functionalities

### IP Fetching and Banning Logic

*   **IP Address Fallback**: The student login process attempts to fetch the user's IP address for the banning feature. If this request is blocked by the client (e.g., due to tracking protection), the system now defaults the IP to the string `"unknown"` and allows the login to proceed.
*   **Safer Banning**: To prevent accidental blocking of multiple users, the banning logic has been updated. If a teacher attempts to ban a player whose IP address is `"unknown"`, the player is only kicked from the current session (removed from the `players` list). Their "unknown" IP is **not** added to the permanent `bannedPlayers` list.