## 2024-05-22 - [Accessibility in Selection Lists]
**Learning:** Using `div` with `onClick` for interactive elements like location selectors is a major accessibility hurdle. Screen readers won't identify them as interactive, and keyboard users can't tab to them.
**Action:** Always use semantic `<button>` elements for selectable items. Use `w-full text-left` to maintain list layout, and ensure `focus-visible` styles are prominent.

## 2024-05-22 - [Dark Mode Consistency]
**Learning:** Hardcoded `bg-white` in UI elements like separators or labels inside themed cards will break visual consistency in dark mode.
**Action:** Use theme-aware utility classes like `bg-card` or `bg-background` to ensure elements blend correctly across themes.
