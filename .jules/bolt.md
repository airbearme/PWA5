## 2025-05-15 - Optimized Driver Dashboard Polling
**Learning:** Parallelizing Supabase queries with `Promise.all` and adding conditional checks for static data (like `spots`) in high-frequency polling loops (e.g., every 5 seconds) significantly reduces network overhead and improves UI responsiveness.
**Action:** Always check for redundant static data fetches in polling intervals and use `Promise.all` to resolve waterfalls in data-heavy dashboards.
