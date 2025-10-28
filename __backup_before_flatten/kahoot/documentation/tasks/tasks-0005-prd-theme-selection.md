## Relevant Files

- `src/main.jsx` - Mantine provider entry; injects global theme tokens and color schemes.
- `src/App.jsx` - Routing and shared layout shell; ideal for wiring theme contexts into teacher routes.
- `src/components/ThemeToggleDrawer.jsx` (new) - Admin-only UI surface for selecting the active theme.
- `src/components/theme/AuroraThemeProvider.jsx` (new) - Encapsulates Aurora design tokens, gradients, and card primitives.
- `src/components/theme/AuroraCard.jsx` (new) - Reusable card component mirroring the reference layout.
- `src/hooks/useThemeSettings.js` (new) - Encapsulates Firebase-backed theme persistence and real-time updates.
- `src/services/firebase.js` - Firebase initialization; extend with helpers for `app_settings/theme` reads/writes.
- `src/services/analytics.js` (new) - Centralized analytics dispatcher for `theme_selection_changed` events.
- `src/pages/TeacherLobbyPage.jsx` - Update layout to consume Aurora components when active.
- `src/pages/TeacherQuizPage.jsx` - Apply Aurora styling and responsive grid adjustments.
- `src/pages/TeacherFeedbackPage.jsx` - Integrate Aurora components for analytics/leaderboard cards.
- `src/pages/TeacherResultsPage.jsx` - Ensure celebratory visuals align with Aurora theme assets.
- `src/pages/__tests__/teacher-theme-toggle.test.jsx` (new) - Integration test verifying theme toggle, persistence, and analytics dispatch.

### Notes

- Colocate new tests with their subject files when practical; e.g., `TeacherLobbyPage.jsx` and `TeacherLobbyPage.theme.test.jsx` in the same directory.
- Use `npx vitest` (or `npm run test`) for unit/integration tests and `npx playwright test` for E2E validation once theme updates land.

## Tasks

- [ ] 1.0 Audit Mantine theming and teacher layout entry points
  - [x] 1.1 Review `src/main.jsx` and `src/App.jsx` to confirm how themes are currently instantiated and propagated.
  - [x] 1.2 Inventory teacher-facing shells (`TeacherLobbyPage.jsx`, `TeacherQuizPage.jsx`, `TeacherFeedbackPage.jsx`, `TeacherResultsPage.jsx`) for existing styling hooks and shared components.
  - [x] 1.3 Document required extension points (context providers, CSS modules, Mantine theme overrides) to support runtime theme switching.
  - [x] 1.4 Run baseline regression tests (`npm run test -- --runInBand`) to ensure current theme behavior remains stable prior to implementation.
- [ ] 2.0 Implement Aurora design system assets
  - [x] 2.1 Define Aurora color palette, typography, gradient tokens, and spacing scale in `src/components/theme/AuroraThemeProvider.jsx`.
  - [x] 2.2 Build reusable Aurora card, analytics, and icon wrappers (`AuroraCard.jsx`, icon mapping utilities) modeled after `documentation/Screenshoot/theme example.html`.
  - [x] 2.3 Wire dark-mode variants into theme tokens ensuring contrast compliance and hover/focus states.
  - [x] 2.4 Add unit tests validating theme token exports and component rendering snapshots under both light and dark schemes.
  - [x] 2.5 Execute the new unit tests (`npx vitest src/components/theme/__tests__`) confirming Aurora tokens render as expected.
- [ ] 3.0 Apply Aurora theme to targeted teacher pages
  - [ ] 3.1 Refactor `TeacherLobbyPage.jsx` to swap Mantine primitives for Aurora components when the theme context is Aurora.
  - [ ] 3.2 Update `TeacherQuizPage.jsx` layout to adopt Aurora gradients, collapsible passage styling, and footer accents.
  - [ ] 3.3 Refresh `TeacherFeedbackPage.jsx` widgets (analytics, player lists, rocket chart container) with Aurora cards and typography.
  - [ ] 3.4 Rework `TeacherResultsPage.jsx` celebratory screen to leverage Aurora visuals while preserving animations.
  - [ ] 3.5 Create regression tests or storybook snapshots confirming layout integrity across themes for each updated page.
  - [ ] 3.6 Run page-level test suites (`npx vitest src/pages/Teacher*.theme.test.jsx`) ensuring both themes render without errors.
- [ ] 4.0 Build admin-controlled theme management with Firebase persistence
  - [ ] 4.1 Create `useThemeSettings.js` hook to read/write `app_settings/theme` from Firebase, exposing loading/error states.
  - [ ] 4.2 Implement `ThemeToggleDrawer.jsx` (or extend existing admin settings UI) to present theme options post-login.
  - [ ] 4.3 Ensure selecting Aurora updates Firebase, triggers optimistic UI updates, and defaults future sessions to Aurora.
  - [ ] 4.4 Handle fallback logic when Firebase is unreachable, reverting gracefully to legacy theme with user feedback.
  - [ ] 4.5 Add integration tests confirming theme persistence across reloads and admin scoping (students remain unaffected).
  - [ ] 4.6 Execute integration suite (`npx vitest src/hooks/useThemeSettings.test.js`) to verify Firebase persistence logic.
- [ ] 5.0 Instrument analytics and automated validation
  - [ ] 5.1 Implement `src/services/analytics.js` (or extend existing service) to emit `theme_selection_changed` with metadata.
  - [ ] 5.2 Hook analytics dispatch into theme toggle workflow and add unit tests ensuring the payload matches specification.
  - [ ] 5.3 Expand Playwright flow to toggle themes, reload session, and verify Aurora defaults correctly.
  - [ ] 5.4 Validate dark-mode parity manually and capture acceptance evidence for UX sign-off.
  - [ ] 5.5 Run combined automated checks (`npm run test && npx playwright test`) to confirm analytics, persistence, and UI flows after implementation.

## Acceptance Criteria

- Aurora theme can be enabled by an authenticated admin via `ThemeToggleDrawer.jsx`, persists to Firebase, and applies instantly across `TeacherLobbyPage.jsx`, `TeacherQuizPage.jsx`, `TeacherFeedbackPage.jsx`, and `TeacherResultsPage.jsx` without requiring reloads.
- Legacy theme remains the default for non-admin sessions; student-facing routes never load Aurora components.
- Failed Firebase writes surface a non-blocking error toast while preserving the last known theme locally.
- `theme_selection_changed` analytics events emit with `theme`, `actor`, and `timestamp` fields and appear in the analytics debugger.
- All unit, integration, and E2E tests listed in sections 3.0–5.0 run green in CI.

## Success Metrics & Observability

- Theme switch latency under 300ms end-to-end for teacher clients on broadband connections.
- At least 95% of teacher sessions adopt Aurora within two weeks of release (tracked via analytics).
- Zero increase in support tickets related to readability or contrast compared to baseline month prior to release.
- Playwright screenshot diffs show no layout regressions between legacy and Aurora themes across supported breakpoints.

## Risks & Mitigations

- **Firebase latency:** Cache the last persisted theme locally and debounce writes to reduce contention.
- **Mantine/Aurora parity gaps:** Maintain a migration checklist per page to ensure component coverage before enabling Aurora by default.
- **Accessibility regressions:** Run axe and manual WCAG spot checks for color contrast, providing alternate tokens if failures appear.
- **Analytics data drift:** Add unit tests around the analytics payload schema and monitor telemetry dashboards during rollout.

## Open Questions

- Should the Aurora theme be rolled out gradually via feature flags or immediately upon admin opt-in?
- What is the fallback plan if Aurora assets inflate bundle size beyond acceptable thresholds?
- Do we need student-facing previews or upsell messaging when teachers enable Aurora?
- How will we capture qualitative feedback from teachers post-launch (e.g., in-app survey, support follow-up)?
