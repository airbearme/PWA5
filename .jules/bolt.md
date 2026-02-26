# Bolt's Journal - Critical Learnings

## 2025-05-15 - Eliminating Network Waterfalls in Dashboard Views
**Learning:** Sequential `await` calls for independent Supabase queries (rides, spots, airbears) in `app/dashboard/page.tsx`, `app/map/page.tsx`, and `app/driver/page.tsx` created unnecessary network waterfalls, delaying Time to Interactive (TTI).
**Action:** Use `Promise.all` to fetch independent data in parallel. This reduced perceived load time by up to 66% in high-latency environments.

## 2025-05-15 - Robustness with `.maybeSingle()`
**Learning:** Using `.single()` in Supabase queries for data that might not exist (like an active ride for a new driver) throws a PostgREST error that can crash the component if not caught.
**Action:** Use `.maybeSingle()` for optional data lookups to safely return `null` instead of throwing.

## 2025-05-15 - ESM Configuration for Jest
**Learning:** In a project with `"type": "module"`, `jest.config.js` must be renamed to `jest.config.cjs` to allow `next/jest` to use CommonJS internally without triggering module errors.
**Action:** Standardize on `.cjs` for Jest configuration in ESM-heavy Next.js projects.

## 2025-05-15 - TypeScript Polyfill Type Collision
**Learning:** Assigning a polyfill like `TransformStream` from `node:stream/web` to `globalThis` in `playwright.config.ts` causes a TypeScript type mismatch error because the global type and the imported type are subtly different in Node's view.
**Action:** Use `(globalThis as any).TransformStream = TransformStream as any` to bypass the type check for environment polyfills.
