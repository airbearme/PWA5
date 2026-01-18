## 2024-05-24 - Respecting User Motion Preferences

**Learning:** Creating a dedicated `usePrefersReducedMotion` hook is a clean, reusable, and effective way to implement accessibility features related to motion. It centralizes the logic for detecting the user's preference and can be easily applied to any component with animations, ensuring the UI respects the user's system-level settings.

**Action:** For any future components with animations, use this hook to conditionally disable them. This should be a standard practice for all new animated components.
