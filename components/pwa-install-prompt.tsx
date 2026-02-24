"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Smartphone, Share, SquarePlus } from "lucide-react";

export default function PWAInstallPrompt() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone;
    if (isIOS && !isStandalone && !localStorage.getItem("pwa-dismissed")) {
      setTimeout(() => setShow(true), 3000);
    }
  }, []);

  if (!show) return null;

  const close = () => { setShow(false); localStorage.setItem("pwa-dismissed", "t"); };

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-80 z-50 animate-in slide-in-from-bottom-5">
      <div className="glass-morphism border-2 border-emerald-400/50 rounded-xl p-4 shadow-2xl relative bg-black/40 backdrop-blur-xl">
        <button onClick={close} className="absolute top-2 right-2 p-1 opacity-50 hover:opacity-100" aria-label="Close"><X size={16}/></button>
        {step === 1 ? (
          <div className="space-y-3">
            <div className="flex gap-3 items-center">
              <div className="p-2 rounded-full bg-emerald-500 shadow-lg"><Smartphone size={20} className="text-white"/></div>
              <p className="font-bold text-sm">Install AirBear App</p>
            </div>
            <Button onClick={() => setStep(2)} className="w-full eco-gradient text-xs h-8">How to Install</Button>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <p className="font-bold text-center">Tap <Share size={14} className="inline mx-1"/> then &quot;Add to Home Screen&quot; <SquarePlus size={14} className="inline mx-1"/></p>
            <Button onClick={close} variant="outline" className="w-full h-8 border-emerald-500/50">Got it</Button>
          </div>
        )}
      </div>
    </div>
  );
}
