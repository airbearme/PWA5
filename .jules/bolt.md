## 2025-05-22 - Driver Dashboard Optimization
**Learning:** Using `maybeSingle()` instead of `single()` when fetching an active ride prevents unhandled 406 errors when no ride exists. Additionally, combining `useRef` for caching static metadata with `Promise.all` for parallel requests significantly reduces network overhead and latency in polling dashboards.
**Action:** Always use `maybeSingle()` for optional record fetching in Supabase and implement ref-based caching for static data in frequent polling scenarios.
