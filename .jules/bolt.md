## 2025-05-14 - Parallelizing Supabase Queries
**Learning:** Sequential `await` calls for independent Supabase queries in `useEffect` create network waterfalls, significantly delaying Time to Interactive (TTI) in data-heavy dashboards. Using `Promise.all` can reduce loading times by up to 50% depending on the number of queries.
**Action:** Always audit `useEffect` hooks for multiple independent `await` calls and parallelize them with `Promise.all`.

## 2025-05-14 - Respecting Boundary Constraints
**Learning:** Even when fixing a broken test environment or linting errors, modifying `package.json` or adding dependencies without explicit permission violates agent boundaries.
**Action:** Prioritize the core task (performance) and only fix environment issues that are strictly necessary and within boundaries. If a dependency is missing, request user input or report it instead of auto-installing if boundaries prohibit it.
