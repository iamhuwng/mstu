# PRD: Theme Selection Controls for Teacher Experience

## 1. Introduction/Overview
This feature introduces an alternate "Aurora" visual theme for teacher-facing screens, inspired by `documentation/Screenshoot/theme example.html`. Teachers (admins) must be able to switch between the current default styling and the new Aurora theme for selected pages. The new theme becomes the default presentation once configured, ensuring the teacher experience aligns with refreshed design guidelines without affecting the student interface.

## 2. Goals
- Elevate the visual appearance of teacher pages by adopting gradients, typography, and card layouts from the reference theme.
- Allow authenticated admins to toggle between the legacy theme and Aurora theme for specified teacher workflows, with Aurora persisting as the default once chosen.
- Maintain dark-mode parity so both themes render legibly in light and dark contexts.
- Provide automated validation and analytics to confirm correct theme switching and usage tracking.

## 3. User Stories
- **As a teacher/admin**, I want access to a theme selector within my configuration tools so I can preview and apply the Aurora theme to my control surfaces.
- **As a teacher/admin**, I want the Aurora theme to persist across sessions after I enable it so the experience stays consistent during future logins.
- **As a product owner**, I want analytics on theme selections so I can gauge adoption and usage patterns.

## 4. Functional Requirements
1. **Theme Targeting**: The Aurora theme must apply only to the following teacher routes: `TeacherLobbyPage`, `TeacherQuizPage`, `TeacherFeedbackPage`, and `TeacherResultsPage`.
2. **Admin-Only Control**: Theme selection must be surfaced via an admin-only configuration panel (existing or new) accessible after successful admin login.
3. **Default Persistence**: Once an admin selects Aurora, it becomes the default theme until another admin reverts to the legacy theme. Persist the selection using existing Firebase configuration/state mechanisms.
4. **Visual Fidelity**: Aurora styling must incorporate gradients, typography, and card-based layouts modeled after the reference component structure in `documentation/Screenshoot/theme example.html`, including prominent card shadows, pastel palettes, and iconography treatments.
5. **Widget Refresh**: Teacher dashboards must adopt refactored components (e.g., analytics cards, version control card layouts) that mirror the reference example where applicable, without altering underlying data integrations.
6. **Dark-Mode Support**: Provide Aurora-specific variations ensuring contrast ratios meet accessibility guidelines in both light and dark modes.
7. **Analytics Event**: Emit an analytics event (e.g., `theme_selection_changed`) whenever an admin switches themes, capturing user ID, previous theme, new theme, and timestamp.
8. **Automated Tests**: Add integration/unit tests verifying that the theme toggle updates Mantine/theming state, persists across reloads, and triggers analytics dispatch.

## 5. Non-Goals (Out of Scope)
- No changes to the student-facing UI themes or layouts.
- No introduction of additional theme variants beyond Aurora and the existing legacy theme.
- No overhaul of non-targeted teacher pages or authentication flows.

## 6. Design Considerations
- Reference palette, gradients, and component compositions directly from `documentation/Screenshoot/theme example.html`.
- Maintain responsive grid behavior consistent with existing teacher layouts while introducing card spacing and hover interactions showcased in the example.
- Ensure iconography used in the reference (e.g., `LightningIcon`, `StarIcon`) maps to available assets or acceptable substitutes.

## 7. Technical Considerations
- Integrate the Aurora theme through the existing Mantine or custom theming providers in `src/App.jsx` and shared layout components.
- Store the selected theme in Firebase Realtime Database (e.g., `app_settings/theme`) or an equivalent configuration document, ensuring listeners update affected routes in real time.
- Provide fallback styling if the theme configuration is unavailable or malformed, defaulting to the legacy theme.
- Extend current analytics instrumentation (if present) or integrate new tracking via the established analytics service.

## 8. Success Metrics
- Automated tests covering theme toggling and persistence pass in CI.
- Analytics dashboard records theme selection events for at least 95% of toggles during testing.
- UX/design review signs off on fidelity between the Aurora implementation and the reference example.

## 9. Open Questions
- Where should the admin theme selector reside (existing lobby settings drawer vs. new modal)?
- Should Aurora variations include bespoke assets (e.g., SVG illustrations), and are asset licenses approved?
- What is the expected fallback behavior if analytics services are offline when toggling themes?
