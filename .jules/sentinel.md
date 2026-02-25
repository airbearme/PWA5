## 2026-02-25 - Authentication and Privilege Escalation in Sync-Profile
**Vulnerability:** The `/api/auth/sync-profile` endpoint trusted the user ID and role provided in the request body, allowing any user to impersonate others or elevate their own privileges to 'admin'.
**Learning:** Even when using a managed authentication service like Supabase, custom backend endpoints must verify the JWT and extract the user's identity from the verified token rather than trusting client-provided input.
**Prevention:** Implement a `withAuth` middleware for all sensitive API routes that validates the token using the authentication provider's SDK and populates the request object with verified user data.

## 2026-02-25 - GitHub Actions Workflow Standardization for pnpm
**Vulnerability:** Broken CI/CD pipeline due to incorrect pnpm setup and caching configuration.
**Learning:** Using `actions/setup-node` with `cache: 'pnpm'` requires `pnpm` to be installed and in the PATH *before* the setup-node step. Also, pnpm 9.0+ is required for lockfile version 9.0.
**Prevention:** Always place `pnpm/action-setup` before `actions/setup-node` in workflow files, and ensure all shell blocks in workflows use `echo` for outputting to `GITHUB_STEP_SUMMARY`.
