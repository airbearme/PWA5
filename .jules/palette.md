## 2025-05-14 - Integrated PWA Installation Instructions
**Learning:** Browser `alert()` calls for PWA installation instructions on iOS/Android feel disruptive and non-native. Users respond better to themed, in-app components that use visual icons (like Safari's Share icon) to mirror the actual OS interface.
**Action:** Always replace generic browser alerts with themed instruction modals or inline views that use visual cues corresponding to the user's platform.

## 2025-05-14 - CI/CD Standardization for pnpm
**Learning:** In a `pnpm` project, GitHub Action workflows must explicitly setup `pnpm` before `actions/setup-node` to avoid "lockfile not found" errors when caching is enabled. Incorrect versioning of `pnpm/action-setup` or ordering with `actions/setup-node` is a common source of CI failure in ESM projects.
**Action:** Always place `pnpm/action-setup@v4` with `version: latest` before `actions/setup-node@v4` and use `cache: 'pnpm'`.
