## 2025-05-14 - [Semantic Buttons for Selection]
**Learning:** In a production-ready codebase with strict PR reviews, micro-UX improvements must adhere to a "single-concern" principle. Bundling environment fixes (like Jest config) or unrelated refactors with UI changes violates size constraints and leads to rejection. UX accessibility improvements (like converting non-semantic `div`s to `button`s) are highly valued but must be delivered in isolation.
**Action:** Always keep PRs focused and under 50 lines if specified. Use semantic HTML (`<button>`) for all interactive selection elements to ensure out-of-the-box keyboard and screen reader support.

## 2025-05-14 - [CI Caching and Tool Order]
**Learning:** For `pnpm`-based projects using `actions/setup-node` with `cache: 'pnpm'`, the `pnpm/action-setup` step must precede `setup-node`. Failure to do so results in a "Unable to locate executable file: pnpm" infrastructure error during CI.
**Action:** Ensure `pnpm/action-setup` is the first Node-related step in GitHub Actions workflows to unblock automated verification.
