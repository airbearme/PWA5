# Bolt's Journal - Performance Optimization Learnings

## 2025-05-14 - ESM Compatibility for Dev Tools
**Learning:** In a project with `"type": "module"`, CommonJS configuration files like `jest.config.js` must be renamed to `jest.config.cjs` to be correctly loaded by tools like Jest. Additionally, missing test dependencies like `jest-environment-jsdom` must be manually installed.
**Action:** Always check `package.json` for `"type": "module"` and ensure configuration files use the correct extension.

## 2025-05-14 - Non-deterministic Tailwind Merge Tests
**Learning:** `tailwind-merge` (used in the `cn` utility) can produce non-deterministic class order, which causes unit tests using `toBe()` on strings to fail intermittently.
**Action:** Verify class names in tests by splitting, sorting, and joining the strings (e.g., `result.split(' ').sort().join(' ')`) to ensure order-independence.
