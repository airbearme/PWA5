## 2025-05-14 - Semantic Interactive Elements and Dark Mode Consistency

**Learning:** Interactive elements implemented as `div` tags with `onClick` handlers are invisible to keyboard users and screen readers. Additionally, hardcoded `bg-white` on decorative elements (like separators) breaks visual immersion in dark mode.

**Action:** Always use `<button type="button">` for interactive selections with explicit focus rings. Use theme-aware classes like `bg-card` for background-matching elements to ensure they look correct in both light and dark themes.
