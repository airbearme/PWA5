## 2025-05-15 - Polling Dashboard Optimization
**Learning:** In high-frequency polling dashboards (e.g., app/driver/page.tsx), fetching static lookup data (like `spots`) in every poll creates unnecessary network overhead and database load. Additionally, sequential `await` calls for independent data sources (rides, status) multiply the total latency of the poll.
**Action:** Decouple static data fetching using a `useRef` flag to fetch only once. Parallelize independent queries using `Promise.all` to minimize response time. Replace `window.location.reload()` with targeted state-refresh functions to provide a seamless, instantaneous UI update without the performance penalty of a full page reload.

## 2025-05-15 - Jest ESM Compatibility in Next.js
**Learning:** In a project with `"type": "module"`, Jest often fails with `require is not defined` or configuration parsing errors when using `.js` files.
**Action:** Use `jest.config.cjs` and `jest.setup.cjs` to ensure compatibility. When using `jsdom` with ESM, explicit installation of `jest-environment-jsdom` and using `require` for polyfills (like `cross-fetch`) in the setup file is more reliable than ES imports in some environments.
