## 2025-05-15 - [Refactoring interactive divs to semantic buttons]
**Learning:** In the AirBear PWA, several interactive list items (like spot selections) were implemented as `div` elements, making them inaccessible to keyboard and screen reader users.
**Action:** Always refactor interactive `div` elements to semantic `<button type="button">` elements. Use Tailwind classes `w-full` and `text-left` to maintain the block-level layout and alignment previously provided by the `div`. Leverage the `animate-in` plugin for smooth transitions when new UI elements (like summary cards) appear.
