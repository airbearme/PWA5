## 2025-05-14 - Integrated PWA Instructions
**Learning:** Browser native alerts for PWA installation instructions (especially on iOS) are jarring and break the app's immersive feel. Users prefer integrated UI components that match the app's design system.
**Action:** Use conditional state to show inline instructions instead of `window.alert()` when a native install prompt is unavailable.

## 2025-05-14 - Mascot Accessibility
**Learning:** Purely decorative-looking links (like a mascot icon) are often overlooked for ARIA labels, making them "mystery meat" navigation for screen reader users.
**Action:** Always provide descriptive `aria-label` attributes for icon-only or image-only navigation elements.
