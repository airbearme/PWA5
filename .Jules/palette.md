# Palette's Journal - Critical UX Learnings

This journal tracks critical UX and accessibility learnings discovered during development.

## 2026-02-20 - Non-Chromium PWA Installation UX
**Learning:** Using native browser `alert()` for PWA installation instructions on non-Chromium platforms (like iOS Safari) is jarring and breaks brand consistency. In-app themed cards provide a much smoother user experience and allow for visual guidance using platform-specific icons (e.g., Share icon for iOS).
**Action:** Always provide a themed in-app instruction card instead of native alerts when manual user action is required for PWA installation.
