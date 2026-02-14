## 2025-05-15 - Improving Accessibility and Motion in Ride Booking

**Learning:** Interactive lists implemented with `div` tags lack keyboard accessibility and screen reader support. Using semantic `button` elements with `w-full` and `text-left` maintains the layout while providing native focus and ARIA support. Additionally, abrupt UI appearances (like the Ride Summary card) can be smoothed with Tailwind's `animate-in` utilities to improve perceived quality.

**Action:** Always audit interactive lists for semantic HTML. If an element is clickable, it should likely be a `button`. Use `aria-label` for buttons that contain dynamic or complex content to ensure clarity for screen readers.
