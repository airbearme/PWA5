## 2025-05-15 - [CI Workflow Hardening & Role Escalation Fix]
**Vulnerability:** Pre-existing CI failures due to incorrect action ordering and missing pnpm setup, combined with role escalation risks in registration and profile synchronization.
**Learning:** Standard security hardening often requires fixing underlying infrastructure (like CI/CD) to ensure security checks can actually run. For pnpm projects, `pnpm/action-setup` must precede `actions/setup-node` when caching is enabled.
**Prevention:** Always use `pnpm install --frozen-lockfile` in CI and ensure the environment is correctly configured before running tests or security scans.
