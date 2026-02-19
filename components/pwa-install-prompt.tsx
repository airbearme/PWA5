"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone, Menu, MoreHorizontal, Share } from "lucide-react";
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
      // Fallback for iOS/Safari/Others where beforeinstallprompt didn't fire
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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5 duration-500">
      <div className="glass-morphism border-2 border-emerald-400/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Background gradient */}
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

          {showInstructions ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">How to Install</h3>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Go back"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Share className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">iOS Safari</p>
                    <p className="text-[11px] text-muted-foreground">Tap Share then &quot;Add to Home Screen&quot;</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Menu className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Android Chrome</p>
                    <p className="text-[11px] text-muted-foreground">Tap Menu then &quot;Install App&quot;</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <MoreHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Desktop</p>
                    <p className="text-[11px] text-muted-foreground">Look for the install icon in your address bar</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowInstructions(false)}
                  className="h-9 text-sm border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setShowInstructions(false)}
                  className="eco-gradient text-white hover-lift shadow-lg h-9 text-sm"
                >
                  Got it
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Content */}
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-emerald-500 to-lime-500 shadow-lg animate-pulse-glow">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    Install AirBear
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get the full app experience with offline access and faster
                    loading!
                  </p>
                </div>
              </div>

              {/* Install button */}
              <Button
                onClick={handleInstall}
                className="w-full eco-gradient text-white hover-lift ripple-effect animate-neon-glow shadow-lg"
              >
                <Download className="mr-2 h-4 w-4" />
                Install Now
              </Button>

              {/* Dismiss link */}
              <button
                onClick={handleDismiss}
                className="w-full mt-2 text-xs text-center text-muted-foreground hover:text-foreground transition-colors"
              >
                Maybe later
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
