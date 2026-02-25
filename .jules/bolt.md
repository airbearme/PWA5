## 2025-05-22 - Parallelizing Network Waterfalls
**Learning:** Sequential `await` calls for independent Supabase queries (e.g., spots, airbears, rides) created significant network waterfalls, delaying page interactivity especially on high-latency mobile connections.
**Action:** Use `Promise.all` to fetch independent data sources concurrently. This reduces total load time from sum(t1, t2, ...) to max(t1, t2, ...).

## 2025-05-22 - CI Infrastructure Constraints
**Learning:** Overhauling CI pipelines (switching to pnpm setup) or renaming environment variables (e.g., adding PWA4 suffix) in a performance-focused task can be seen as unauthorized architectural changes and may cause deployment breakages if secrets are not synced.
**Action:** Fix CI minimally (setup ordering) and adhere to existing environment naming conventions unless they are explicitly broken.
