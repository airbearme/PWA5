## 2026-02-19 - Sequential Fetching Bottleneck in Map Page
**Learning:** Found that `app/map/page.tsx` was fetching `spots` and `airbears` sequentially using `await` in a `useEffect` hook, which caused a network waterfall and increased Time to Interactive (TTI).
**Action:** Use `Promise.all` to parallelize independent data fetches from Supabase to reduce load time.

## 2026-02-19 - GitHub Actions pnpm Setup Pattern
**Learning:** GitHub Actions workflows using `actions/setup-node` with `cache: 'pnpm'` fail if `pnpm` is not already installed and in the PATH. Additionally, workflows using `npm ci` or `cache: npm` fail in this repository because only `pnpm-lock.yaml` is present.
**Action:** Always place `pnpm/action-setup` before `actions/setup-node` and ensure all workflows use `pnpm` commands (`pnpm install --frozen-lockfile`, `pnpm run`, etc.) instead of `npm`.
