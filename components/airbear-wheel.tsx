import React from "react";

interface AirbearWheelProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  glowing?: boolean;
  animated?: boolean;
  effectType?: "solar" | "eco" | "fire" | "plasma" | string;
}

export const AirbearWheel: React.FC<AirbearWheelProps> = ({
  size = "md",
  className = "",
  glowing = false,
  animated = false,
  effectType = "eco",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const glowClass = glowing ? "shadow-lg shadow-primary/50" : "";

  return (
    <div
      className={`airbear-wheel ${sizeClasses[size]} ${glowClass} ${className} relative`}
    >
      {/* Fire/Smoke Trail Effect */}
      {effectType === "fire" && animated && (
        <>
          {/* Rolling Fire Effect */}
          <div className="absolute inset-0 rounded-full animate-rolling-fire opacity-70"></div>
          {/* Smoke Trail */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-4">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-400/60 to-transparent rounded-full blur-sm animate-smoke-trail"></div>
          </div>
        </>
      )}

      {/* Plasma Vortex Effect */}
      {effectType === "plasma" && (
        <div className="absolute inset-0 rounded-full animate-plasma-vortex opacity-60"></div>
      )}

      {/* Solar Rays Effect */}
      {effectType === "solar" && (
        <div className="absolute inset-0 rounded-full airbear-solar-rays opacity-40"></div>
      )}

      <div
        className={`w-full h-full rounded-full bg-gradient-to-br from-primary/80 to-primary/40 border-2 border-primary/60 flex items-center justify-center relative ${
          animated ? "animate-spin" : ""
        } ${effectType === "fire" ? "animate-burning-wheel" : ""} opacity-80`}
      >
        {/* Wheel spokes */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-full bg-primary/70"
            style={{
              transform: `rotate(${i * 45}deg)`,
              transformOrigin: "center",
            }}
          />
        ))}

        {/* Center hub with AirBear face */}
        <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 border border-primary/50 flex items-center justify-center relative">
          <span className="text-xs font-bold text-primary animate-airbear-bounce">🐻</span>
          {/* Mini wheel effect */}
          <div className="absolute inset-1 rounded-full border border-primary/30 animate-pulse opacity-60"></div>
          {/* Inner plasma effect */}
          {effectType === "plasma" && (
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-purple-400/30 via-blue-400/20 to-emerald-400/10 animate-plasma-flow"></div>
          )}
        </div>

        {/* Transparent overlay for wheel look */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-primary/10 to-transparent opacity-50"></div>

        {/* Prismatic rays for solar effect */}
        {effectType === "solar" && (
          <div className="absolute inset-0 rounded-full animate-prismatic-rays opacity-30"></div>
        )}
      </div>

      {/* Enhanced Glowing effect */}
      {glowing && (
        <div className={`absolute inset-0 rounded-full bg-primary/20 blur-sm animate-pulse ${
          effectType === "fire" ? "animate-burning-wheel" : ""
        }`}></div>
      )}

      {/* AirBear Trail Effect */}
      {animated && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary/60 rounded-full animate-airbear-trail"></div>
        </div>
      )}
    </div>
  );
};

export default AirbearWheel;