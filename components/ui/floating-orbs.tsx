"use client";

import React, { useState, useEffect } from "react";

// Define a type for the orb's style properties for better type-checking.
type OrbStyle = {
  width: string;
  height: string;
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
};

const FloatingOrbs = () => {
  // State to hold the styles for the orbs.
  // Initialize with an empty array to ensure nothing is rendered on the server.
  const [orbs, setOrbs] = useState<OrbStyle[]>([]);

  // useEffect runs only on the client, after the component mounts.
  useEffect(() => {
    const generatedOrbs = [...Array(6)].map(() => ({
      width: `${Math.random() * 30 + 20}px`,
      height: `${Math.random() * 30 + 20}px`,
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 90 + 5}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${Math.random() * 20 + 15}s`,
    }));
    setOrbs(generatedOrbs);
  }, []); // The empty dependency array ensures this effect runs only once.

  return (
    <>
      {/*
        ⚡ Bolt: Floating Energy Orbs Optimization
        - What: This component now generates orb styles on the client-side only.
        - Why: The original implementation in `layout.tsx` used `Math.random()` during server-side rendering.
          This created a mismatch between the server-generated HTML and the client-generated HTML, causing a full-page re-render on hydration.
          This negatively impacts initial page load performance (LCP, FID).
        - Impact: Prevents costly re-hydration, leading to a smoother and faster initial render.
          The `useEffect` hook ensures the random styles are generated only once on the client, avoiding the mismatch.
      */}
      {orbs.map((style, i) => (
        <div
          key={i}
          className={`absolute rounded-full animate-float opacity-30 dark:opacity-15 ${
            i % 3 === 0
              ? "bg-primary/20"
              : i % 3 === 1
              ? "bg-amber-500/15"
              : "bg-purple-500/20"
          }`}
          style={style}
        />
      ))}
    </>
  );
};

export default FloatingOrbs;
