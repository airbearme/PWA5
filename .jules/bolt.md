## 2024-07-23 - Prioritize LCP Images with next/image

**Learning:** The application's homepage was using a standard `<img>` tag for the primary mascot image, which is a critical above-the-fold element. This misses out on significant performance gains provided by the Next.js Image component, particularly for Largest Contentful Paint (LCP).

**Action:** Always replace standard `<img>` tags with `next/image` for critical, visible-on-load images. Ensure the `priority` prop is added to these images to instruct Next.js to preload them. This is a low-effort, high-impact optimization for any Next.js project.
