"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsSheet } from "@/components/settings-sheet";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
