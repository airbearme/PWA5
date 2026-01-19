"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AirbearWheel from "@/components/airbear-wheel";

// A simple throttle function to limit how often a function can be called.
// This is a performance optimization to prevent excessive re-renders from mousemove events.
const throttle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number
): ((...args: Parameters<F>) => void) => {
  let inThrottle: boolean;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;
  return function (this: any, ...args: Parameters<F>) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

export default function FloatingMascot() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const throttledSetMousePosition = useMemo(
    () =>
      throttle((x: number, y: number) => {
        setMousePosition({ x, y });
      }, 100), // Update position at most every 100ms
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      throttledSetMousePosition(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [throttledSetMousePosition]);

  // Calculate position based on mouse (subtle follow effect)
  const followX = mousePosition.x * 0.01;
  const followY = mousePosition.y * 0.01;

  return (
        <Link
          href="/"
          className="fixed bottom-6 right-6 z-50 transition-all duration-500 opacity-100 translate-y-0"
      style={{
        transform: `translate(${followX}px, ${followY}px)`,
      }}
    >
      <div className="group relative">
        {/* Glowing background circle */}
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse-glow group-hover:bg-emerald-500/40 transition-colors"></div>
        
        {/* Mascot container */}
        <div className="relative w-20 h-20 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl hover-lift group-hover:scale-110 transition-transform duration-300 overflow-hidden">
          {/* Spinning wheel in background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
            <AirbearWheel size="lg" glowing animated className="opacity-50" />
          </div>
          
          {/* Mascot image */}
          <img
            src="/airbear-mascot.png"
            alt="AirBear Mascot"
            className="w-full h-full object-cover rounded-full animate-float"
            style={{ animationDuration: "4s" }}
          />
          
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping"></div>
          
          {/* Tooltip on hover */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-emerald-600 dark:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Go Home 🏠
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-emerald-600 dark:border-t-emerald-700"></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

