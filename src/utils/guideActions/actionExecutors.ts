import { GUIDE_ACTION_EVENT, GuideActionType } from "./types";

export function executeGuideAction(action: GuideActionType) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(GUIDE_ACTION_EVENT, {
        detail: { action },
      })
    );
  }
}

/**
 * Efek visual kedipan sorotan (ring highlight) pada elemen yang dituju saat aksi scroll dipicu.
 */
export function flashHighlightElement(el: HTMLElement) {
  el.classList.add(
    "ring-4",
    "ring-cyan-400",
    "ring-offset-2",
    "ring-offset-black",
    "transition-all",
    "duration-500"
  );
  setTimeout(() => {
    el.classList.remove(
      "ring-4",
      "ring-cyan-400",
      "ring-offset-2",
      "ring-offset-black"
    );
  }, 2400);
}
