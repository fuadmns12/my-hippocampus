import { useEffect, useRef, useState, useCallback } from "react";

interface AutoFitOptions {
  maxCardWidth?: number;
  screenPaddingY?: number;
  screenPaddingX?: number;
  minScale?: number;
}

/**
 * Hook to dynamically and interactively scale content inside a card
 * so that it always fits within available space without vertical scroll.
 */
export function useAutoFitScale(options: AutoFitOptions = {}) {
  const {
    maxCardWidth = 576,
    screenPaddingY = 32,
    screenPaddingX = 24,
    minScale = 0.35,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);

  const calculateScale = useCallback(() => {
    if (!contentRef.current) return;

    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const el = contentRef.current;
    const currentH = el.scrollHeight || el.offsetHeight;
    const currentW = el.scrollWidth || el.offsetWidth;

    let baseH = currentH;
    let baseW = currentW;

    setNaturalHeight((prev) => {
      const h = Math.max(prev, currentH);
      baseH = h;
      return h;
    });

    let padY = 48;
    let padX = 48;
    if (containerRef.current) {
      const style = window.getComputedStyle(containerRef.current);
      padY =
        (parseFloat(style.paddingTop) || 24) +
        (parseFloat(style.paddingBottom) || 24) +
        (parseFloat(style.borderTopWidth) || 1) +
        (parseFloat(style.borderBottomWidth) || 1);
      padX =
        (parseFloat(style.paddingLeft) || 24) +
        (parseFloat(style.paddingRight) || 24) +
        (parseFloat(style.borderLeftWidth) || 1) +
        (parseFloat(style.borderRightWidth) || 1);
    }

    const availableH = Math.max(80, vh - screenPaddingY - padY);
    const maxAllowedW = Math.min(vw - screenPaddingX, maxCardWidth);
    const availableW = Math.max(120, maxAllowedW - padX);

    let nextScale = 1;
    if (baseH > 0 && availableH > 0) {
      const scaleH = availableH / baseH;
      const scaleW = baseW > 0 ? availableW / baseW : 1;
      nextScale = Math.min(1, scaleH, scaleW);
    }

    nextScale = Math.max(minScale, Math.min(1, Number(nextScale.toFixed(3))));
    setScale(nextScale);
  }, [maxCardWidth, screenPaddingY, screenPaddingX, minScale]);

  useEffect(() => {
    calculateScale();

    const rafId = requestAnimationFrame(() => {
      calculateScale();
    });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        calculateScale();
      });
      if (containerRef.current) ro.observe(containerRef.current);
    }

    window.addEventListener("resize", calculateScale);
    window.addEventListener("orientationchange", calculateScale);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", calculateScale);
      window.removeEventListener("orientationchange", calculateScale);
      if (ro) ro.disconnect();
    };
  }, [calculateScale]);

  return {
    containerRef,
    contentRef,
    scale,
    naturalHeight,
    calculateScale,
  };
}
