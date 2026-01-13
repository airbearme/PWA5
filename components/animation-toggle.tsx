"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useAnimation } from "@/components/animation-provider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const AnimationToggle = () => {
  const { isAnimationEnabled, toggleAnimation } = useAnimation();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAnimation}
            aria-label={
              isAnimationEnabled
                ? "Pause animations"
                : "Play animations"
            }
            className="rounded-full"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isAnimationEnabled ? (
                <motion.div
                  key="pause"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Pause className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Play className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isAnimationEnabled ? "Pause Animations" : "Play Animations"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
