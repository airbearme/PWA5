"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone, Share, ArrowLeft } from "lucide-react";
import AirbearWheel from "@/components/airbear-wheel";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Use refs to track state without causing re-renders
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const isInstalledRef = useRef(false);

  // Update refs when state changes
  useEffect(() => {
    deferredPromptRef.current = deferredPrompt;
  }, [deferredPrompt]);

  useEffect(() => {
    isInstalledRef.current = isInstalled;
  }, [isInstalled]);

  useEffect(() => {
    // Check if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      isInstalledRef.current = true;
      return;
    }

    // Check if user has dismissed before (localStorage)
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      deferredPromptRef.current = promptEvent;
      // Show prompt after a short delay for better UX
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Also show prompt if no event fires (for iOS/Safari)
    // Use refs in closure to avoid dependency issues
    const timer = setTimeout(() => {
      if (!deferredPromptRef.current && !isInstalledRef.current) {
        setShowPrompt(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      clearTimeout(timer);
    };
  }, []); // Empty dependency array - only run once on mount

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!showPrompt || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5 duration-500" aria-live="polite">
      <div className="glass-morphism border-2 border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Background gradient & Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-lime-900/10 to-amber-900/20 pointer-events-none"></div>

        {/* Spinning wheel decoration */}
        <div className="absolute top-2 right-2 opacity-20">
          <AirbearWheel size="sm" glowing animated />
        </div>

        <div className="relative z-10">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Content */}
          {!showInstructions ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"><Smartphone className="h-6 w-6 text-white" /></div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-0.5">Install AirBear</h3>
                  <p className="text-sm text-emerald-50/80">Add to home screen for the best experience!</p>
                </div>
              </div>
              <Button onClick={handleInstall} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold h-11 rounded-xl shadow-lg transition-all"><Download className="mr-2 h-4 w-4" /> Install Now</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 py-1 text-white">
              <h3 className="text-lg font-bold">How to Install</h3>
              <p className="text-sm flex items-center gap-2">1. Tap <Share className="h-4 w-4 text-emerald-400" /> in Safari</p>
              <p className="text-sm">2. Tap <span className="text-emerald-400 font-medium">&quot;Add to Home Screen&quot;</span></p>
              <Button onClick={() => setShowInstructions(false)} variant="ghost" size="sm" className="mt-1 text-emerald-400 hover:text-emerald-300 hover:bg-white/5 h-8"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
            </div>
          )}

          {/* Dismiss link */}
          <button
            onClick={handleDismiss}
            className="w-full mt-2 text-xs text-center text-muted-foreground hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
