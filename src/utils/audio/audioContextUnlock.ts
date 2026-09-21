export function setupAudioUnlockListeners(onUnlock: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleGesture = () => {
    onUnlock();
    removeListeners();
  };

  const removeListeners = () => {
    window.removeEventListener("pointerdown", handleGesture);
    window.removeEventListener("touchstart", handleGesture);
    window.removeEventListener("keydown", handleGesture);
    window.removeEventListener("click", handleGesture);
  };

  window.addEventListener("pointerdown", handleGesture, { passive: true, capture: true });
  window.addEventListener("touchstart", handleGesture, { passive: true, capture: true });
  window.addEventListener("keydown", handleGesture, { passive: true, capture: true });
  window.addEventListener("click", handleGesture, { passive: true, capture: true });

  return removeListeners;
}

export function setupGlobalClickListener(
  onUnlock: () => void,
  isEnabled: () => boolean,
  wasSoundRecentlyPlayed: (ms: number) => boolean,
  playClick: () => void
) {
  if (typeof window === "undefined") return () => {};

  const handleGlobalClick = (e: MouseEvent) => {
    onUnlock();
    if (!isEnabled()) return;

    setTimeout(() => {
      if (wasSoundRecentlyPlayed(55)) return;

      const target = e.target as HTMLElement | SVGElement | null;
      if (!target) return;

      const interactiveEl = target.closest(
        'button, a, input, select, textarea, label, summary, [role="button"], [role="tab"], [role="option"], [role="menuitem"], [role="switch"], [data-clickable="true"], .cursor-pointer'
      );

      if (interactiveEl) {
        playClick();
      }
    }, 0);
  };

  window.addEventListener("click", handleGlobalClick, { capture: true, passive: true });
  return () => {
    window.removeEventListener("click", handleGlobalClick, { capture: true });
  };
}
