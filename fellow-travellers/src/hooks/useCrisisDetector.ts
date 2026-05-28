"use client";

import { useState, useCallback } from "react";
import { detectCrisisSignals } from "@/lib/crisis/detector";

export function useCrisisDetector() {
  const [showCrisisScreen, setShowCrisisScreen] = useState(false);

  const check = useCallback((text: string): boolean => {
    const result = detectCrisisSignals(text);
    if (result.isCrisis) {
      setShowCrisisScreen(true);
      return true;
    }
    return false;
  }, []);

  const dismiss = useCallback(() => setShowCrisisScreen(false), []);

  return { showCrisisScreen, check, dismiss };
}
