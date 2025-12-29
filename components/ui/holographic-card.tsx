"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface HolographicCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "default" | "hud" | "glass";
  interactive?: boolean;
}

export const HolographicCard = React.forwardRef<
  HTMLDivElement,
  HolographicCardProps
>(
  (
    { className, children, variant = "default", interactive = true, ...props },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={interactive ? { y: -5, scale: 1.01 } : {}}
        viewport={{ once: true }}
        className={cn(
          "relative overflow-hidden rounded-[2rem]",
          variant === "default" &&
            "glass-morphism p-6 border-white/10 dark:border-white/5",
          variant === "hud" && "glass-morphism p-6 hud-border bg-black/40",
          variant === "glass" &&
            "bg-white/5 backdrop-blur-md border border-white/10 p-6",
          className
        )}
        {...props}
      >
        {/* Subtle Inner Glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

        {/* Animated Scanline for HUD variant */}
        {variant === "hud" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
            <div
              className="absolute top-0 left-0 w-full h-[1px] bg-primary/20 animate-scanline"
              style={{
                animation: "scanline 4s linear infinite",
              }}
            />
          </div>
        )}

        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);
HolographicCard.displayName = "HolographicCard";
