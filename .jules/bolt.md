## 2025-01-31 - [Isolating Search Params in useEffect]
**Learning:** In Next.js, `useSearchParams()` returns a new object on every render if ANY parameter changes. If a `useEffect` fetching data depends on `searchParams`, it will trigger redundant network requests even for unrelated parameter changes (e.g., zoom levels, analytics tokens).
**Action:** Split data-fetching into a `useEffect` with an empty dependency array (or specific stable IDs) and handle URL-based state updates in a separate `useEffect` depending on `[searchParams, data]`.

## 2025-01-31 - [ESM and CommonJS Compatibility in Scripts]
**Learning:** In an ES Module project (`"type": "module"` in package.json), scripts using `require()` must use the `.cjs` extension. This applies to Jest configurations and utility scripts in `scripts/`.
**Action:** Standardize internal scripts with `.cjs` and update references in `package.json` to ensure compatibility.
