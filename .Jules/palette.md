## 2024-07-25 - Semantic HTML for Clickable Elements

**Learning:** Interactive elements, such as list items that trigger an action, should be implemented with `<button>` tags instead of `<div>` tags with `onClick` handlers. While visually identical, using a `<button>` is critical for accessibility. It ensures the element is focusable via keyboard navigation and is properly announced by screen readers, which is not the case with a generic `<div>`.

**Action:** In the future, when I encounter clickable `<div>` or `<span>` elements, I will refactor them to use semantic `<button>` elements to improve the application's accessibility.
