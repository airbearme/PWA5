## 2025-05-15 - Enhancing Auth Feedback Loops
**Learning:** Using generic `div` elements for error messages lacks semantic weight and visual consistency. Replacing them with specialized `Alert` components improves accessibility and ensures errors are immediately recognizable as critical feedback.
**Action:** Always prefer design-system-integrated `Alert` components over custom error `div`s.

## 2025-05-15 - Visual Loading Indicators
**Learning:** Disabling buttons during async operations prevents double-submission but can feel "stuck" without a visual spinner. Adding a `Spinner` inside the button provides active feedback that the system is processing.
**Action:** Include `Spinner` components within `Button` elements for all primary async actions.
