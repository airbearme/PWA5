"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X, Download, Smartphone } from "lucide-react";
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
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true
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
      // Show instructions
      alert(
        "To install AirBear:\n\n" +
          "iOS Safari: Tap Share → Add to Home Screen\n\n" +
          "Android Chrome: Tap Menu → Install App\n\n" +
          "Desktop: Look for install icon in address bar"
      );
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleDismiss}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Dismiss</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
        </div>
      </div>
    </div>
  );
}
