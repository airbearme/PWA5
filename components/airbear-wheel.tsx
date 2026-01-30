"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface AirbearWheelProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  glowing?: boolean;
  animated?: boolean;
  effectType?: "solar" | "eco" | string;
}

// ⚡ Bolt: Memoized AirbearWheel to prevent unnecessary re-renders from parent components.
// This component is purely presentational, so its output is guaranteed to be the same
// for the same props. React.memo provides a significant performance boost by skipping
// re-renders unless the props have changed.
const AirbearWheel = memo(function AirbearWheel({
  size = "md",
  className = "",
  glowing = false,
  animated = true,
  effectType,
}: AirbearWheelProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const glowClass = glowing
    ? "shadow-lg shadow-emerald-500/50 animate-pulse-glow"
    : "";
  const spinClass = animated ? "animate-wheel-spin" : "";

  return (
    <div
      className={cn(
        "airbear-wheel relative",
        sizeClasses[size],
        glowClass,
        className
      )}
    >
      <div
        className={cn(
          "w-full h-full rounded-full bg-gradient-to-br from-emerald-500/80 via-lime-400/60 to-amber-400/40 border-3 border-emerald-400/60 flex items-center justify-center opacity-90",
          spinClass
        )}
      >
        {/* Wheel spokes - 8 spokes for full wheel effect */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-full bg-emerald-400/70 origin-center"
            style={{
              transform: `rotate(${i * 45}deg)`,
            }}
          />
        ))}

        {/* Center hub with AirBear face */}
        <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 border-2 border-emerald-400/50 flex items-center justify-center relative">
          <span className="text-xs font-bold text-emerald-700">🐻</span>
          {/* Mini wheel effect */}
          <div className="absolute inset-1 rounded-full border border-emerald-400/30 animate-pulse opacity-60"></div>
        </div>

        {/* Transparent overlay for wheel depth */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-emerald-400/10 to-transparent opacity-50"></div>
      </div>

      {/* Glowing effect ring */}
      {glowing && (
        <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-sm animate-pulse"></div>
      )}

      {/* Solar rays effect */}
      {effectType === "solar" && (
        <div className="absolute inset-0 rounded-full animate-solar-rays opacity-30">
          <div className="absolute inset-0 bg-conic-gradient from-amber-400/40 via-yellow-300/30 to-amber-400/40"></div>
        </div>
      )}

      {/* Eco effect */}
      {effectType === "eco" && (
        <div className="absolute inset-0 rounded-full animate-pulse-glow">
          <div className="absolute inset-0 bg-radial-gradient from-emerald-400/30 to-transparent"></div>
        </div>
      )}
    </div>
  );
});

export default AirbearWheel;




