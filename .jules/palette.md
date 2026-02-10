## 2025-05-22 - Improving Accessibility with Semantic Buttons

**Learning:** Interactive elements should always use semantic HTML (e.g., <button> for actions) to ensure keyboard accessibility and proper screen reader behavior. Using <div> with onClick misses out on default focus states and keyboard triggers.

**Action:** Always refactor interactive <div> elements to <button> or <a> tags and ensure they have appropriate focus styles and ARIA attributes.
