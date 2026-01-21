"use client";

import { useEffect } from "react";
import Link from "next/link";
import AirbearWheel from "@/components/airbear-wheel";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export default function FloatingMascot() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Performance Optimization:
  // By using framer-motion's `useMotionValue`, `useTransform`, and `useSpring`,
  // we animate the mascot's position without triggering React re-renders on every mouse move.
  // This is significantly more performant than using `useState`.
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const followX = useSpring(useTransform(mouseX, [0, 1920], [-15, 15]), springConfig);
  const followY = useSpring(useTransform(mouseY, [0, 1080], [-15, 15]), springConfig);

  return (
    <motion.div
      style={{
        translateX: followX,
        translateY: followY,
      }}
      className="fixed bottom-6 right-6 z-50"
    >
        <Link
          href="/"
          className="transition-all duration-500 opacity-100 translate-y-0"
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
    </motion.div>
  );
}

