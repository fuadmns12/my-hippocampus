import { useState, useEffect, useCallback } from "react";
import { soundFx, SoundEffectType } from "../utils/soundEffects";

export function useSoundEffects() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => soundFx.isEnabled());
  const [volume, setVolumeState] = useState(() => soundFx.getVolume());

  useEffect(() => {
    return soundFx.subscribe((enabled, vol) => {
      setIsSoundEnabled(enabled);
      setVolumeState(vol);
    });
  }, []);

  const toggleSound = useCallback(() => {
    soundFx.toggleEnabled();
  }, []);

  const setSound = useCallback((val: boolean) => {
    soundFx.setEnabled(val);
  }, []);

  const setVolume = useCallback((val: number) => {
    soundFx.setVolume(val);
  }, []);

  const playSound = useCallback((type: SoundEffectType) => {
    soundFx.play(type);
  }, []);

  return {
    isSoundEnabled,
    volume,
    toggleSound,
    setSound,
    setVolume,
    playSound,
  };
}
