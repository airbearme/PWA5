## 2025-05-14 - [Booking flow accessibility and micro-interactions]
**Learning:** Using non-semantic elements like `div` for location selection tiles prevents keyboard navigation and screen reader access. Refactoring these to `button` elements with explicit `aria-label` improves accessibility significantly. Additionally, adding subtle `framer-motion` animations to conditionally rendered cards (like Ride Summary) provides better visual feedback and delight during a multi-step booking process.

**Action:** Always prefer semantic `button` elements for interactive tiles. Use `aria-live="polite"` on summary sections that appear based on user interaction to ensure screen readers announce the new content.
