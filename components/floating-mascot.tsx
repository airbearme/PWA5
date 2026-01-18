"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import AirbearWheel from "@/components/airbear-wheel";
export default function FloatingMascot() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion]);
  const followX = prefersReducedMotion ? 0 : mousePosition.x * 0.01;
  const followY = prefersReducedMotion ? 0 : mousePosition.y * 0.01;
  return (
    <Link
      href="/"
      className="fixed bottom-6 right-6 z-50 transition-all duration-500"
      style={{
        transform: `translate(${followX}px, ${followY}px)`,
      }}
      aria-label="Homepage"
    >
      <div className="group relative">
        <div
          className={cn(
            "absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/40 transition-colors",
            { "animate-pulse-glow": !prefersReducedMotion }
          )}
        ></div>
        <div className="relative w-20 h-20 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl group-hover:scale-110 transition-transform duration-300 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
            <AirbearWheel
              size="lg"
              glowing
              animated={!prefersReducedMotion}
              className="opacity-50"
            />
          </div>
          <img
            src="/airbear-mascot.png"
            alt="AirBear Mascot"
            className={cn("w-full h-full object-cover rounded-full", {
              "animate-float": !prefersReducedMotion,
            })}
            style={{
              animationDuration: prefersReducedMotion ? "0s" : "4s",
            }}
          />
          {!prefersReducedMotion && (
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping"></div>
          )}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-emerald-600 dark:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Go Home 🏠
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-emerald-600 dark:border-t-emerald-700"></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

