## 2025-05-15 - Accessible Keyboard-Triggered Tooltips
**Learning:** Tooltips on icon-only elements must be discoverable via keyboard focus, not just mouse hover. Using Tailwind's `group` and `group-focus-visible` classes allows tooltips to appear automatically when a user tabs to the element, providing critical context for screen reader and keyboard-only users.
**Action:** Always wrap icon-only interactive elements in a `group` and apply `group-hover:opacity-100 group-focus-visible:opacity-100` to the tooltip container to ensure parity between mouse and keyboard experiences.
