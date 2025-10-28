# Phase 3 Enhancement Roadmap

**Project:** Interactive Learning Environment (Kahoot-Style)
**Created:** 2025-10-19
**Current Version:** 2.0 (Phase 2 Complete)
**Target Version:** 3.0

---

## Executive Summary

This roadmap outlines Phase 3 enhancements to transform the application from a JSON-based quiz platform into a full-featured educational tool with persistent accounts, in-app quiz creation, and advanced analytics.

**Total Estimated Timeline:** 10-12 weeks
**Total Story Points:** 144
**Priority Levels:** Critical (P0), High (P1), Medium (P2), Low (P3)

---

## Phase 3 Goals

1. **Quiz Builder UI** - Enable teachers to create quizzes without JSON editing
2. **Student Accounts** - Track progress over time with persistent login
3. **Advanced Analytics** - Provide insights into learning patterns
4. **Accessibility** - Make the platform usable for all students
5. **Enhanced Multiplayer** - Add team-based and tournament modes

---

## Epic 1: Quiz Builder UI (P0 - HIGHEST PRIORITY)

**Objective:** Eliminate JSON requirement - teachers create quizzes in-app

### Story 1.1: Quiz Management Dashboard ✨ CRITICAL
**Priority:** P0
**Story Points:** 13
**Estimated Time:** 2 weeks

**User Story:**
> As a teacher, I want to see all my quizzes in a dashboard, so I can manage, edit, and reuse them easily.

**Acceptance Criteria:**
- [ ] Teachers see a list of all their created quizzes
- [ ] Each quiz shows: title, question count, last modified date
- [ ] Actions: Create New, Edit, Duplicate, Delete, Upload JSON
- [ ] Search and filter quizzes by title or tags
- [ ] Quizzes stored in Firebase per teacher
- [ ] Support for quiz templates/favorites

**Technical Tasks:**
1. Create TeacherDashboardPage.jsx
2. Add Firebase schema: `/quizzes/{teacherId}/{quizId}`
3. Implement quiz CRUD operations
4. Add search/filter functionality
5. Create QuizCard component
6. Add confirmation dialogs for delete

**Files to Create:**
- `src/pages/TeacherDashboardPage.jsx`
- `src/components/QuizCard.jsx`
- `src/services/quizService.js`

**Firebase Schema:**
```json
{
  "quizzes": {
    "teacherId123": {
      "quizId1": {
        "title": "IELTS Practice Quiz",
        "questions": [...],
        "createdAt": 1234567890,
        "updatedAt": 1234567890,
        "tags": ["IELTS", "Reading"],
        "passage": {...}
      }
    }
  }
}
```

---

### Story 1.2: Visual Quiz Editor ✨ CRITICAL
**Priority:** P0
**Story Points:** 21
**Estimated Time:** 3 weeks

**User Story:**
> As a teacher, I want to create and edit quizzes using a visual interface, so I don't need to write JSON.

**Acceptance Criteria:**
- [ ] Add questions with dropdown to select type (MCQ, multiple-select, etc.)
- [ ] Form fields for each question type (text, options, answer, timer)
- [ ] Drag-and-drop to reorder questions
- [ ] Live preview of quiz as it's built
- [ ] Save as draft, auto-save every 30 seconds
- [ ] Validate questions before saving (use existing validation.js)
- [ ] Support for quiz-level and question-level passages

**Question Type Forms:**
1. **Multiple Choice:** Question text, 4 options, correct answer, timer
2. **Multiple Select:** Question text, options (min 2), correct answers array, timer
3. **Completion:** Question text with blank indicators, word bank array, answer, timer
4. **Matching:** Items list, options list, answers object, reusableAnswers flag, timer
5. **Diagram Labeling:** Question text, diagram URL/upload, labels array, timer

**Technical Tasks:**
1. Create QuizEditorPage.jsx with tabs (Info, Questions, Preview)
2. Create QuestionForm component (dynamic based on type)
3. Implement react-beautiful-dnd for drag-and-drop
4. Add auto-save with useEffect + debounce
5. Create QuizPreview component
6. Add passage editor (quiz-level and question-level)
7. Implement image upload for diagrams
8. Add validation before save
9. Unit tests for editor logic

**Files to Create:**
- `src/pages/QuizEditorPage.jsx`
- `src/components/QuestionForm.jsx`
- `src/components/QuizPreview.jsx`
- `src/components/PassageEditor.jsx`
- `src/utils/imageUpload.js`

**Dependencies:**
- `react-beautiful-dnd` for drag-and-drop
- Firebase Storage for image uploads

---

### Story 1.3: Image Upload for Diagrams
**Priority:** P1
**Story Points:** 8
**Estimated Time:** 1 week

**User Story:**
> As a teacher, I want to upload images for diagram questions directly from my computer, so I don't need to host images elsewhere.

**Acceptance Criteria:**
- [ ] Drag-and-drop or click to upload images
- [ ] Supported formats: PNG, JPG, JPEG, GIF
- [ ] Max file size: 5MB
- [ ] Image preview before upload
- [ ] Progress bar during upload
- [ ] Image compression to optimize storage
- [ ] Images stored in Firebase Storage
- [ ] Delete unused images from storage

**Technical Tasks:**
1. Set up Firebase Storage
2. Create ImageUpload component
3. Implement compression with browser-image-compression
4. Add upload progress indicator
5. Store image URLs in quiz JSON
6. Clean up orphaned images on quiz delete

**Files to Create:**
- `src/components/ImageUpload.jsx`
- `src/services/storageService.js`

**Firebase Storage Structure:**
```
/diagrams/{teacherId}/{quizId}/{imageId}.jpg
```

---

## Epic 2: Student Accounts & Progress Tracking (P1)

**Objective:** Enable persistent student accounts with historical performance data

### Story 2.1: Student Registration & Login
**Priority:** P1
**Story Points:** 13
**Estimated Time:** 2 weeks

**User Story:**
> As a student, I want to create an account and log in, so my quiz history is saved.

**Acceptance Criteria:**
- [ ] Student registration with email/password
- [ ] Email verification (optional for MVP)
- [ ] Login page with "Remember Me" checkbox
- [ ] Password reset functionality
- [ ] Student profile: name, email, grade level (optional)
- [ ] Anonymous play still supported (guest mode)
- [ ] Logout functionality

**Technical Tasks:**
1. Create StudentRegisterPage.jsx
2. Create StudentLoginPage.jsx
3. Implement Firebase Auth sign-up/sign-in
4. Add password reset flow
5. Create student profile in Realtime Database
6. Update LoginPage to offer: "Play as Guest" or "Login with Account"
7. Add authentication context/provider
8. Persist login with localStorage

**Files to Create:**
- `src/pages/StudentRegisterPage.jsx`
- `src/pages/StudentLoginPage.jsx`
- `src/contexts/AuthContext.jsx`
- `src/hooks/useAuth.js`

**Firebase Auth Integration:**
- Use `createUserWithEmailAndPassword()`
- Use `signInWithEmailAndPassword()`
- Use `sendPasswordResetEmail()`

---

### Story 2.2: Quiz History & Performance Tracking
**Priority:** P1
**Story Points:** 13
**Estimated Time:** 2 weeks

**User Story:**
> As a student, I want to see my past quiz results and track my improvement over time, so I can monitor my progress.

**Acceptance Criteria:**
- [ ] Student dashboard shows all completed quizzes
- [ ] For each quiz: score, date, time taken, questions correct/incorrect
- [ ] Filter by date range or quiz name
- [ ] View detailed results for past quizzes (which questions missed)
- [ ] Progress chart showing score trends over time
- [ ] Export results as PDF (optional)

**Technical Tasks:**
1. Save quiz results to student's profile in Firebase
2. Create StudentDashboardPage.jsx
3. Display quiz history with filtering
4. Create ProgressChart component (line chart)
5. Allow drilling into individual quiz results
6. Add data export functionality

**Files to Create:**
- `src/pages/StudentDashboardPage.jsx`
- `src/components/ProgressChart.jsx`
- `src/components/QuizHistoryTable.jsx`

**Firebase Schema:**
```json
{
  "students": {
    "studentId123": {
      "profile": {
        "name": "John Doe",
        "email": "john@example.com",
        "gradeLevel": "10"
      },
      "quizHistory": {
        "sessionId1": {
          "quizTitle": "IELTS Practice",
          "score": 85,
          "totalQuestions": 10,
          "correctAnswers": 8.5,
          "completedAt": 1234567890,
          "timeTaken": 300,
          "answers": [...]
        }
      }
    }
  }
}
```

---

### Story 2.3: Badges & Achievements
**Priority:** P2
**Story Points:** 8
**Estimated Time:** 1 week

**User Story:**
> As a student, I want to earn badges for achievements, so I feel motivated to keep learning.

**Acceptance Criteria:**
- [ ] Badge types: Perfect Score, Speed Demon, Consistent Learner, etc.
- [ ] Badges displayed on student dashboard
- [ ] Badge popup notification when earned
- [ ] Progress toward next badge (e.g., "3 more perfect scores to Gold Badge")
- [ ] Shareable badge images (optional)

**Badge Ideas:**
1. **Perfect Score** - Get 100% on a quiz
2. **Speed Demon** - Finish quiz in < 50% of allotted time
3. **Consistent Learner** - Complete 5 quizzes in 5 days
4. **Comeback Kid** - Improve score by 20+ points on retry
5. **Subject Master** - Get 90%+ on 10 quizzes with same tag

**Technical Tasks:**
1. Create badge calculation logic
2. Add badges to student profile
3. Create BadgeDisplay component
4. Add badge notification modal
5. Track badge progress

**Files to Create:**
- `src/utils/badgeCalculator.js`
- `src/components/BadgeDisplay.jsx`
- `src/components/BadgeNotification.jsx`

---

## Epic 3: Advanced Analytics (P2)

**Objective:** Provide teachers with insights into class performance

### Story 3.1: Class Performance Dashboard
**Priority:** P2
**Story Points:** 13
**Estimated Time:** 2 weeks

**User Story:**
> As a teacher, I want to see overall class performance analytics, so I can identify trends and areas for improvement.

**Acceptance Criteria:**
- [ ] Class average score over time (line chart)
- [ ] Per-question difficulty analysis (% students correct)
- [ ] Most commonly missed questions
- [ ] Student performance distribution (histogram)
- [ ] Filter by quiz, date range, or student group
- [ ] Export analytics as CSV or PDF

**Technical Tasks:**
1. Aggregate quiz session data
2. Create TeacherAnalyticsPage.jsx
3. Create analytics calculation functions
4. Build visualization components (charts)
5. Add filtering and date range selection
6. Implement CSV export

**Files to Create:**
- `src/pages/TeacherAnalyticsPage.jsx`
- `src/components/PerformanceChart.jsx`
- `src/components/QuestionDifficultyTable.jsx`
- `src/utils/analyticsCalculator.js`

---

### Story 3.2: Student Learning Insights
**Priority:** P2
**Story Points:** 8
**Estimated Time:** 1 week

**User Story:**
> As a teacher, I want to see individual student learning curves, so I can provide personalized support.

**Acceptance Criteria:**
- [ ] View individual student's score progression
- [ ] Identify strengths and weaknesses by question type
- [ ] Show time spent per question
- [ ] Compare student to class average
- [ ] Recommend review topics based on performance

**Technical Tasks:**
1. Add student drill-down view
2. Calculate per-student statistics
3. Create comparison visualizations
4. Implement topic recommendation algorithm

**Files to Create:**
- `src/components/StudentDetailView.jsx`
- `src/utils/recommendationEngine.js`

---

## Epic 4: Accessibility Features (P1)

**Objective:** Make the platform accessible to all students

### Story 4.1: Keyboard Navigation
**Priority:** P1
**Story Points:** 5
**Estimated Time:** 3 days

**User Story:**
> As a student who cannot use a mouse, I want to navigate the quiz using only my keyboard, so I can participate fully.

**Acceptance Criteria:**
- [ ] Tab through all interactive elements
- [ ] Enter/Space to select answers
- [ ] Arrow keys to navigate options
- [ ] Escape to close modals
- [ ] Focus indicators visible on all elements
- [ ] Skip links for main content

**Technical Tasks:**
1. Add tabIndex to all interactive elements
2. Implement keyboard event handlers
3. Add focus styles to CSS
4. Test with keyboard-only navigation
5. Add skip links

**Files to Modify:**
- All page components
- Mantine component configurations

---

### Story 4.2: Screen Reader Support
**Priority:** P1
**Story Points:** 5
**Estimated Time:** 3 days

**User Story:**
> As a visually impaired student, I want screen reader support, so I can hear the quiz questions and options.

**Acceptance Criteria:**
- [ ] All images have alt text
- [ ] ARIA labels on all interactive elements
- [ ] Live regions announce quiz state changes
- [ ] Semantic HTML (headings, lists, etc.)
- [ ] Form labels properly associated
- [ ] Focus management on page changes

**Technical Tasks:**
1. Add ARIA labels and roles
2. Add alt text to all images
3. Implement live regions for announcements
4. Audit HTML semantics
5. Test with NVDA/JAWS

**Files to Modify:**
- All components with images or complex interactions

---

### Story 4.3: High Contrast Mode & Font Scaling
**Priority:** P2
**Story Points:** 3
**Estimated Time:** 2 days

**User Story:**
> As a student with visual impairments, I want high contrast mode and larger fonts, so I can read the quiz easily.

**Acceptance Criteria:**
- [ ] High contrast color scheme toggle
- [ ] Font size controls (small, medium, large, extra large)
- [ ] Settings persist across sessions
- [ ] Meets WCAG 2.1 AA contrast ratios

**Technical Tasks:**
1. Create accessibility settings panel
2. Add high contrast CSS theme
3. Implement font scaling
4. Save preferences to localStorage
5. Apply WCAG contrast checker

**Files to Create:**
- `src/components/AccessibilitySettings.jsx`
- `src/styles/highContrast.css`

---

## Epic 5: Enhanced Multiplayer (P3)

**Objective:** Add team-based and competitive modes

### Story 5.1: Team-Based Quizzes
**Priority:** P3
**Story Points:** 13
**Estimated Time:** 2 weeks

**User Story:**
> As a teacher, I want to run team-based quizzes, so students can collaborate and compete.

**Acceptance Criteria:**
- [ ] Teacher assigns students to teams before quiz starts
- [ ] Team scores aggregate individual answers
- [ ] Team leaderboard during quiz
- [ ] Team celebration on results screen
- [ ] Support 2-8 teams with 1-10 students each

**Technical Tasks:**
1. Add team assignment UI to lobby
2. Update scoring to track team totals
3. Modify RocketRaceChart for teams
4. Update results pages for team view

**Files to Modify:**
- `src/pages/TeacherLobbyPage.jsx`
- `src/components/RocketRaceChart.jsx`
- `src/utils/scoring.js`

---

### Story 5.2: Tournament Brackets
**Priority:** P3
**Story Points:** 13
**Estimated Time:** 2 weeks

**User Story:**
> As a teacher, I want to run tournament-style competitions, so students can compete in elimination rounds.

**Acceptance Criteria:**
- [ ] Bracket generation (single elimination)
- [ ] Automatic progression to next round
- [ ] Bracket visualization
- [ ] Winner crowned with special animation

**Technical Tasks:**
1. Create bracket generation algorithm
2. Build bracket visualization
3. Implement round progression logic
4. Add winner celebration

**Files to Create:**
- `src/pages/TournamentPage.jsx`
- `src/components/TournamentBracket.jsx`
- `src/utils/bracketGenerator.js`

---

## Implementation Priority Matrix

| Epic | Priority | User Impact | Technical Complexity | Timeline |
|------|----------|-------------|----------------------|----------|
| 1: Quiz Builder UI | P0 | Critical | High | Weeks 1-6 |
| 2: Student Accounts | P1 | High | Medium | Weeks 5-9 |
| 3: Advanced Analytics | P2 | Medium | Medium | Weeks 8-10 |
| 4: Accessibility | P1 | High | Low-Medium | Weeks 7-9 |
| 5: Enhanced Multiplayer | P3 | Low | Medium | Weeks 10-12 |

---

## Phase 3 Sprint Plan

### Sprint 1 (Week 1-2): Quiz Dashboard
- Story 1.1: Quiz Management Dashboard

### Sprint 2 (Week 3-5): Visual Quiz Editor
- Story 1.2: Visual Quiz Editor (Part 1 - Basic Forms)

### Sprint 3 (Week 6-7): Quiz Editor Completion
- Story 1.2: Visual Quiz Editor (Part 2 - Advanced Features)
- Story 1.3: Image Upload

### Sprint 4 (Week 8-9): Student Accounts
- Story 2.1: Student Registration & Login
- Story 4.1: Keyboard Navigation
- Story 4.2: Screen Reader Support

### Sprint 5 (Week 10-11): Progress Tracking & Analytics
- Story 2.2: Quiz History & Performance Tracking
- Story 3.1: Class Performance Dashboard

### Sprint 6 (Week 12): Polish & Optional Features
- Story 2.3: Badges & Achievements
- Story 4.3: High Contrast Mode
- Bug fixes and UAT
- Phase 3 completion

---

## Success Metrics for Phase 3

### Functional Completeness
- [ ] Teachers can create quizzes without JSON
- [ ] Students can create accounts and track progress
- [ ] Analytics dashboard provides actionable insights
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] 100% unit test pass rate maintained

### User Experience
- [ ] Average quiz creation time < 10 minutes
- [ ] 90%+ teacher satisfaction with quiz builder
- [ ] Student engagement increases with accounts/badges
- [ ] Zero accessibility violations on axe DevTools

### Performance
- [ ] Dashboard loads < 1 second
- [ ] Quiz editor auto-save < 500ms latency
- [ ] Bundle size remains < 150KB initial load
- [ ] Image uploads complete < 5 seconds

---

## Technical Dependencies

### New Libraries
- `react-beautiful-dnd` - Drag-and-drop for question ordering
- `browser-image-compression` - Image compression before upload
- `recharts` - Analytics charts (already removed, may add back lightweight alternative)
- `jspdf` - PDF export for results (optional)

### Firebase Services
- **Firebase Authentication** - Student/teacher login
- **Firebase Storage** - Image hosting for diagrams
- **Firestore** (optional) - Better querying for analytics vs Realtime Database

---

## Risk Assessment

### High Risk
1. **Quiz Builder Complexity** - Visual editor is complex, requires extensive UX testing
   - Mitigation: Build MVP first, iterate based on teacher feedback

2. **Data Migration** - Moving to accounts requires data structure changes
   - Mitigation: Support both anonymous and authenticated modes simultaneously

### Medium Risk
1. **Firebase Storage Costs** - Image uploads could increase costs
   - Mitigation: Implement compression, set storage limits per teacher

2. **Accessibility Compliance** - WCAG 2.1 AA is strict
   - Mitigation: Use axe DevTools, hire accessibility consultant for audit

---

## Phase 4 Preview (Future)

Ideas for Phase 4 (after Phase 3 completion):

1. **Mobile Apps** - Native iOS/Android apps with React Native
2. **AI-Powered Features**
   - Auto-generate quiz questions from text
   - Smart hints for struggling students
   - Personalized study plans
3. **Live Video Integration** - Zoom/Teams integration for remote classes
4. **Gamification** - Leaderboards, XP points, level progression
5. **Multi-Language Support** - Internationalization (i18n)
6. **Third-Party Integrations** - Google Classroom, Canvas LMS

---

## Conclusion

Phase 3 will transform the application into a complete educational platform with quiz creation tools, persistent accounts, and accessibility features. The estimated 10-12 week timeline allows for careful UX design and testing.

**Next Steps:**
1. Prioritize Epic 1 (Quiz Builder) for immediate start
2. Create detailed technical design docs for Quiz Editor
3. Set up Sprint 1 backlog
4. Schedule Phase 3 kickoff meeting

---

**Document Version:** 1.0
**Last Updated:** 2025-10-19
**Owner:** Development Team
**Status:** Draft - Ready for Review

---

**End of Phase 3 Roadmap**
