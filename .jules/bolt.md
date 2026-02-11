# Bolt's Journal - Performance Learnings

## 2025-05-15 - [Effect Splitting & CI Caching]
**Learning:** In Next.js App Router, combining URL synchronization with data fetching in a single `useEffect` causes redundant network requests whenever query parameters change. Additionally, GitHub Actions with `pnpm` require `pnpm/action-setup` to run BEFORE `actions/setup-node` for caching to work.
**Action:** Decouple fetch logic from URL reactivity using `useRef` and multiple effects. Always ensure CI workflows sequence pnpm setup before node setup.

## 2025-05-15 - [Jest ESM Configuration]
**Learning:** Projects with `"type": "module"` in `package.json` but a CommonJS `jest.config.js` (using `require`) will fail with `ReferenceError: require is not defined`.
**Action:** Rename `jest.config.js` to `jest.config.cjs` to allow CommonJS syntax in an ESM project.
