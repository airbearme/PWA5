"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SpecialEffectsProps {
  children: React.ReactNode;
  effects?: ("plasma" | "solar" | "god-rays" | "eco-breeze" | "particles" | "hologram" | "fire" | "prismatic")[];
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export const SpecialEffects: React.FC<SpecialEffectsProps> = ({
  children,
  effects = [],
  className,
  intensity = "medium",
}) => {
  const intensityClasses = {
    low: "opacity-30 dark:opacity-15",
    medium: "opacity-60 dark:opacity-30",
    high: "opacity-90 dark:opacity-50",
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Plasma Vortex Effect */}
      {effects.includes("plasma") && (
        <div className={cn("absolute inset-0 airbear-plasma rounded-inherit", intensityClasses[intensity])} />
      )}

      {/* Solar Rays Effect */}
      {effects.includes("solar") && (
        <div className={cn("absolute inset-0 airbear-solar-rays rounded-inherit", intensityClasses[intensity])} />
      )}

      {/* God Rays Effect */}
      {effects.includes("god-rays") && (
        <div className={cn("absolute inset-0 airbear-god-rays rounded-inherit", intensityClasses[intensity])} />
      )}

      {/* Eco Breeze Effect */}
      {effects.includes("eco-breeze") && (
        <div className={cn("absolute inset-0 airbear-eco-breeze rounded-inherit", intensityClasses[intensity])} />
      )}

      {/* Particle System */}
      {effects.includes("particles") && (
        <div className={cn("absolute inset-0 particle-system rounded-inherit", intensityClasses[intensity])} />
      )}

      {/* Holographic Shimmer */}
      {effects.includes("hologram") && (
        <div className={cn("absolute inset-0 animate-holo-shimmer rounded-inherit", intensityClasses[intensity])} />
      )}

      {/* Fire Effect */}
      {effects.includes("fire") && (
        <div className={cn("absolute inset-0 animate-rolling-fire rounded-inherit", intensityClasses[intensity])} />
      )}

      {/* Prismatic Rays */}
      {effects.includes("prismatic") && (
        <div className={cn("absolute inset-0 animate-prismatic-rays rounded-inherit", intensityClasses[intensity])} />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Preset effect combinations
export const CosmicButton: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <SpecialEffects effects={["plasma", "particles"]} intensity="high" className={className}>
    {children}
  </SpecialEffects>
);

export const SolarCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <SpecialEffects effects={["solar", "god-rays"]} intensity="medium" className={className}>
    {children}
  </SpecialEffects>
);

export const EcoElement: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <SpecialEffects effects={["eco-breeze", "particles"]} intensity="low" className={className}>
    {children}
  </SpecialEffects>
);

export const FireElement: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <SpecialEffects effects={["fire", "prismatic"]} intensity="high" className={className}>
    {children}
  </SpecialEffects>
);

export const HolographicElement: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <SpecialEffects effects={["hologram", "plasma"]} intensity="medium" className={className}>
    {children}
  </SpecialEffects>
);