# Bolt's Journal - Critical Performance Learnings

## 2025-05-15 - Network Waterfalls in Next.js App Router
**Learning:** In pages like `app/map/page.tsx` and `app/dashboard/page.tsx`, multiple independent `supabase` queries were being awaited sequentially. This created network waterfalls, significantly delaying the Time to Interactive (TTI) for data-heavy views.
**Action:** Always wrap independent data fetches in `Promise.all` to parallelize requests and reduce page load latency.

## 2025-05-15 - High-Frequency Database Writes in Driver Tracking
**Learning:** The `useDriverLocation` hook was updating the database on every GPS change event. High-frequency updates (e.g., from modern mobile devices) cause unnecessary load on the Supabase backend and consume excessive user bandwidth.
**Action:** Implement a throttled update mechanism (e.g., 5-10 second interval) with leading and trailing edge execution to ensure the database is updated efficiently without sacrificing tracking accuracy.

## 2025-05-15 - Next.js Image Optimization for Brand Assets
**Learning:** Using standard `<img>` tags for above-the-fold brand assets (like the mascot) negatively impacts LCP.
**Action:** Use Next.js `<Image />` component with `priority` for critical assets to ensure early discovery and optimized delivery.
