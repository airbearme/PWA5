"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

const ANIMATION_STORAGE_KEY = "airbear-animations-disabled";

interface AnimationContextType {
  animationsDisabled: boolean;
  setAnimationsDisabled: (disabled: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
}

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [animationsDisabled, setAnimationsDisabledState] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const storedPreference = localStorage.getItem(ANIMATION_STORAGE_KEY);

    let initialValue = prefersReducedMotion;
    if (storedPreference !== null) {
      initialValue = storedPreference === "true";
    }

    setAnimationsDisabledState(initialValue);
  }, []);

  useEffect(() => {
    if (animationsDisabled) {
      document.documentElement.setAttribute("data-animations-disabled", "true");
    } else {
      document.documentElement.removeAttribute("data-animations-disabled");
    }
    localStorage.setItem(ANIMATION_STORAGE_KEY, String(animationsDisabled));
  }, [animationsDisabled]);

  const setAnimationsDisabled = (disabled: boolean) => {
    setAnimationsDisabledState(disabled);
  };

  const value = useMemo(() => ({
    animationsDisabled,
    setAnimationsDisabled
  }), [animationsDisabled]);

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}