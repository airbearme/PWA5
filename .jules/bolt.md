## 2025-05-22 - [ESM vs CommonJS in Scripts]
**Learning:** Utility scripts in the `scripts/` directory using `require()` fail because `package.json` specifies `"type": "module"`. Renaming them to `.cjs` allows them to run as CommonJS, but may break `package.json` scripts that hardcode the `.js` extension.
**Action:** Prefer converting scripts to ESM or ensuring all references are updated when renaming to `.cjs`.

## 2025-05-22 - [Performance: Redundant Data Fetching]
**Learning:** Decoupling data fetching from URL parameter synchronization in React components significantly reduces redundant network requests, especially when using `useSearchParams` which can trigger effects on unrelated URL changes.
**Action:** Separate `useEffect` for data fetching (run once) and URL sync (run on searchParams change), and use ID comparison to prevent redundant state updates.
