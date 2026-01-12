"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAnimation } from "@/contexts/AnimationContext";

export function SettingsSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { animationsEnabled, toggleAnimations } = useAnimation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="animations-switch" className="text-lg">
              Enable Animations
            </Label>
            <Switch
              id="animations-switch"
              checked={animationsEnabled}
              onCheckedChange={toggleAnimations}
              aria-label="Toggle animations"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
