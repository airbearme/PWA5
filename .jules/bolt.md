## 2025-05-22 - Parallelizing Network Waterfalls
**Learning:** Sequential `await` calls for independent Supabase queries (e.g., spots, airbears, rides) created significant network waterfalls, delaying page interactivity especially on high-latency mobile connections.
**Action:** Use `Promise.all` to fetch independent data sources concurrently. This reduces total load time from sum(t1, t2, ...) to max(t1, t2, ...).

## 2025-05-22 - Next.js LCP Optimization
**Learning:** Standard `<img>` tags for above-the-fold assets (mascot) were identified as LCP bottlenecks.
**Action:** Use Next.js `<Image />` component with `priority` attribute to ensure critical branding assets are preloaded and correctly sized, improving Largest Contentful Paint.

## 2025-05-22 - CI/CD and Zod Validation
**Learning:** The project uses strict Zod validation for environment variables (`lib/env.ts` and `lib/supabase/server.ts`). This validation runs even during `next build`, causing CI failures if variables are missing or formatted incorrectly (e.g., must end in `.supabase.co` and start with `eyJ`). Additionally, the project strictly uses `pnpm`, and `setup-node` caching fails if `pnpm` is not set up beforehand.
**Action:** Provide Zod-compliant placeholders in GitHub Actions for all build jobs. Ensure `pnpm/action-setup` is positioned before `actions/setup-node` in all workflows.
