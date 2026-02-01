## 2024-05-22 - [Optimizing React Component Scope and Data Fetching]
**Learning:** Pure utility functions (like coordinate math) defined inside React components are re-created on every render, adding overhead. More importantly, data fetching effects that depend on broad search parameters can trigger redundant network requests if not properly decoupled.
**Action:** Move pure utilities outside the component. Split `useEffect` hooks so that data fetching only depends on core identity/auth state, and local parameter handling is separate.

## 2024-05-22 - [Memoization of High-Frequency Presentational Components]
**Learning:** Components with CSS animations (like `AirbearWheel`) can trigger re-renders of the entire component tree if the parent state updates (e.g., a timer or input).
**Action:** Wrap such presentational components in `React.memo` to prevent UI thread stuttering during parent updates.
