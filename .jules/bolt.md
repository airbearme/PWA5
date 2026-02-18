## 2025-05-22 - Callback Stability in Map Components
**Learning:** Anonymous functions passed as props to complex components like `MapView` (which uses Leaflet in a `useEffect`) cause frequent and expensive re-initialization of DOM elements if the parent component re-renders often (e.g., due to real-time updates).
**Action:** Always wrap event handlers in `useCallback` and ensure they are stable to prevent unnecessary effect execution in downstream map components.

## 2025-05-22 - Proper Image Optimization with Next.js
**Learning:** Migrating from `<img>` to `<Image />` requires careful handling of parent container positioning when using the `fill` prop.
**Action:** Ensure the parent container has `position: relative` (Tailwind `relative`) and appropriate dimensions when using `fill` on a Next.js `Image`.
