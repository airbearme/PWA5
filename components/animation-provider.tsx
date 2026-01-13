"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";

// 1. Define the context shape
interface AnimationContextType {
  isAnimationEnabled: boolean;
  toggleAnimation: () => void;
}

// 2. Create the context with a default value
const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined,
);

// 3. Create a custom hook for easy consumption
export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
};

// 4. Create the provider component
export const AnimationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);

  // Effect to set initial state from localStorage or OS preference
  useEffect(() => {
    const storedPreference = localStorage.getItem("animation-enabled");
    if (storedPreference !== null) {
      const isEnabled = storedPreference === "true";
      setIsAnimationEnabled(isEnabled);
    } else {
      // If no preference is stored, respect the OS setting
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      setIsAnimationEnabled(!prefersReducedMotion);
    }
  }, []);

  // Effect to update localStorage and the <html> attribute when state changes
  useEffect(() => {
    localStorage.setItem("animation-enabled", String(isAnimationEnabled));
    if (isAnimationEnabled) {
      document.documentElement.removeAttribute("data-no-animation");
    } else {
      document.documentElement.setAttribute("data-no-animation", "true");
    }
  }, [isAnimationEnabled]);

  const toggleAnimation = useCallback(() => {
    setIsAnimationEnabled((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({ isAnimationEnabled, toggleAnimation }),
    [isAnimationEnabled, toggleAnimation],
  );

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};
