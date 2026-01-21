## 2024-07-25 - High-Frequency State Updates

**Learning:** Using React's `useState` within a high-frequency event listener (like `mousemove`) is a significant performance anti-pattern. Each `setState` call triggers a component re-render, leading to a choppy user experience and unnecessary CPU load, especially for animations.

**Action:** For animations tied to frequent events, offload the state management and animation logic from React's render cycle. Use a dedicated animation library like `framer-motion` with its `useMotionValue`, `useTransform`, and `useSpring` hooks. This allows the animation to update independently of component re-renders, resulting in much smoother performance.
