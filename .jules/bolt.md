## 2026-03-07 - Driver Dashboard Optimization
**Learning:** Sequential data fetching in polling intervals creates significant network overhead and perceived latency. Parallelizing requests with `Promise.all` and using `useRef` for static data caching drastically improves performance. Also, `maybeSingle()` in Supabase is safer than `single()` for optional data.
**Action:** Always parallelize fetches in components that use polling, and cache static lookup data like 'spots' or 'locations' using refs to avoid redundant API calls.
