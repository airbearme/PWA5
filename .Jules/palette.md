## 2025-05-15 - [A11y & Performance Patterns]
**Learning:** Found that using non-semantic `div` elements for selection lists breaks keyboard navigation and screen reader utility. Additionally, legacy `<img>` tags in Next.js 15 projects lack optimization features like automatic resizing and lazy loading, which can be easily resolved with `<Image />`.
**Action:** Always refactor interactive tiles to `<button>` with proper focus styles and `aria-label`. Prioritize `next/image` for all decorative and informative assets.
