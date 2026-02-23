## 2026-02-23 - Parallelize independent Supabase queries
**Learning:** Sequential 'await' calls for independent Supabase queries create unnecessary network waterfalls, increasing page load time (TTI). This pattern was prevalent in main dashboard views.
**Action:** Always use Promise.all() for multiple independent data fetches in Next.js pages or components to parallelize network requests. Use maybeSingle() instead of single() when a record might not exist to avoid unnecessary error handling logic in parallel blocks.
