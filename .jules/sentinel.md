## 2026-02-05 - Mass Assignment and Secret Leakage Cleanup
**Vulnerability:** Discovery of multiple legacy deployment and diagnostic scripts containing hardcoded plaintext SFTP/SSH credentials. Additionally, endpoints for profile synchronization and ride updates were vulnerable to mass assignment, allowing potential privilege escalation (role changes) or unauthorized metadata modification.
**Learning:** These vulnerabilities often accumulate in projects during rapid development or through legacy "quick fix" scripts that are never cleaned up. The presence of hardcoded credentials in multiple files (over 30 instances) suggests a recurring pattern of insecure credential management in the past.
**Prevention:** 1. Ensure all deployment and diagnostic scripts use environment variables instead of hardcoded secrets. 2. Use strict Zod schemas for all input validation, explicitly omitting sensitive fields (like `role`) from user-provided payloads (Principle of Least Privilege). 3. Regularly audit the codebase for sensitive keywords (passwords, keys) and remove legacy artifacts.

## 2026-02-05 - CI/CD Dependency Setup Order
**Vulnerability:** Not a direct vulnerability, but a configuration error that caused CI failures.
**Learning:** When using `actions/setup-node@v4` with `cache: 'pnpm'`, the `pnpm/action-setup` action must be executed *before* `setup-node`. Otherwise, `setup-node` cannot find the `pnpm` executable to determine the store location, leading to job failures. Additionally, using `cache: 'npm'` in a project using `pnpm` will fail if `package-lock.json` is missing.
**Prevention:** Always place `pnpm/action-setup` before `actions/setup-node` and ensure the `cache` type matches the project's package manager.
