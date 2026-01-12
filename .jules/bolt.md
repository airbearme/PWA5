# Bolt's Journal ⚡

This journal is for CRITICAL learnings only.

---
## 2024-07-25 - Lucide Direct Imports Redundant
**Learning:** Attempting to optimize `lucide-react` icon imports by changing from a barrel import (`import { Icon } from 'lucide-react'`) to direct path imports (`import Icon from 'lucide-react/dist/esm/icons/icon'`) provided **zero** reduction in the Next.js production build's 'First Load JS' size.
**Action:** Do not spend time on this optimization again. The Next.js build process appears to be tree-shaking the barrel import so effectively that this manual optimization is completely redundant. Focus on other, more impactful areas.
