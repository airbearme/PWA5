## 2025-05-15 - Redundant database queries on critical booking path
**Learning:** Found a redundant database query in `app/book/page.tsx` that fetched an available AirBear but did not use the result in the subsequent ride creation API call. This added unnecessary latency (~100-200ms) to the ride booking process.
**Action:** Always verify if client-side database fetches are actually required for subsequent API calls, especially on performance-sensitive paths like booking.

## 2025-05-15 - Decoupling URL state from data fetching
**Learning:** Using `searchParams` as a dependency in a `useEffect` that performs data fetching (like loading spots) causes redundant network requests whenever *any* query parameter changes, even if unrelated to the fetch.
**Action:** Fetch static data (like locations) once on mount, and use a separate `useEffect` to synchronize URL-based selection state.

## 2025-05-15 - CI/CD Pipeline Standardization for Performance
**Learning:** Inconsistent package manager usage (npm vs pnpm) and missing caching in GitHub Actions significantly slow down the development feedback loop. Furthermore, build-time Zod validation of environment variables can break CI if secrets are missing.
**Action:** Standardize all workflows to use `pnpm`, enable `cache: 'pnpm'`, and provide format-compliant placeholder env vars for builds.
