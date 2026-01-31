# Bolt's Journal - Critical Learnings

## 2026-01-31 - CI Workflow Dependencies
**Learning:** The project uses `pnpm` with lockfile version 9.0, but many CI workflows were misconfigured to use `npm` or had incorrect ordering of `pnpm/action-setup` and `actions/setup-node`. `setup-node` with `cache: pnpm` requires `pnpm` to be installed *beforehand* to correctly locate and handle the cache.

**Action:** Always ensure `pnpm/action-setup` is called before `actions/setup-node` when using `cache: pnpm`. Use `pnpm install --frozen-lockfile` to ensure deterministic builds matching the lockfile.

## 2026-01-31 - Avoid Micro-optimizations of Primitive Math
**Learning:** Wrapping simple arithmetic (like the haversine formula or fare calculations) in `useMemo` is often considered a micro-optimization not worth the added complexity and memory overhead of the hook itself, as modern CPUs perform these operations in nanoseconds.

**Action:** Focus performance optimizations on components with high re-render frequency or expensive DOM/side-effect operations.
