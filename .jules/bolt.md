## 2025-05-14 - Optimized polling with useRef for static data
**Learning:** In high-frequency polling loops (e.g., Driver Dashboard fetching every 5s), decoupling static lookup data (like 'spots') from dynamic updates significantly reduces redundant API load. Using a `useRef` flag to track whether static data has been loaded allows for a clean `useCallback` that doesn't trigger infinite re-render loops even when the state it updates is in the dependency array.
**Action:** Use `useRef` to gate static data fetching within polling functions to ensure they only run once per component lifecycle.
