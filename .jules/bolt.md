## 2025-05-14 - Parallelize Sequential Supabase Requests
**Learning:** Sequential `await` calls for independent Supabase queries create a network waterfall that increases Time to Interactive (TTI). Using `Promise.all` can reduce page load time by parallelizing these requests.
**Action:** Always check for independent `await` calls in data-loading hooks or effects and parallelize them.
