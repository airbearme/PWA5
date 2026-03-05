"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
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
  const [showInstructions, setShowInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const isInstalledRef = useRef(false);

  useEffect(() => {
    deferredPromptRef.current = deferredPrompt;
  }, [deferredPrompt]);

  useEffect(() => {
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      isInstalledRef.current = true;
      return;
    }

    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      deferredPromptRef.current = promptEvent;
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    const timer = setTimeout(() => {
      if (!deferredPromptRef.current && !isInstalledRef.current) setShowPrompt(true);
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

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
    setShowInstructions(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5 duration-500">
      <div className="glass-morphism border-2 border-emerald-400/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-lime-900/10 to-amber-900/20 pointer-events-none"></div>
        <div className="absolute top-2 right-2 opacity-20">
          <AirbearWheel size="sm" glowing animated />
        </div>

        <div className="relative z-10">
          <button onClick={handleDismiss} className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10" aria-label="Dismiss">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {showInstructions ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold">How to Install</h3>
              <p className="text-sm text-muted-foreground">
                Tap the <span className="font-semibold text-foreground">Share</span> button then select <span className="font-semibold text-foreground">&quot;Add to Home Screen&quot;</span>.
              </p>
              <Button onClick={handleDismiss} className="w-full eco-gradient text-white">Got it</Button>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-emerald-500 to-lime-500 shadow-lg animate-pulse-glow">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">Install AirBear</h3>
                  <p className="text-sm text-muted-foreground">Get the full app experience with offline access and faster loading!</p>
                </div>
              </div>
              <Button onClick={handleInstall} className="w-full eco-gradient text-white hover-lift animate-neon-glow shadow-lg">
                <Download className="mr-2 h-4 w-4" />
                Install Now
              </Button>
              <button onClick={handleDismiss} className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground">Maybe later</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
