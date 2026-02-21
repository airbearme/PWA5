## 2025-02-12 - Parallelizing Independent Supabase Queries
**Learning:** Sequential `await` calls for independent Supabase queries (e.g., spots and rides) in the same component create unnecessary waterfalls, increasing Time to Interactive (TTI).
**Action:** Use `Promise.all()` to parallelize network requests for independent resources to significantly improve page load performance.
