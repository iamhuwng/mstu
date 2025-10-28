# PRD: QR Code Scanning System for Device-Free Student Participation

## 1. Introduction/Overview

### Problem Statement
In many educational settings, students do not have access to personal devices (smartphones, tablets, or computers) during class. This creates a barrier to using digital quiz platforms like our Kahoot-style application, which traditionally requires each student to have a device to submit answers.

### Solution
Implement a QR code-based answer collection system (similar to Plickers) that allows students to participate in quizzes using physical cards. The teacher uses their mobile device's camera to scan student cards, which students rotate to indicate their answer choice (A, B, C, or D). This system enables device-free participation while maintaining the digital benefits of automated scoring and real-time feedback.

### Goal
Enable teachers to conduct interactive quizzes in classrooms where students lack personal devices, by providing a physical card-based answer collection system that integrates seamlessly with the existing digital quiz platform.

---

## 2. Goals

1. **Accessibility**: Enable quiz participation for students without personal devices
2. **Simplicity**: Provide a straightforward workflow that requires minimal setup and training
3. **Efficiency**: Allow teachers to collect answers from an entire class within 30-60 seconds
4. **Accuracy**: Ensure reliable detection of student answers with minimal scanning errors
5. **Integration**: Seamlessly integrate with existing quiz flow, timer system, and feedback screens
6. **Reusability**: Enable one-time card printing with permanent reuse across multiple quiz sessions
7. **Scalability**: Support classroom sizes up to 50 students (expandable to 63)

---

## 3. User Stories

### Teacher Stories

**US-T1**: As a teacher, I want to enable QR scanning mode when creating/editing a quiz, so that I can prepare for device-free classes.

**US-T2**: As a teacher, I want to print a set of numbered QR cards (1-50) once, so that I can reuse them for all future quizzes without reprinting.

**US-T3**: As a teacher viewing the waiting room, I want to see each student's assigned number clearly displayed, so that I can hand out the correct QR card to each student.

**US-T4**: As a teacher during a quiz, I want to open a camera scanner on my mobile device, so that I can collect student answers by scanning their cards.

**US-T5**: As a teacher scanning cards, I want to see how many students have been scanned in real-time, so that I know when I've collected all answers.

**US-T6**: As a teacher, I want to submit all scanned answers with one button press, so that the quiz can proceed to the feedback screen.

**US-T7**: As a teacher, I want the scanner to work at a comfortable distance (6-15 feet), so that I can scan the entire classroom without getting too close to students.

### Student Stories

**US-S1**: As a student joining the waiting room, I want to see my assigned number prominently displayed, so that I know which QR card to use.

**US-S2**: As a student during a quiz, I want to rotate my QR card to show my answer choice at the top edge, so that the teacher can scan my response.

**US-S3**: As a student, I want my answer to remain anonymous to classmates, so that I feel comfortable answering honestly without peer pressure.

---

## 4. Functional Requirements

### 4.1 Quiz Settings

**FR-1.1**: The quiz editor (EditQuizModal) must include a toggle switch labeled "QR Code Scanning Mode" with description "For students without devices".

**FR-1.2**: When QR scanning is enabled, this setting must be saved to the quiz document in Firebase as `qrScanningEnabled: true`.

**FR-1.3**: The QR scanning toggle must be visible and editable at any time before or after quiz creation.

### 4.2 Student Number Assignment

**FR-2.1**: When a student joins the waiting room, the system must automatically assign them a sequential number starting from 1.

**FR-2.2**: The system must maintain a counter (`nextStudentNumber`) in the game session to track the next available number.

**FR-2.3**: Student numbers must persist throughout the entire quiz session and not change if students disconnect/reconnect.

**FR-2.4**: The student's number must be stored in Firebase under `game_sessions/{sessionId}/players/{playerId}/studentNumber`.

**FR-2.5**: When a new quiz session starts, the student number counter must reset to 1.

### 4.3 Waiting Room Display

**FR-3.1**: The teacher waiting room must display each student's assigned number as a badge/label next to their name and avatar.

**FR-3.2**: The student number badge must be visually prominent (e.g., colored background, bold text, positioned in top-right corner of student card).

**FR-3.3**: Students in the waiting room must be sortable by their assigned number.

**FR-3.4**: The student waiting room must display the current student's assigned number in a large, prominent format (e.g., 4rem font size).

**FR-3.5**: The student waiting room must include instructional text: "Use QR card #{studentNumber}".

### 4.4 QR Card Generation

**FR-4.1**: The system must provide a QR card generator component that creates printable cards numbered 1-50 (or configurable maximum).

**FR-4.2**: Each QR card must include:
- The student number displayed in all 4 corners (visible in any orientation)
- A unique QR code in the center encoding `{studentNumber, sessionId, version}`
- Answer labels (A, B, C, D) at the four edges (top, right, bottom, left)
- High contrast design (black on white) for optimal scanning

**FR-4.3**: Answer labels must be small (for student anonymity) but readable.

**FR-4.4**: The QR code must be sized appropriately for scanning at 6-15 feet distance (recommended: 180-200px on a 3.5" card).

**FR-4.5**: Cards must be designed for standard letter-size paper (8.5" x 11") with 2 cards per page or 1 jumbo card per page.

**FR-4.6**: The teacher waiting room must include a "Print QR Cards" button that opens a printable page with all cards.

### 4.5 Mobile Detection and Routing

**FR-5.1**: When a teacher opens the quiz page on a mobile device AND QR scanning is enabled for that quiz, the system must automatically redirect to the scanner page.

**FR-5.2**: Mobile detection must check both user agent string and screen width (< 768px).

**FR-5.3**: Desktop users must continue to see the standard teacher quiz page regardless of QR scanning setting.

**FR-5.4**: The system must provide a manual link/button for teachers to access the scanner page if auto-redirect fails.

### 4.6 Scanner Interface

**FR-6.1**: The scanner page must request camera permissions and display the camera feed in full-screen or near-full-screen mode.

**FR-6.2**: The scanner must use the device's rear camera (environment-facing) by default on mobile devices.

**FR-6.3**: The scanner must continuously detect QR codes in the camera frame at a rate of 10 frames per second.

**FR-6.4**: When a QR code is detected, the system must:
- Validate that it belongs to the current game session
- Extract the student number from the QR data
- Calculate the answer (A/B/C/D) based on the card's rotation/orientation
- Store the answer in local state: `{studentNumber: answer}`

**FR-6.5**: The scanner must implement debouncing to prevent duplicate scans of the same student within 500ms.

**FR-6.6**: The scanner must provide visual feedback when a card is successfully scanned (e.g., brief vibration, sound beep, visual flash).

**FR-6.7**: The scanner must display a real-time counter showing "Scanned: X students".

**FR-6.8**: The scanner must display a list/grid of scanned students with their numbers and detected answers (e.g., "#5: A", "#12: C").

**FR-6.9**: The scanner must include a prominent "Submit All Answers" button.

**FR-6.10**: The scanner must allow re-scanning (updating an answer) if a student's card is scanned multiple times before submission.

### 4.7 Answer Orientation Detection

**FR-7.1**: The system must calculate the rotation angle of the detected QR code using corner position data.

**FR-7.2**: The system must map rotation angles to answers as follows:
- 0° ± 45° → Answer A (top)
- 90° ± 45° → Answer B (right)
- 180° ± 45° → Answer C (bottom)
- 270° ± 45° → Answer D (left)

**FR-7.3**: If orientation cannot be determined reliably, the system must ignore that scan and not store an answer.

### 4.8 Answer Submission

**FR-8.1**: When the teacher clicks "Submit All Answers", the system must:
- Match each student number to the corresponding player ID in Firebase
- Update each player's answer for the current question index
- Store the answer with metadata: `{answer, isCorrect: false, score: 0, timeSpent: 0, scannedByTeacher: true}`

**FR-8.2**: The submission must be atomic - either all answers are submitted or none (handle errors gracefully).

**FR-8.3**: After successful submission, the system must display a confirmation message (e.g., "Submitted 25 answers!").

**FR-8.4**: After submission, the scanned answers list must be cleared to prepare for the next question.

**FR-8.5**: The teacher must be able to navigate back to the desktop view or proceed to the next question after submission.

### 4.9 Integration with Existing Quiz Flow

**FR-9.1**: QR scanning must work within the existing timer system - teachers can scan while the timer is running or paused.

**FR-9.2**: Scanned answers must appear on the feedback screen exactly like digitally submitted answers.

**FR-9.3**: The scoring system must calculate scores for scanned answers using the same logic as digital answers.

**FR-9.4**: The results page must display scanned answers alongside digital answers with no visual distinction (unless explicitly marked).

**FR-9.5**: If a quiz has QR scanning enabled, students who join digitally should still be able to submit answers normally (hybrid mode support).

### 4.10 Error Handling

**FR-10.1**: If camera permissions are denied, the system must display a clear error message with instructions to enable camera access.

**FR-10.2**: If a QR code from a different session is scanned, the system must ignore it and optionally display a warning.

**FR-10.3**: If a student number is scanned that doesn't exist in the current session, the system must ignore it or display a warning.

**FR-10.4**: If the scanner detects poor lighting conditions, it should display a warning message.

**FR-10.5**: If network connectivity is lost during scanning, answers must be stored locally and synced when connection is restored.

---

## 5. Non-Goals (Out of Scope)

**NG-1**: **Roster Management System** - The system will NOT include a pre-registration or roster management feature. Student numbers are assigned dynamically when students join the waiting room.

**NG-2**: **Dual-Screen Real-Time Feedback** - The system will NOT show real-time scanning feedback on a projected display during scanning. The existing feedback screen after question completion is sufficient.

**NG-3**: **Continuous Scanning Mode** - The system will NOT support continuous scanning throughout the question timer. Scanning is a discrete action performed by the teacher.

**NG-4**: **Advanced Question Types** - Initial release will support only 4-option multiple-choice questions. Other question types (matching, completion, diagram labeling) are out of scope.

**NG-5**: **Scanner Calibration Tool** - Initial release will not include a calibration interface. Standard QR detection algorithms will be used.

**NG-6**: **Offline-First Architecture** - While basic offline tolerance is required, full offline mode with sync is not in scope for v1.

**NG-7**: **Card Customization** - Teachers cannot customize card designs, colors, or layouts in v1.

**NG-8**: **Multiple Card Sets** - Only one standard card design will be provided (no large font, jumbo, or alternative formats in v1).

**NG-9**: **Student-Facing Scanner** - Students cannot scan their own cards; only teachers can operate the scanner.

**NG-10**: **Answer Change After Submission** - Once answers are submitted to Firebase, they cannot be modified through the scanner (must use existing admin tools if needed).

---

## 6. Design Considerations

### 6.1 QR Card Design Specifications

**Card Dimensions**: 3.5" x 3.5" square (2 cards per letter-size page)

**Layout**:
```
┌─────────────────────────┐
│  #5        A        #5  │  ← Top edge
│                         │
│         ┌─────┐         │
│    D    │ QR  │    B    │  ← Side edges
│         │Code │         │
│         └─────┘         │
│                         │
│  #5        C        #5  │  ← Bottom edge
└─────────────────────────┘
```

**Typography**:
- Student number: Bold, 14-16pt, all 4 corners
- Answer labels: Regular, 10-12pt, small for anonymity
- High contrast: Black text/QR on white background

**QR Code**:
- Size: 180-200px (approximately 2" x 2")
- Error correction level: High (30%)
- Format: SVG for print quality
- Data: `{"studentNumber": 5, "sessionId": "abc123", "version": 1}`

---

## 7. Technical Considerations

### 7.1 Technology Stack

**QR Code Generation**: `qrcode.react` (npm package)

**QR Code Scanning**: `jsQR` (browser-based)

**Camera Access**: `react-webcam` (React wrapper for getUserMedia)

**Mobile Detection**: Custom utility function

### 7.2 Database Schema Changes

```javascript
// Firebase: /quizzes/{quizId}
{
  qrScanningEnabled: true  // NEW FIELD
}

// Firebase: /game_sessions/{sessionId}
{
  nextStudentNumber: 9,  // NEW FIELD
  players: {
    "player-abc": {
      studentNumber: 5,  // NEW FIELD
      answers: {
        0: {
          scannedByTeacher: true  // NEW FIELD
        }
      }
    }
  }
}
```

---

## 8. Success Metrics

**M-1**: 20% of teachers enable QR scanning within 3 months

**M-2**: Average scanning time: < 60 seconds for 30 students

**M-3**: Scanning accuracy rate: > 95%

**M-4**: Teacher satisfaction: > 4.0/5.0

---

## 9. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Quiz settings toggle
- Student number assignment
- Waiting room updates
- QR card generator

### Phase 2: Scanner Core (Week 3-4)
- Mobile detection
- Scanner interface
- QR detection
- Orientation calculation

### Phase 3: Integration (Week 5)
- Answer submission
- Quiz flow integration
- Error handling

### Phase 4: Polish (Week 6)
- UI refinements
- Testing
- Documentation

---

## 10. Open Questions

**Q1**: Maximum cards - 50 or 63?

**Q2**: Support hybrid mode (QR + digital)?

**Q3**: Handle multiple scans of same student?

**Q4**: Store scanning metadata?

**Q5**: Handle late-joining students?

**Q6**: Provide "Clear & Rescan" button?

**Q7**: Distance guidance for teachers?

**Q8**: Support landscape scanning?

**Q9**: Handle poor lighting?

**Q10**: Manual answer entry fallback?

---

## 11. Acceptance Criteria

**AC-1**: Teacher can enable QR scanning in quiz editor

**AC-2**: Students get sequential numbers on join

**AC-3**: Teacher sees student numbers in waiting room

**AC-4**: Teacher can print 50 QR cards

**AC-5**: Mobile auto-redirects to scanner

**AC-6**: Scanner detects cards and calculates answers

**AC-7**: Scanner shows scan count

**AC-8**: Teacher can submit all answers

**AC-9**: Answers appear on feedback screen

**AC-10**: System handles 30+ students with >95% accuracy

**AC-11**: Error messages for all failure cases

**AC-12**: Works on iOS Safari and Chrome Android
