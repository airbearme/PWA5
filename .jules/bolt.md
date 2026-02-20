## 2025-05-14 - [Parallelize Independent Data Fetches]
**Learning:** Sequential await calls for independent data resources (e.g., Supabase queries) create unnecessary bottlenecks and increase Time to Interactive (TTI). Parallelizing them with `Promise.all` is a low-risk, high-impact optimization.
**Action:** Always check `useEffect` or Server Components for multiple sequential `await` calls to external services and parallelize them when they don't depend on each other.

## 2025-05-14 - [Environment Hygiene]
**Learning:** Creating log files or renaming configuration files (like `jest.config.js` to `jest.config.cjs`) in the repository root can be flagged during code review as "unprofessional" or "out-of-scope" even if done to debug or run tests.
**Action:** Keep the repository clean of temporary logs and restore any infrastructure files modified for local testing before submitting.
