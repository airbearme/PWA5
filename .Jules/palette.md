## 2025-05-15 - [Auth UX Polish: Dark Mode Consistency and OAuth Feedback]
**Learning:** Hardcoded light-mode background classes (like `bg-white`) in separators or text overlays cause visual regressions in dark-mode-first applications. Additionally, missing loading states on async OAuth buttons leads to poor perceived responsiveness and potential double-submissions.
**Action:** Use theme-aware classes like `bg-card` for overlays and always implement `isLoading` states for third-party auth triggers to ensure a smooth, professional interaction.
