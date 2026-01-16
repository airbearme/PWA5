## 2024-05-22 - Lucide-React Direct Imports

**Learning:** Optimizing `lucide-react` imports by switching from a barrel file import (`from 'lucide-react'`) to direct path imports (`from 'lucide-react/dist/esm/icons/...'`) does not provide a measurable reduction in the Next.js production build's 'First Load JS' size. This suggests the build process's tree-shaking is already effective at removing unused icons from the library.

**Action:** Do not spend time on this optimization in the future. Trust the Next.js build process to handle `lucide-react` tree-shaking effectively. Focus on other areas for bundle size reduction.