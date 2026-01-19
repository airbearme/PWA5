"use client";

import * as React from "react";
import { useAnimation } from "@/components/animation-provider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function AnimationToggle() {
  const { animationsDisabled, setAnimationsDisabled } = useAnimation();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="animation-toggle"
        checked={!animationsDisabled}
        onCheckedChange={(checked) => setAnimationsDisabled(!checked)}
        aria-label="Toggle animations"
      />
      <Label htmlFor="animation-toggle" className="text-xs text-muted-foreground">
        Animations
      </Label>
    </div>
  );
}