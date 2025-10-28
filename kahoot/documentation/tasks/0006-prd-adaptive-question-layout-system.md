# PRD: Adaptive Question Layout System

## Introduction/Overview

The Adaptive Question Layout System is an intelligent UI enhancement that automatically adjusts the layout, typography, and spacing of quiz questions to optimally fit the available screen space. This feature solves the problem of content overflow, poor readability, and inefficient space usage when displaying questions with varying content lengths.

**Problem Statement:** Teachers currently face issues where:
- Long answer options overflow the screen requiring excessive scrolling
- Short answers waste vertical space in a list layout
- Opening the passage panel (40% width) makes questions cramped
- Font sizes are fixed regardless of content density
- No visual feedback when content doesn't fit optimally

**Solution:** An intelligent layout engine that analyzes question content, available space, and context (passage panel state) to automatically select the optimal grid columns, font sizes, and layout patterns.

## Goals

1. **Eliminate unnecessary scrolling** - Questions should fit within the viewport (between header and footer) 95% of the time
2. **Maximize readability** - Never compromise legibility; enforce minimum font size of 0.75rem
3. **Optimize space usage** - Use grid layouts for short content, vertical stacking for long content
4. **Provide user control** - Show manual override controls only when auto-layout makes compromises
5. **Maintain performance** - Layout calculations should complete in <50ms, with debounced resize handling
6. **Support all question types** - Multiple choice, multiple select, matching, diagram labeling, and completion

## User Stories

1. **As a teacher**, I want questions with short answers to display in a grid layout so that I can see all options without scrolling.

2. **As a teacher**, I want long answer text to automatically reduce in size so that all content fits on screen without losing readability.

3. **As a teacher**, I want a "Reset Size" button to appear when text is scaled down so that I can view the original size if needed.

4. **As a teacher**, I want the layout to become more compact when I open the passage panel so that both passage and question remain visible.

5. **As a teacher**, I want diagram images to automatically arrange (side-by-side or stacked) based on their aspect ratio so that space is used efficiently.

6. **As a teacher**, I want matching questions to stack vertically when text is long so that items remain readable.

7. **As a teacher**, I want instant layout changes without animations so that I can navigate quickly through questions.

## Functional Requirements

### Core Layout Engine

**FR-1:** The system MUST analyze all answer options collectively to calculate average, maximum, and minimum text lengths.

**FR-2:** The system MUST determine grid columns (1, 2, or 3) based on:
- Item count (minimum 4 items for 2-column, 6 items for 3-column)
- Average text length (<40 chars = short, 40-80 = medium, >80 = long)
- Available width (adjusted for passage panel state)

**FR-3:** The system MUST apply font scaling in 4 levels:
- **Normal:** Question 1.25-1.75rem, Options 1-1.25rem
- **Medium:** Question 1.1875-1.5rem, Options 0.9375-1.125rem
- **Small:** Question 1.125-1.375rem, Options 0.875-1rem
- **Compact:** Question 1-1.25rem, Options 0.8125-0.9375rem

**FR-4:** The system MUST enforce minimum font size of 0.75rem (12px) for all text.

**FR-5:** The system MUST prioritize layout strategy based on content:
- **Most text is short** → Apply grid layout first, then font scaling if needed
- **Most text is long** → Apply font scaling first, then grid if needed

**FR-6:** The system MUST be 40% more aggressive with space-saving when passage panel is open (taking ~40% of width).

### Multiple Choice & Multiple Select

**FR-7:** The system MUST display options in a grid (2 or 3 columns) when:
- Average text length < 60 characters
- Available width > 600px (2-col) or 900px (3-col)
- Item count >= 4

**FR-8:** The system MUST display a circular badge (A, B, C, D) for multiple choice and square badge for multiple select.

**FR-9:** The system MUST show a "Reset Size" button (bottom-left) when font scale is below "normal".

**FR-10:** The system MUST support flexible grid layouts where last row can have fewer items (e.g., 3-3-2 pattern for 8 items).

### Matching Questions

**FR-11:** The system MUST display items and options side-by-side (50/50 split) when:
- Average text length < 80 characters
- Passage panel is closed OR average length < 50 characters

**FR-12:** The system MUST stack items and options vertically when:
- Most text is long (>50% of items exceed 80 chars)
- Passage panel is open AND average length > 50 characters

**FR-13:** The system MUST use compact spacing (xs) when font scale is "compact".

### Diagram Labeling

**FR-14:** The system MUST detect image aspect ratio by:
- Loading the image and measuring actual dimensions
- Calculating aspectRatio = width / height

**FR-15:** The system MUST use vertical layout (image top, labels bottom) when:
- Aspect ratio > 1.2 (horizontal/landscape image)

**FR-16:** The system MUST use horizontal layout (image left 50%, labels right 50%) when:
- Aspect ratio <= 1.2 (vertical/portrait or square image)
- Available width > 700px

**FR-17:** The system MUST display an "Expand Image" button (top-right corner of image) when image is resized.

**FR-18:** The system MUST enable scrolling when image is expanded to original size.

**FR-19:** The system MUST show a fallback placeholder with retry button if image fails to load.

### Completion (Fill-in-the-Blank)

**FR-20:** The system MUST display word banks in a grid layout when:
- Word count >= 6
- Average word length < 15 characters
- Available width > 600px

**FR-21:** The system MUST scale question text (including blanks) using the same font scale levels.

### Performance & Optimization

**FR-22:** The system MUST debounce window resize events with a 150ms delay to minimize recalculations.

**FR-23:** The system MUST complete layout calculations in <50ms for questions with up to 12 options.

**FR-24:** The system MUST use CSS `clamp()` for responsive font sizing within each scale level.

**FR-25:** The system MUST apply instant layout changes (0ms transition) for immediate feedback.

### Edge Cases

**FR-26:** The system MUST truncate options exceeding 300 characters with "..." and show full text on hover (tooltip).

**FR-27:** The system MUST use virtual scrolling or pagination for questions with >12 options.

**FR-28:** The system MUST handle mixed content (some short, some long) by using masonry/Pinterest-style grid layout.

**FR-29:** The system MUST gracefully degrade to vertical layout if grid calculation fails.

### User Controls

**FR-30:** The system MUST show "Reset Size" button ONLY when `isScaled === true`.

**FR-31:** The system MUST position reset button at bottom-left with blue background and zoom icon.

**FR-32:** The system MUST show expand image button ONLY when image is resized below original dimensions.

**FR-33:** The system MUST allow manual override to persist only for current question (reset on navigation).

## Non-Goals (Out of Scope)

1. **Mobile/Tablet Support** - This feature is designed for desktop/projector displays only (teacher view).
2. **Layout Preferences** - No saving of layout preferences; always use automatic detection.
3. **Analytics Tracking** - No logging of layout usage or performance metrics.
4. **Animations** - No animated transitions between layout changes (instant only).
5. **Student View** - This feature applies only to teacher quiz display, not student answer interface.
6. **Custom Layouts** - Teachers cannot manually configure grid columns or font sizes per question.
7. **Breakpoint Customization** - Fixed breakpoints; no user-configurable thresholds.

## Design Considerations

### Visual Hierarchy
- Question text always largest (1.25-1.75rem at normal scale)
- Option text secondary (1-1.25rem at normal scale)
- Labels/instructions tertiary (0.875-1rem at normal scale)

### Color Scheme
- Multiple choice badges: `#64748b` (slate gray)
- Multiple select badges: `#64748b` (slate gray, square)
- Matching items: `#f1f5f9` background, `#cbd5e1` border
- Matching options: `#dbeafe` background, `#3b82f6` border
- Reset button: `#3b82f6` (blue) with `IconZoomReset`

### Spacing
- Normal scale: `1rem` gap between items
- Compact scale: `0.75rem` gap between items
- Padding: `1rem` container padding at all scales

### Responsive Behavior
- Use CSS `clamp()` for fluid typography within each scale level
- Grid columns adjust based on container width (not viewport width)
- Passage panel reduces available width by ~40%

## Technical Considerations

### Hook Architecture
- **`useAdaptiveLayout`** - Custom React hook that encapsulates all layout logic
- Returns: `{ gridColumns, fontScale, isScaled, resetSize, containerRef, textMetrics, imageLayout }`
- Uses `useRef` for container measurement
- Uses `useMemo` for expensive calculations
- Uses `useEffect` for resize listener with cleanup

### State Management
- `availableHeight` - Measured container height
- `availableWidth` - Measured container width
- `isScaled` - Boolean flag when font scale < normal
- `manualOverride` - Tracks user's reset action (null | 'reset' | 'expand-image')

### Image Loading Strategy
```javascript
const [imageAspectRatio, setImageAspectRatio] = useState(null);

useEffect(() => {
  const img = new Image();
  img.onload = () => {
    setImageAspectRatio(img.width / img.height);
  };
  img.onerror = () => {
    setImageAspectRatio(1); // Default to square on error
  };
  img.src = question.diagramUrl;
}, [question.diagramUrl]);
```

### Grid Layout Implementation
```css
.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

### Dependencies
- `@mantine/core` - UI components (Box, Stack, Paper, ActionIcon)
- `@tabler/icons-react` - Icons (IconZoomReset, IconMaximize)
- `react` - Hooks (useState, useEffect, useRef, useMemo)

### File Structure
```
src/
├── hooks/
│   └── useAdaptiveLayout.js          # Core layout hook
├── components/
│   ├── questions/
│   │   ├── MultipleChoiceView.jsx    # ✅ Implemented
│   │   ├── MultipleSelectView.jsx    # ✅ Implemented
│   │   ├── MatchingView.jsx          # ✅ Implemented
│   │   ├── DiagramLabelingView.jsx   # 🔄 In Progress
│   │   └── CompletionView.jsx        # ⏳ Pending
│   ├── QuestionRenderer.jsx          # ✅ Updated
│   └── CollapsiblePassagePanel.jsx   # ✅ Updated
└── pages/
    └── TeacherQuizPage.jsx            # ✅ Updated
```

## Success Metrics

1. **Scroll Reduction** - 95% of questions fit within viewport without scrolling (measured by container height vs content height)
2. **Readability Maintained** - No font sizes below 0.75rem (12px) in production
3. **Performance** - Layout calculations complete in <50ms (measured with `performance.now()`)
4. **User Satisfaction** - Positive feedback from user testing with real teachers
5. **Edge Case Handling** - Zero layout breaks or visual glitches with extreme content (tested with 1-20 options, 1-500 chars per option)

## Open Questions

1. ~~Should we support mobile/tablet?~~ → **Resolved: Desktop only (6-C)**
2. ~~Should we track analytics?~~ → **Resolved: No tracking (8-D)**
3. ~~Should we add animations?~~ → **Resolved: Instant changes only (5-D)**
4. **How should we handle questions with embedded images in option text?** - Needs clarification
5. **Should diagram labels support rich text (bold, italic)?** - Needs clarification
6. **What's the maximum supported question text length?** - Suggest 500 chars with warning
7. **Should we support RTL languages (Arabic, Hebrew)?** - Needs clarification

## Implementation Priority

### Phase 1 (Current) ✅
- [x] Create `useAdaptiveLayout` hook
- [x] Implement MultipleChoiceView
- [x] Implement MultipleSelectView
- [x] Implement MatchingView
- [x] Update QuestionRenderer and CollapsiblePassagePanel

### Phase 2 (Next) 🔄
- [ ] Implement DiagramLabelingView with image aspect ratio detection
- [ ] Implement CompletionView with word bank grid
- [ ] Add masonry layout for mixed content (FR-28)
- [ ] Add truncation with tooltip for long options (FR-26)

### Phase 3 (Future) ⏳
- [ ] Add virtual scrolling for >12 options (FR-27)
- [ ] User testing with real teachers (12-D)
- [ ] Performance optimization and benchmarking
- [ ] Documentation and code comments

## Acceptance Criteria

✅ **AC-1:** A question with 6 short options (<30 chars each) displays in a 3-column grid.

✅ **AC-2:** A question with 4 long options (>80 chars each) displays in a vertical list with reduced font size.

✅ **AC-3:** Opening the passage panel causes the question layout to become more compact (smaller fonts or fewer columns).

✅ **AC-4:** A "Reset Size" button appears at bottom-left when font is scaled down, and clicking it restores original size.

⏳ **AC-5:** A horizontal diagram image displays with image on top and labels below.

⏳ **AC-6:** A vertical diagram image displays with image on left (50%) and labels on right (50%).

⏳ **AC-7:** An "Expand Image" button appears on resized images and clicking it shows full size with scroll.

✅ **AC-8:** A matching question with long text (>80 chars) displays items and options stacked vertically.

✅ **AC-9:** A matching question with short text (<50 chars) displays items and options side-by-side.

⏳ **AC-10:** A completion question with 8 short words displays the word bank in a grid layout.

✅ **AC-11:** All layout changes happen instantly without animation.

✅ **AC-12:** No font sizes fall below 0.75rem (12px) even with very long content.

---

**Document Version:** 1.0  
**Created:** 2025-01-22  
**Last Updated:** 2025-01-22  
**Status:** In Progress (Phase 1 Complete, Phase 2 In Progress)
