# Bolt's Performance Journal ⚡

## 2025-05-14 - React Hook and Calculation Optimization in Book Page
**Learning:** In Next.js App Router, `searchParams` changes trigger re-renders. If expensive calculations or `useEffect` hooks that perform data fetching are not properly memoized or decoupled from selection logic, it leads to significant main-thread blocking and redundant network requests.
**Action:** Always move static utility functions outside the component scope. Use `useMemo` for derived values like distances or fares. Split `useEffect` hooks so that data fetching (mount-only) is separate from synchronization logic (parameter-dependent).

## 2025-05-14 - Jest ESM Compatibility
**Learning:** In a project with `"type": "module"`, Jest configuration files must use the `.cjs` extension if they contain `module.exports` or `require`, even if the rest of the project is ESM.
**Action:** Use `jest.config.cjs` to ensure stability and compatibility with modern ESM features and `@testing-library/jest-dom` matchers.
