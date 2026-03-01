## 2025-01-24 - Performance Optimization in High-Frequency Polling Dashboards
**Learning:** In high-frequency polling dashboards (e.g., `app/driver/page.tsx`), decoupling static lookup data from dynamic updates by fetching static data conditionally (only if state is empty or via a `useRef` flag) within a unified `Promise.all` prevents redundant load while keeping the initial loading state synchronized.
**Action:** Use `Promise.all` for parallelization and a `useRef` flag for static data to avoid unnecessary re-renders when using `useCallback` with polling.

## 2025-01-24 - Avoiding Expensive Page Reloads
**Learning:** Replacing `window.location.reload()` with targeted state updates (e.g., re-invoking a memoized `loadData` function) provides a significantly faster and smoother user experience by avoiding the overhead of a full Next.js page hydration and asset re-loading.
**Action:** Favor direct state refresh functions over full page reloads in ride action handlers.
