# Palette's Journal - Critical UX Learnings

This journal tracks critical UX and accessibility learnings discovered during development.

## 2026-02-20 - Non-Chromium PWA Installation UX
**Learning:** Using native browser `alert()` for PWA installation instructions on non-Chromium platforms (like iOS Safari) is jarring and breaks brand consistency. In-app themed cards provide a much smoother user experience and allow for visual guidance using platform-specific icons (e.g., Share icon for iOS).
**Action:** Always provide a themed in-app instruction card instead of native alerts when manual user action is required for PWA installation.

## 2026-02-20 - GitHub Actions pnpm Setup Order
**Learning:** In GitHub Actions, when using `actions/setup-node` with `cache: 'pnpm'`, the `pnpm/action-setup` step MUST come first. Otherwise, `setup-node` fails because it cannot find the `pnpm` executable to calculate the cache key from `pnpm-lock.yaml`. Additionally, repositories using `pnpm` will fail if configured with `cache: 'npm'` as it expects `package-lock.json`.
**Action:** Always ensure `pnpm/action-setup` precedes `actions/setup-node` and that the cache type is set to `pnpm`.
