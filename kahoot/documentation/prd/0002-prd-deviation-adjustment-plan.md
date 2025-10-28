# PRD Deviation Adjustment Plan

**Date:** 2025-10-18
**Related PRD:** 0001-prd-interactive-learning-app.md
**Status:** Planning

---

## Executive Summary

This document outlines the plan to bring the current quiz page implementation into full compliance with PRD 0001. The current implementation achieves ~70% compliance, with core mechanics working well but significant layout and content display deviations that impact the IELTS-focused use case.

---

## Critical Deviations Identified

### 1. Teacher Quiz Layout Structure (FR-2.4)
**Current State:**
- Left panel: Question display + Live student answers
- Right panel: Rocket Race + Controls + Players list
- No dedicated passage/material display

**PRD Requirement:**
- Left column: Questions and answer choices
- Right column: Passage/material (reading passages, maps, diagrams)
- Resizable border between columns
- Must stack vertically on smaller screens

**Impact:** HIGH - Blocks IELTS reading comprehension functionality

---

### 2. Missing Passage/Material Display (FR-2.4)
**Current State:**
- Placeholder text "Passage/Material" exists but not implemented
- No rendering of quiz passage content
- No support for images, maps, or diagrams

**PRD Requirement:**
- Display full passages from quiz data
- Support for images (maps, diagrams)
- Visible only on teacher screen (students don't see passage)

**Impact:** CRITICAL - Core IELTS functionality missing

---

### 3. Answer Aggregation Format (FR-2.4)
**Current State:**
- Shows individual student answers with names
- Format: "Student 1: A ✓ Points: 100"

**PRD Requirement:**
- Aggregated counts per choice for MCQ
- Format: "A: 5 students, B: 3 students, C: 2 students"
- List of submitted answers for completion questions

**Impact:** MEDIUM - Affects teacher's ability to gauge class understanding at a glance

---

### 4. Missing Question Types (FR-3.3)
**Current State:**
- Multiple Choice: ✅ Implemented
- Multiple Select: ✅ Implemented
- Completion (word bank): ✅ Implemented
- Completion (typed): ❌ Missing
- Matching: ⚠️ Placeholder only
- Diagram/Map Labeling: ❌ Not found

**PRD Requirement:**
- All IELTS Reading & Listening formats must be supported

**Impact:** HIGH - Incomplete question type coverage

---

### 5. IP Ban Management Panel (FR-2.4)
**Current State:**
- Placeholder section exists
- No actual functionality

**PRD Requirement:**
- List of banned IPs
- "Unban" button for each IP
- Persistent across session

**Impact:** LOW - Nice to have for classroom management

---

### 6. Student Question Display Verification
**Current State:**
- Unclear if students see full question text or just answer buttons
- PRD emphasizes students should look at teacher's projected screen

**PRD Requirement:**
- Students see only minimal controls (A, B, C, D buttons)
- Full question text projected by teacher only
- Mobile-first, minimal interface

**Impact:** MEDIUM - Affects intended classroom experience

---

## Adjustment Strategy

### Phase 1: Layout Restructuring (High Priority)
**Goal:** Fix teacher quiz view layout to match PRD specifications

**Changes:**
1. Restructure TeacherQuizPage two-column layout:
   - **Left column:** Question area
     - Question text and answer choices
     - Timer display
     - Live answer aggregation (counts, not individual names)

   - **Right column:** Passage/Material area
     - Passage content from quiz data
     - Support for text passages
     - Support for images (maps, diagrams)
     - Placeholder when no passage

2. Move current right-panel content:
   - Rocket Race chart → Below the two-column layout (full width)
   - Teacher Control Panel → Below Rocket Race
   - Players List → Below controls or in a collapsible panel

3. Ensure resizable border works between left/right columns
4. Implement responsive stacking for mobile

**Acceptance Criteria:**
- Layout matches PRD specification exactly
- Resizable border functional (ResizableBox already implemented)
- Responsive design stacks vertically on screens < 768px

---

### Phase 2: Passage/Material Rendering (Critical Priority)
**Goal:** Implement passage display functionality

**Changes:**
1. Update quiz JSON schema to include passage field:
   ```json
   {
     "title": "Quiz Title",
     "passage": {
       "type": "text" | "image" | "both",
       "content": "Full passage text here...",
       "imageUrl": "optional-url-to-diagram.png",
       "caption": "Optional caption"
     },
     "questions": [...]
   }
   ```

2. Create PassageRenderer component:
   - Handles text rendering with proper formatting
   - Handles image rendering with zoom/modal support
   - Handles combined text + image
   - Responsive design

3. Integrate into TeacherQuizPage right column

4. Update comprehensive-mock-quiz.json with sample passages

**Acceptance Criteria:**
- Text passages render correctly
- Images display with proper sizing
- Component is reusable and well-tested

---

### Phase 3: Answer Aggregation (Medium Priority)
**Goal:** Display aggregated answer counts instead of individual student answers

**Changes:**
1. Create aggregation utility function:
   - Input: Array of student answers
   - Output: Count object (e.g., `{A: 5, B: 3, C: 2}`)

2. Update "Live Student Answers" panel:
   - For MCQ: Show "A: 5 students, B: 3, C: 2"
   - For Multiple Select: Show each option with count
   - For Completion: Show list of unique answers with counts
   - Add visual bar indicators for proportions

3. Optional: Add toggle to switch between aggregated and individual view

**Acceptance Criteria:**
- Aggregation displays correctly for all question types
- Updates in real-time as students submit
- Visually clear and easy to read

---

### Phase 4: Complete Missing Question Types (High Priority)
**Goal:** Implement all remaining IELTS question types

#### 4A: Matching Questions
**Changes:**
1. Implement MatchingView component:
   - Display list of items to match
   - Dropdown for each item showing available answers
   - Support for reusable answers (multiple items can select same answer)

2. Update AnswerInputRenderer for student side:
   - Show dropdowns with answer choices
   - Submit button

3. Add scoring logic for matching questions

4. Create test cases

**Acceptance Criteria:**
- Students can match items using dropdowns
- Supports reusable answers flag
- Scoring calculates partial credit correctly

#### 4B: Typed Completion Questions
**Changes:**
1. Update CompletionView to support typed input:
   - Check if question has `wordBank` field
   - If no word bank: render text input fields for blanks
   - Apply case-insensitive, trimmed matching

2. Update scoring to handle typed answers

3. Add validation for typed answers

**Acceptance Criteria:**
- Text inputs render correctly for blanks
- Answer matching is case-insensitive
- Whitespace trimmed before comparison

#### 4C: Diagram/Map Labeling
**Changes:**
1. Define JSON structure:
   ```json
   {
     "type": "diagram-labeling",
     "question": "Label the parts of the diagram",
     "diagramUrl": "path-to-diagram.png",
     "labels": [
       {
         "id": "1",
         "sentence": "This part is responsible for...",
         "answer": "heart",
         "inputType": "completion" | "mcq"
       }
     ]
   }
   ```

2. Create DiagramLabelingView:
   - Teacher sees: Diagram + list of labeling sentences
   - Student sees: List of sentences with input fields (no diagram)

3. Update QuestionRenderer routing

**Acceptance Criteria:**
- Diagram visible only on teacher screen
- Students see numbered sentences with input controls
- Scoring works correctly

---

### Phase 5: Student View Optimization (Medium Priority)
**Goal:** Ensure student interface matches PRD "minimal interface" requirement

**Changes:**
1. Review StudentQuizPage:
   - Verify question text is NOT shown for MCQ (students should see only A, B, C, D)
   - Ensure timer is visible
   - Confirm mobile-first responsive design

2. For question types requiring text (completion, matching):
   - Show minimal context only
   - Keep interface clean and simple

3. Test on actual mobile devices

**Acceptance Criteria:**
- MCQ shows only answer buttons (no question text)
- Other question types show minimal necessary context
- Interface is touch-friendly and mobile-optimized

---

### Phase 6: IP Ban Management (Low Priority)
**Goal:** Complete IP ban management UI

**Changes:**
1. Create IPBanPanel component:
   - Displays list of banned IPs from game session
   - "Unban" button for each IP
   - Confirmation dialog before unbanning

2. Integrate into TeacherQuizPage

3. Connect to Firebase banned IPs data structure

**Acceptance Criteria:**
- Banned IPs display in list
- Unban functionality works
- Persists across page refreshes

---

## Implementation Order

### Sprint 1: Layout & Passage Display
1. Phase 1: Layout Restructuring
2. Phase 2: Passage/Material Rendering

**Rationale:** These are the most critical deviations affecting core IELTS functionality

---

### Sprint 2: Answer Display & Missing Question Types
3. Phase 3: Answer Aggregation
4. Phase 4A: Matching Questions
5. Phase 4B: Typed Completion

**Rationale:** Complete question type coverage and improve teacher UX

---

### Sprint 3: Polish & Additional Features
6. Phase 4C: Diagram/Map Labeling
7. Phase 5: Student View Optimization
8. Phase 6: IP Ban Management

**Rationale:** Final touches and lower-priority features

---

## Risk Assessment

### High Risk
- **Layout restructuring may break existing functionality**
  - Mitigation: Thorough testing after each change, git commits per phase

- **Passage rendering may have performance issues with large content**
  - Mitigation: Implement lazy loading, image optimization

### Medium Risk
- **Quiz JSON schema changes may invalidate existing quizzes**
  - Mitigation: Make passage field optional, provide migration script

### Low Risk
- **Matching question complexity**
  - Mitigation: Follow established pattern from existing question types

---

## Testing Strategy

### Unit Tests
- PassageRenderer component
- Answer aggregation utility
- Each new question type component
- Scoring logic for new question types

### Integration Tests
- TeacherQuizPage layout rendering
- Student-teacher real-time sync
- Answer submission flow for all question types

### Manual Testing
- Responsive design on multiple screen sizes
- Actual quiz session with 5+ test users
- All question types in a single quiz

---

## Success Criteria

1. ✅ Teacher quiz view layout matches PRD exactly
2. ✅ Passages display correctly on teacher screen
3. ✅ Answer aggregation shows counts, not individual answers
4. ✅ All 5 IELTS question types functional
5. ✅ Student interface is minimal (only answer controls visible)
6. ✅ IP ban management UI complete
7. ✅ All tests pass
8. ✅ Full quiz session with 5+ users completes successfully

---

## Timeline Estimate

- **Sprint 1:** 2-3 days (Layout + Passage Display)
- **Sprint 2:** 2-3 days (Aggregation + Question Types)
- **Sprint 3:** 1-2 days (Polish + Features)

**Total:** 5-8 days of focused development

---

## Open Questions

1. Should we support multiple passages per quiz (one per question) or one passage for entire quiz?
   - **Recommendation:** Support both - passage at quiz level OR question level

2. For diagram labeling, should we support clickable hotspots on the image?
   - **Recommendation:** Phase 2 feature - start with sentence-based approach per PRD

3. Should answer aggregation be the default, or should we offer a toggle?
   - **Recommendation:** Aggregation as default, individual view as optional enhancement

---

## Dependencies

- Existing codebase must remain functional during changes
- Firebase data structure may need updates
- Quiz JSON schema requires extension
- Test coverage must be maintained/improved

---

## Conclusion

This plan addresses all identified PRD deviations in a structured, phased approach. By prioritizing layout and passage display first, we ensure the core IELTS use case is supported, then build out remaining question types and polish the experience. Following this plan will bring the implementation to 100% PRD compliance while maintaining code quality and test coverage.
