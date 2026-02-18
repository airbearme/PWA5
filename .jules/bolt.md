## 2025-05-14 - Parallel Fetching & Image Optimization in MapPage
**Learning:** Sequential data fetching in `useEffect` (awaiting one Supabase call after another) creates a significant waterfall delay. Moving to `Promise.all` for independent resources like `spots` and `airbears` drastically reduces the initial loading state duration. Additionally, using `next/image` with `priority` for above-the-fold mascots improves LCP.
**Action:** Always audit `useEffect` hooks for sequential `await` calls that can be parallelized. Ensure critical path images use `priority`.

## 2025-05-14 - ESM Compatibility for Jest
**Learning:** In projects with `"type": "module"` in `package.json`, Jest configuration must use the `.cjs` extension if it contains `require()` or `module.exports`. Standard `.js` files will throw `ReferenceError: module is not defined`.
**Action:** Always rename `jest.config.js` to `jest.config.cjs` in Next.js/ESM environments to ensure test runner compatibility.
