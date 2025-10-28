# PRD: Two-Modal Quiz Editor System

**Document ID:** 0004  
**Feature Name:** Two-Modal Quiz Editor System  
**Created:** October 22, 2025  
**Status:** Draft  
**Priority:** High

---

## 1. Introduction/Overview

The current quiz editor implementation uses a single modal with side-by-side panels that results in poor user experience due to incorrect positioning, sizing, and animation issues. This PRD defines a redesigned two-modal system where:

1. **Edit Quiz Dialog** opens centered when clicking "Edit" on a quiz
2. **Question Editor Dialog** appears alongside when clicking a question, with both modals centered together as a pair

This redesign solves critical UX issues including improper modal positioning, inadequate spacing, poor visual hierarchy, and janky animations that make the current implementation "significantly unacceptable."

### Problem Statement
The current implementation fails to properly position and size the two modals when both are visible, resulting in overlapping content, misaligned layouts, and a confusing user experience that doesn't match the intended design.

### Goal
Create a polished, professional two-modal editing experience where both dialogs are properly centered together on the page, with smooth animations, appropriate sizing, and clear visual hierarchy.

---

## 2. Goals

1. **Proper Centering:** Both modals must be centered together as a pair on the page when both are visible
2. **Optimal Sizing:** Edit Quiz modal should shrink when Question Editor opens to maintain balanced layout
3. **Smooth Animations:** All transitions must be smooth (0.3s ease) with no janky movements
4. **Visual Consistency:** Both modals maintain the same visual style (borders, shadows, colors)
5. **Desktop-First:** Optimized for desktop experience; mobile shows one modal at a time
6. **Maintain Functionality:** All existing features (validation, auto-save, navigation) remain intact

---

## 3. User Stories

### US-1: Opening Edit Quiz Dialog
**As a** teacher  
**I want to** click the "Edit" button on a quiz card  
**So that** I see the Edit Quiz dialog centered on my screen with a list of questions

**Acceptance Criteria:**
- Edit Quiz dialog appears centered on the page
- Dialog shows quiz title and question count
- All questions are listed with question number, preview text, and timer
- Dialog has fixed width and appropriate height (max 80vh)

### US-2: Opening Question Editor
**As a** teacher  
**I want to** click on a question in the Edit Quiz dialog  
**So that** the Question Editor opens alongside it with both modals centered together

**Acceptance Criteria:**
- Edit Quiz dialog moves to the left and shrinks in width
- Question Editor appears on the right with larger width
- Both modals are centered together as a pair on the page
- Transition is smooth with 0.3s ease animation
- Selected question is highlighted in the Edit Quiz dialog

### US-3: Editing Questions
**As a** teacher  
**I want to** edit question details in the Question Editor  
**So that** I can update question text, options, correct answer, timer, and points

**Acceptance Criteria:**
- All question fields are editable
- Changes are auto-saved to localStorage
- Modified questions show visual indicator
- Validation prevents saving incomplete questions

### US-4: Navigating Between Questions
**As a** teacher  
**I want to** navigate to previous/next questions using buttons  
**So that** I can quickly edit multiple questions without closing the editor

**Acceptance Criteria:**
- Previous/Next buttons work correctly
- Question Editor content updates smoothly
- Edit Quiz dialog selection updates to match
- First question disables "Previous", last question disables "Next"

### US-5: Closing Question Editor
**As a** teacher  
**I want to** close the Question Editor using the X button  
**So that** the Edit Quiz dialog returns to center smoothly

**Acceptance Criteria:**
- Question Editor closes immediately
- Edit Quiz dialog slides back to center with smooth animation
- Edit Quiz dialog returns to original width
- No selected question in the list

### US-6: Saving Changes
**As a** teacher  
**I want to** save all my changes using the "Save Changes" button  
**So that** my edits are persisted to the database

**Acceptance Criteria:**
- Validation runs before saving
- Invalid questions show error popup with specific issues
- User can choose to "Continue Editing" or "Save Anyway"
- Successful save clears localStorage and closes both modals
- Success message confirms save completion

### US-7: Mobile Experience
**As a** teacher on mobile/tablet  
**I want to** see one modal at a time  
**So that** I have enough screen space to work effectively

**Acceptance Criteria:**
- On mobile, only one modal is visible at a time
- Question Editor opens full-screen, hiding Edit Quiz dialog
- Back button returns to Edit Quiz dialog
- Touch interactions work smoothly

---

## 4. Functional Requirements

### FR-1: Modal Positioning System
1. **Initial State (Edit Quiz only):**
   - Edit Quiz dialog must be centered on the page (50% left, 50% top, translate(-50%, -50%))
   - Width: 450px
   - Max height: 80vh

2. **Dual Modal State (Both visible):**
   - Both modals must be centered together as a pair
   - Edit Quiz dialog width reduces to accommodate Question Editor
   - Suggested Edit Quiz width when paired: 350px
   - Question Editor width: 600-700px (larger than Edit Quiz)
   - Gap between modals: 1.5rem
   - Total width of both modals + gap must be centered on page

3. **Transition Behavior:**
   - Smooth animation: 0.3s ease for all position/size changes
   - No janky movements or layout shifts
   - Z-index properly managed to prevent overlap issues

### FR-2: Edit Quiz Dialog
1. Must display:
   - Quiz title
   - Question count
   - Scrollable list of all questions
   - Each question shows: number, preview text, timer
   - Selected question has distinct visual state (purple border, light background)

2. Interactions:
   - Click question → opens Question Editor
   - Hover state on questions (light background, border color change)
   - "Cancel" button → closes dialog (with unsaved changes warning if applicable)
   - "Save Changes" button → validates and saves all edits

3. Visual styling:
   - Paper component with border, shadow, rounded corners
   - Header with icon and title
   - Sections separated by borders
   - Footer with action buttons

### FR-3: Question Editor Dialog
1. Must display:
   - Question number indicator (e.g., "Question 1 of 10")
   - All editable fields: question text, options, correct answer, timer, points
   - Navigation buttons (Previous/Next)
   - Close button (X)
   - Reset button to restore original question

2. Interactions:
   - All fields are editable with appropriate input types
   - Changes trigger auto-save to localStorage
   - Modified indicator shows when question has unsaved changes
   - Previous/Next buttons navigate between questions
   - Close button returns to Edit Quiz centered state
   - Reset button restores original question (with confirmation)

3. Visual styling:
   - Same Paper component style as Edit Quiz dialog
   - Larger size to accommodate editing interface
   - Clear visual hierarchy for form fields
   - Consistent button styling

### FR-4: Animation & Transitions
1. Opening Question Editor:
   - Edit Quiz dialog: width shrinks from 450px to 350px
   - Edit Quiz dialog: position shifts left
   - Question Editor: fades in with opacity 0 → 1
   - Both modals: reposition to be centered together
   - Duration: 0.3s ease for all properties

2. Closing Question Editor:
   - Question Editor: fades out with opacity 1 → 0
   - Edit Quiz dialog: width expands from 350px to 450px
   - Edit Quiz dialog: position shifts to center
   - Duration: 0.3s ease for all properties

3. Switching Questions:
   - Question Editor content updates smoothly
   - No position/size changes, only content swap
   - Selected state updates in Edit Quiz dialog

### FR-5: Validation System
1. Pre-save validation checks:
   - Question text is not empty
   - All options have text (for multiple-choice questions)
   - Correct answer is set
   - Timer and points are valid numbers

2. Validation popup:
   - Lists all validation errors with question numbers
   - Provides action buttons based on context:
     - "Continue Editing" (always available)
     - "Save Anyway" (when triggered by Save button)
     - "Discard Changes" (when triggered by Close button)

3. Error messages:
   - Clear, specific error descriptions
   - Question number references for easy location
   - Option labels (A, B, C, D) for option-specific errors

### FR-6: Auto-Save System
1. localStorage integration:
   - Saves edited questions automatically on change
   - Storage key: `quiz_edit_${quizId}`
   - Stores: questions object, modified indices, timestamp

2. Recovery:
   - Loads saved data when reopening quiz editor
   - Clears localStorage after successful save
   - Clears localStorage when discarding changes

3. Modified tracking:
   - Maintains Set of modified question indices
   - Shows visual indicators on modified questions
   - Used for unsaved changes warnings

### FR-7: Responsive Behavior
1. Desktop (>1024px):
   - Two-modal system as described above
   - Both modals visible simultaneously when editing

2. Tablet/Mobile (≤1024px):
   - One modal at a time approach
   - Edit Quiz dialog opens full-width (with max-width)
   - Question Editor opens full-screen, hiding Edit Quiz
   - Back button in Question Editor returns to Edit Quiz
   - No side-by-side layout

### FR-8: Database Integration
1. Save operation:
   - Updates Firebase Realtime Database
   - Path: `/quizzes/${quizId}/questions/${questionIndex}`
   - Batch update for all modified questions

2. Error handling:
   - Network error alerts
   - Retry mechanism suggestion
   - Data integrity checks

---

## 5. Non-Goals (Out of Scope)

1. **Bulk Question Operations:** No multi-select or batch editing in this version
2. **Drag-and-Drop Reordering:** Question order changes not included
3. **Question Preview Mode:** No live preview of student view
4. **Undo/Redo System:** Not implementing history stack
5. **Collaborative Editing:** No real-time multi-user editing
6. **Question Templates:** No pre-built question templates
7. **Image Upload in Editor:** Image handling deferred to future version
8. **Keyboard Shortcuts:** No keyboard navigation shortcuts (except Esc to close)
9. **Question Duplication:** No clone/duplicate question feature
10. **Export/Import Individual Questions:** Bulk quiz import/export only

---

## 6. Design Considerations

### Layout Reference
Based on the provided image reference:

**Before clicking a question:**
```
┌─────────────────┐
│  Edit Quiz      │
│  (Centered)     │
│                 │
│  Question List  │
│                 │
└─────────────────┘
```

**After clicking a question:**
```
┌──────────────┐       ┌─────────────────────────┐
│  Edit Quiz   │       │  Question Editor        │
│  (Left)      │       │  (Right, Larger)        │
│              │       │                         │
│  Question    │       │  Full editing interface │
│  List        │       │  with all fields        │
│              │       │                         │
└──────────────┘       └─────────────────────────┘
        Both centered together on page
```

### Component Structure
```
QuizEditor (Container)
├── Modal (Mantine, transparent background)
│   ├── Group (horizontal layout)
│   │   ├── Box (animated wrapper)
│   │   │   └── EditQuizModal
│   │   │       ├── Header (title, icon)
│   │   │       ├── Quiz Info (title, count)
│   │   │       ├── Question List (scrollable)
│   │   │       └── Footer (Cancel, Save buttons)
│   │   │
│   │   └── Paper (conditional render)
│   │       └── QuestionEditorPanel
│   │           ├── Header (question number, close)
│   │           ├── Form Fields (editable inputs)
│   │           ├── Navigation (Previous, Next)
│   │           └── Actions (Reset button)
│   │
│   └── ValidationPopup (nested Modal)
│       ├── Error List
│       └── Action Buttons
```

### Visual Styling
- **Color Scheme:** Consistent with existing app (purple accents, slate grays)
- **Borders:** 2px solid #e2e8f0 (neutral), #8b5cf6 (selected)
- **Shadows:** lg shadow for depth
- **Border Radius:** lg (0.5rem) for modern look
- **Typography:** 
  - Headings: fw=700, color=#1e293b
  - Body text: color=#475569
  - Meta text: color=#64748b, smaller size
- **Spacing:** Consistent 1rem-1.5rem padding/gaps

### Accessibility
- Focus states on all interactive elements
- Proper ARIA labels for screen readers
- Keyboard navigation support (Tab, Esc)
- Sufficient color contrast ratios
- Clear visual feedback for all actions

---

## 7. Technical Considerations

### State Management
1. **Local State (QuizEditor component):**
   - `selectedQuestionIndex`: Currently selected question (null when none)
   - `showEditor`: Boolean for Question Editor visibility
   - `editedQuestions`: Object mapping indices to question data
   - `modifiedQuestions`: Set of modified question indices
   - `showValidationPopup`: Boolean for validation modal
   - `validationErrors`: Array of error messages
   - `pendingAction`: 'save' | 'close' | null

2. **Props Flow:**
   - Parent (TeacherLobbyPage) → QuizEditor: `quiz`, `show`, `handleClose`
   - QuizEditor → EditQuizModal: `quiz`, `onQuestionSelect`, `selectedQuestionIndex`, `onSaveChanges`, `onCancel`
   - QuizEditor → QuestionEditorPanel: `question`, `questionIndex`, `onUpdate`, `onClose`, navigation props

### CSS Positioning Strategy
Current implementation uses `transform: translateX()` which is incorrect. Required approach:

1. **Container Modal:**
   - `size="auto"` to allow custom sizing
   - `centered` prop for vertical centering
   - Transparent background to show both modals

2. **Horizontal Centering Logic:**
   ```javascript
   // Calculate total width
   const editQuizWidth = showEditor ? 350 : 450;
   const questionEditorWidth = 600;
   const gap = 24; // 1.5rem
   const totalWidth = showEditor 
     ? editQuizWidth + gap + questionEditorWidth 
     : editQuizWidth;
   
   // Center the group
   // Use flexbox with justify-content: center
   // Or calculate left offset: calc(50% - totalWidth/2)
   ```

3. **Animation Properties:**
   - Use `transition` on width, margin, opacity
   - Avoid `transform` for horizontal positioning (causes centering issues)
   - Use `transform` only for vertical centering (translateY(-50%))

### Performance Considerations
1. **Debounce auto-save:** Prevent excessive localStorage writes
2. **Memoize question list:** Avoid unnecessary re-renders
3. **Lazy load Question Editor:** Only render when needed
4. **Optimize animations:** Use CSS transitions, not JavaScript

### Dependencies
- **Existing:** React, Mantine UI, Firebase Realtime Database
- **No new dependencies required**

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- CSS transitions and transforms required

---

## 8. Success Metrics

### Quantitative Metrics
1. **User Satisfaction:** 90%+ positive feedback on new editor experience
2. **Edit Completion Rate:** 95%+ of started edits result in saves (vs. cancellations)
3. **Error Rate:** <5% of save attempts result in validation errors
4. **Performance:** Modal transitions complete in <300ms
5. **Mobile Usage:** 80%+ of mobile users successfully edit questions

### Qualitative Metrics
1. **Visual Polish:** Modals appear properly centered and aligned
2. **Animation Smoothness:** No janky or stuttering transitions
3. **Intuitive Flow:** Users understand two-modal system without instruction
4. **Professional Appearance:** UI matches quality of commercial quiz platforms

### Testing Criteria
- [ ] Edit Quiz dialog centers correctly on open
- [ ] Question Editor opens with both modals centered together
- [ ] Edit Quiz dialog shrinks to correct width when editor opens
- [ ] Gap between modals is consistent (1.5rem)
- [ ] Animations are smooth (no jank, no layout shifts)
- [ ] Closing editor returns Edit Quiz to center smoothly
- [ ] All question fields are editable
- [ ] Validation catches empty/invalid fields
- [ ] Auto-save persists changes to localStorage
- [ ] Save operation updates Firebase correctly
- [ ] Mobile shows one modal at a time
- [ ] Responsive breakpoints work correctly
- [ ] No console errors or warnings
- [ ] Works across all supported browsers

---

## 9. Open Questions

1. **Exact Question Editor Width:** Should it be 600px, 650px, or 700px? Need to test with actual content to determine optimal width.

2. **Mobile Breakpoint:** At what exact pixel width should we switch from two-modal to one-modal? Suggest 1024px but needs UX testing.

3. **Animation Easing:** Is `ease` the best easing function, or should we use `ease-in-out` or custom cubic-bezier for more polished feel?

4. **Backdrop Overlay:** Should there be a semi-transparent backdrop behind the modals to dim the background page? Current implementation has none.

5. **Keyboard Shortcuts:** Should we add Ctrl+S for save, Esc for close editor, Arrow keys for navigation in future iteration?

6. **Question Editor Height:** Should it match Edit Quiz (80vh) or be taller (85vh) to accommodate more content?

7. **Gap Responsiveness:** Should the gap between modals reduce on smaller screens (e.g., 1rem instead of 1.5rem)?

8. **Loading States:** Should we show skeleton loaders or spinners when loading question data from Firebase?

---

## Implementation Notes

### Phase 1: Core Positioning Fix (Priority: Critical)
1. Fix modal centering logic to center both modals together as a pair
2. Implement width shrinking for Edit Quiz dialog
3. Add proper gap between modals
4. Ensure smooth animations

### Phase 2: Visual Polish (Priority: High)
1. Refine animation timing and easing
2. Add proper focus states
3. Ensure consistent styling across both modals
4. Test on multiple screen sizes

### Phase 3: Mobile Optimization (Priority: Medium)
1. Implement one-modal-at-a-time for mobile
2. Add back button to Question Editor
3. Test touch interactions
4. Optimize for tablet sizes

### Phase 4: Testing & Refinement (Priority: High)
1. Cross-browser testing
2. Performance profiling
3. User acceptance testing
4. Bug fixes and polish

---

## Related Documents

- `documentation/UI-REDESIGN-TWO-MODAL-SYSTEM.md` - Original design documentation
- `src/components/QuizEditor.jsx` - Main container component
- `src/components/EditQuizModal.jsx` - Question list modal
- `src/components/QuestionEditorPanel.jsx` - Question editing interface
- `src/pages/TeacherLobbyPage.jsx` - Parent page component

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-22 | AI Assistant | Initial PRD creation based on user requirements |

---

**Next Steps:**
1. Review and approve this PRD
2. Create detailed implementation plan
3. Begin Phase 1 development
4. Conduct testing and iteration
