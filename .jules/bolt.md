## 2025-05-14 - ESM Compatibility and Throttled Geolocation
**Learning:** In a project with `"type": "module"`, all CommonJS scripts using `require()` must use the `.cjs` extension to function in Node.js environments. Additionally, high-frequency GPS updates can overwhelm Supabase/PostgreSQL if not throttled, but a leading + trailing edge throttle ensures real-time responsiveness without data loss.
**Action:** Always check `package.json` for `type: module` before writing utility scripts, and prioritize `pnpm` in CI for better performance.
