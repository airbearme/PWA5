## 2025-12-30 - Driver Dashboard Optimization
**Learning:** Sequential data fetching with `.single()` in a polling loop creates both performance bottlenecks (additive latency) and unnecessary error logging (when no row exists). Parallelizing with `Promise.all` and switching to `.maybeSingle()` for the active ride query significantly improves dashboard responsiveness and log hygiene.
**Action:** Always parallelize unrelated Supabase queries and prefer `.maybeSingle()` for optional data fetching to prevent 406 errors.

## 2025-12-30 - UI Refresh Pattern
**Learning:** Using `window.location.reload()` in a PWA context destroys the "native" feel and introduces high overhead.
**Action:** Memoize data-loading functions with `useCallback` and call them directly in event handlers for instantaneous state updates without full page reloads.
