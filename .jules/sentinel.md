# Sentinel Security Journal

## 2025-05-15 - Role Escalation and Profile Linking
**Vulnerability:** Users could potentially escalate their privileges by providing a `role` field during registration or profile synchronization. Additionally, failing to pass the Supabase UUID to the local profile creator would break account linking.
**Learning:** In a dual-auth system (Supabase Auth + local DB), we must explicitly sanitize input schemas (using Zod `.omit()`) and ensure the authentication provider's UUID is always used as the primary key for the local profile.
**Prevention:** Use dedicated "public" Zod schemas that exclude sensitive fields like `role` or `permissions`. Always destructure and use the `id` returned from `auth.admin.createUser` when creating local database records.

## 2025-05-15 - Information Exposure in Health Checks
**Vulnerability:** Health check endpoints exposed `env` (environment) and `version` details.
**Learning:** Exposing system internals can aid attackers in reconnaissance by identifying specific software versions with known vulnerabilities or distinguishing between staging and production environments.
**Prevention:** Strip all non-essential metadata from public health check responses. Keep it limited to `status` and `timestamp`.

## 2025-05-15 - Hardened CI/CD Workflow with pnpm
**Vulnerability:** Inconsistent dependency management and outdated artifact actions in CI could lead to supply chain risks or failed security checks.
**Learning:** GitHub Actions must be correctly ordered: `pnpm/action-setup` must precede `actions/setup-node` when using `cache: pnpm`. Using pinned major versions for pnpm ensures environment parity.
**Prevention:** Standardize all workflows to use `pnpm` exclusively, use the latest stable versions of core actions (e.g., `@v4`), and enforce `--frozen-lockfile` to ensure predictable builds.
