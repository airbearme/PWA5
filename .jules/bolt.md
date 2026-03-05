## 2026-03-05 - Driver Dashboard Optimization
**Learning:** Sequential Supabase queries and redundant fetching of static metadata (like spots) during frequent polling intervals (5s) cause unnecessary latency and server load. Using `maybeSingle()` instead of `single()` prevents unhandled 406 errors when zero rows are expected.
**Action:** Always parallelize independent fetches with `Promise.all` and use `useRef` to cache static metadata in components with polling logic. Prefer `maybeSingle()` for single-row lookups that may legitimately return no result.
