# Bolt's Performance Journal

## 2025-05-22 - [Optimizing BookRidePage]
**Learning:** In Next.js App Router, `searchParams` can change frequently. If data fetching is tied to `searchParams` in a `useEffect`, it can cause redundant network requests. Decoupling the fetch logic from the selection/URL-sync logic is a critical performance pattern.
**Action:** Always check if `useEffect` dependencies from hooks like `useSearchParams` are causing unnecessary re-fetches.

## 2025-05-22 - [Strict Boundaries on Dependencies]
**Learning:** Adding dev dependencies (like `jest-environment-jsdom`) or modifying `package.json` for environment fixes is prohibited even if it blocks verification. Bolt must prioritize "one small performance improvement" and stay within boundaries.
**Action:** If tests are broken, report them but do not attempt to fix them by adding new dependencies or modifying core config unless explicitly instructed.
