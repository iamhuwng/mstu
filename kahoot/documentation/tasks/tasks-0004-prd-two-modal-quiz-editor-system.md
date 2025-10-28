# Task List: Two-Modal Quiz Editor System

**Based on PRD:** `0004-prd-two-modal-quiz-editor-system.md`  
**Created:** October 22, 2025  
**Status:** In Progress

---

## Relevant Files

- `src/components/QuizEditor.jsx` - Main container component that manages both modals and their positioning logic
- `src/components/EditQuizModal.jsx` - Left modal showing quiz title and question list
- `src/components/QuestionEditorPanel.jsx` - Right modal for editing individual questions (no changes needed)
- `src/pages/TeacherLobbyPage.jsx` - Parent component that triggers the quiz editor (no changes needed)

### Notes

- The main issue is in `QuizEditor.jsx` which currently uses incorrect positioning logic (`transform: translateX(-25%)`)
- `EditQuizModal.jsx` needs width adjustment capability when Question Editor is visible
- No new components need to be created; only modifications to existing ones
- All existing functionality (validation, auto-save, navigation) must remain intact

---

## Tasks

- [ ] **1.0 Fix Modal Container Positioning System**
  - [ ] 1.1 Remove incorrect `transform: translateX(-25%)` from Box wrapper in `QuizEditor.jsx` (line 218)
  - [ ] 1.2 Replace `Group grow align="flex-start" noWrap` with proper flexbox centering configuration
  - [ ] 1.3 Update Modal component to use `size="auto"` and remove `centered` prop to allow custom positioning
  - [ ] 1.4 Set Modal body and content styles to `background: transparent` and `boxShadow: none` (already done, verify)

- [ ] **2.0 Implement Dynamic Width Adjustment for Edit Quiz Modal**
  - [ ] 2.1 Add `showEditor` prop to `EditQuizModal` component to receive editor visibility state
  - [ ] 2.2 Update `EditQuizModal.jsx` Paper component width from fixed `450px` to dynamic value
  - [ ] 2.3 Set width to `350px` when `showEditor` is true, `450px` when false
  - [ ] 2.4 Add CSS transition for smooth width change: `transition: 'width 0.3s ease'`
  - [ ] 2.5 Update `QuizEditor.jsx` to pass `showEditor` prop to `EditQuizModal`

- [ ] **3.0 Add Proper Centering Logic for Both Modals Together**
  - [ ] 3.1 Create wrapper div inside Modal to contain both modals with flexbox layout
  - [ ] 3.2 Set wrapper styles: `display: flex`, `justifyContent: center`, `alignItems: center`, `minHeight: 100vh`
  - [ ] 3.3 Create inner container for both modals: `display: flex`, `gap: 1.5rem`, `alignItems: flex-start`
  - [ ] 3.4 Remove Box wrapper around EditQuizModal (no longer needed for positioning)
  - [ ] 3.5 Ensure Question Editor Paper renders conditionally inside the same flex container
  - [ ] 3.6 Verify both modals are horizontally centered together as a pair on the page

- [ ] **4.0 Refine Animations and Transitions**
  - [ ] 4.1 Ensure EditQuizModal width transition is smooth (0.3s ease) - already added in task 2.4
  - [ ] 4.2 Add fade-in animation for Question Editor: `opacity` transition from 0 to 1 over 0.3s
  - [ ] 4.3 Update Question Editor Paper to include: `transition: 'opacity 0.3s ease'`
  - [ ] 4.4 Remove any transform-based animations that cause positioning issues
  - [ ] 4.5 Test animation smoothness by opening/closing editor multiple times
  - [ ] 4.6 Verify no layout shifts or janky movements during transitions

- [ ] **5.0 Test and Verify All Functionality**
  - [ ] 5.1 Test: Click "Edit" button on quiz card → Edit Quiz dialog appears centered
  - [ ] 5.2 Test: Click a question → Both modals appear centered together with correct gap (1.5rem)
  - [ ] 5.3 Test: Edit Quiz modal shrinks from 450px to 350px smoothly
  - [ ] 5.4 Test: Question Editor appears at correct width (600-700px, larger than Edit Quiz)
  - [ ] 5.5 Test: Click X button on Question Editor → Edit Quiz returns to center and expands to 450px
  - [ ] 5.6 Test: Navigate between questions using Previous/Next → content updates, modals stay positioned
  - [ ] 5.7 Test: All validation, auto-save, and save functionality still works correctly
  - [ ] 5.8 Test: Cancel and Save Changes buttons work as expected
  - [ ] 5.9 Test: Responsive behavior on smaller screens (should show one modal at a time)
  - [ ] 5.10 Verify: No console errors or warnings
  - [ ] 5.11 Verify: Animations are smooth with no jank or stuttering
  - [ ] 5.12 Verify: Visual appearance matches the PRD layout reference

---

## Implementation Notes

### Key Changes Summary

**QuizEditor.jsx:**
- Remove `Box` wrapper with `translateX` transform
- Replace `Group` with custom flex container for proper centering
- Pass `showEditor` prop to `EditQuizModal`
- Restructure layout to center both modals together as a pair

**EditQuizModal.jsx:**
- Accept `showEditor` prop
- Change width from `450px` to dynamic: `showEditor ? '350px' : '450px'`
- Add width transition: `transition: 'width 0.3s ease'`

**Layout Structure (After Fix):**
```jsx
<Modal opened={show} onClose={handleCloseAttempt} size="auto" ...>
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      <EditQuizModal showEditor={showEditor} ... />
      {showEditor && <Paper><QuestionEditorPanel ... /></Paper>}
    </div>
  </div>
</Modal>
```

### Testing Checklist
- [ ] Desktop view (>1024px): Both modals visible side-by-side
- [ ] Tablet/Mobile view (≤1024px): One modal at a time
- [ ] All animations smooth (no jank)
- [ ] Modals properly centered together
- [ ] Gap between modals is 1.5rem
- [ ] Width transitions work correctly
- [ ] All existing features intact (validation, auto-save, navigation)

---

**Status:** Sub-tasks generated. Ready for implementation.

**Estimated Effort:** 2-3 hours for a junior developer

**Priority Order:** Complete tasks 1-4 sequentially, then perform task 5 for verification.
