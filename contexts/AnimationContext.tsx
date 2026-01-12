"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

const IS_SERVER = typeof window === "undefined";

// 1. Define the context shape
interface AnimationContextType {
  animationsEnabled: boolean;
  toggleAnimations: () => void;
}

// 2. Create the context with a default value
const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined
);

// 3. Create a provider component
export const AnimationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Initialize state from localStorage or OS setting
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    if (IS_SERVER) return true; // Default for SSR
    const savedPreference = localStorage.getItem("animationsEnabled");
    if (savedPreference !== null) {
      return JSON.parse(savedPreference);
    }
    // Respect OS-level setting if no preference is saved
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Effect to update localStorage and data-attribute when state changes
  useEffect(() => {
    if (!IS_SERVER) {
      localStorage.setItem(
        "animationsEnabled",
        JSON.stringify(animationsEnabled)
      );
      if (animationsEnabled) {
        document.documentElement.removeAttribute("data-reduced-motion");
      } else {
        document.documentElement.setAttribute("data-reduced-motion", "true");
      }
    }
  }, [animationsEnabled]);

  const toggleAnimations = useCallback(() => {
    setAnimationsEnabled((prev) => !prev);
  }, []);

  const value = { animationsEnabled, toggleAnimations };

  return (
    <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>
  );
};

// 4. Create a custom hook for easy consumption
export const useAnimation = () => {
  const context = React.useContext(AnimationContext);
  if (context === undefined) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
};
