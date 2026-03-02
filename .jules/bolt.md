## 2025-05-23 - Targeted Refreshes vs. Full Reloads
**Learning:** In interactive dashboards with high-frequency polling (e.g., Driver Dashboard), using `window.location.reload()` for state updates causes significant latency and redundant data fetching. Decoupling static data (like location lists) from dynamic updates and using memoized refresh functions instead of reloads significantly improves TTI and UX.
**Action:** Replace `window.location.reload()` with local state refresh functions and use `useRef` flags to skip redundant fetches of static data within polling loops.
