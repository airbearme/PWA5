## 2026-02-03 - Accessible Location Selectors
**Learning:** Using `div` with `onClick` for interactive lists (like spot selection) makes the UI inaccessible to keyboard and screen reader users. Semantic `<button>` elements provide native focus management and ARIA support.
**Action:** Always use `<button>` for interactive list items and ensure they have descriptive `aria-label` when the text content alone isn't enough (e.g., "Select [Location] as pickup").

## 2026-02-03 - Theme-Aware UI Components
**Learning:** Hardcoded color classes like `bg-white` on decorative elements (like text separators) break visual consistency in dark mode, appearing as high-contrast "glitches".
**Action:** Prefer theme-aware Tailwind classes like `bg-card` or `bg-background` for containers and decorative overlays to ensure seamless theme transitions.
