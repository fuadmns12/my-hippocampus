import { useState, useEffect, useCallback } from "react";
import { hapticFx, HapticType } from "../utils/hapticFeedback";

export function useHaptics() {
  const [isHapticEnabled, setIsHapticEnabled] = useState<boolean>(() =>
    hapticFx.isEnabled()
  );
  const [isSupported, setIsSupported] = useState<boolean>(() =>
    hapticFx.isSupported()
  );

  useEffect(() => {
    setIsSupported(hapticFx.isSupported());
    setIsHapticEnabled(hapticFx.isEnabled());

    const unsubscribe = hapticFx.addListener((enabled) => {
      setIsHapticEnabled(enabled);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleHaptic = useCallback(() => {
    const next = hapticFx.toggle();
    setIsHapticEnabled(next);
  }, []);

  const setHapticEnabled = useCallback((enabled: boolean) => {
    hapticFx.setEnabled(enabled);
    setIsHapticEnabled(enabled);
  }, []);

  const triggerHaptic = useCallback(
    (pattern: HapticType | number | number[] = "selection") => {
      hapticFx.trigger(pattern);
    },
    []
  );

  return {
    isHapticEnabled,
    isSupported,
    toggleHaptic,
    setHapticEnabled,
    triggerHaptic,
  };
}
