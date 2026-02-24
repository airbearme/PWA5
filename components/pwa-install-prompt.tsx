"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone, Share, SquarePlus } from "lucide-react";
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
      // Fallback for iOS/Safari
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
        <div className="absolute top-2 right-2 opacity-20" aria-hidden="true">
          <AirbearWheel size="sm" glowing animated />
        </div>

        <div className="relative z-10">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {!showInstructions ? (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-emerald-500 to-lime-500 shadow-lg shrink-0">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Install AirBear</h3>
                  <p className="text-sm text-muted-foreground">Offline access & faster loading!</p>
                </div>
              </div>
              <Button onClick={handleInstall} className="w-full eco-gradient text-white shadow-lg">
                <Download className="mr-2 h-4 w-4" /> Install Now
              </Button>
              <button onClick={handleDismiss} className="w-full text-xs text-muted-foreground text-center">Maybe later</button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <h3 className="font-bold text-center text-lg">How to Install</h3>
              <div className="space-y-2">
                {[
                  { Icon: Share, color: "emerald", text: <>Tap <b className="text-emerald-400">Share</b> in Safari</> },
                  { Icon: SquarePlus, color: "amber", text: <>Select <b className="text-amber-400">Add to Home Screen</b></> }
                ].map(({ Icon, color, text }, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
                    <div className={`p-2 rounded-lg bg-${color}-500/20`}><Icon className={`h-5 w-5 text-${color}-400`} /></div>
                    <p className="text-sm">{text}</p>
                  </div>
                ))}
              </div>
              <Button onClick={() => setShowInstructions(false)} className="w-full bg-emerald-600 text-white shadow-lg">Got it</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
