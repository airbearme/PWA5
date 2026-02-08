## 2025-05-15 - [Accessible Interactive Lists]
**Learning:** Using `div` with `onClick` for list items prevents keyboard navigation and screen reader accessibility. Refactoring to `button` elements with `type="button"` and `focus-visible` styles is essential for a compliant PWA experience.
**Action:** Always use semantic `button` elements for interactive list items. Ensure they have clear `aria-label` and handle `disabled` states during async operations.
