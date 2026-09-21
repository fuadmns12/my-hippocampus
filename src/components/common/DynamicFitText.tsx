import React from "react";

interface DynamicFitTextProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * Helper component that dynamically calculates text fit and interactively shrinks
 * long text labels so they fit cleanly without abrupt ellipsis truncation.
 * If an icon is provided alongside text, the icon is placed above the text.
 */
export const DynamicFitText: React.FC<DynamicFitTextProps> = ({ children, icon }) => {
  const containerRef = React.useRef<HTMLSpanElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const iconRef = React.useRef<HTMLSpanElement>(null);
  const [scale, setScale] = React.useState<number>(1);
  const rafRef = React.useRef<number | null>(null);

  const hasBoth = Boolean(icon && children);

  const calculateFit = React.useCallback(() => {
    if (!containerRef.current || !measureRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const availableWidth = Math.max(10, containerWidth - 4);
    const naturalTextWidth =
      measureRef.current.offsetWidth || measureRef.current.scrollWidth;

    if (availableWidth > 0 && naturalTextWidth > 0) {
      if (naturalTextWidth > availableWidth) {
        const nextScale = Math.max(0.42, (availableWidth / naturalTextWidth) * 0.96);
        const rounded = Number(nextScale.toFixed(2));
        setScale((prev) => (Math.abs(prev - rounded) > 0.03 ? rounded : prev));
      } else {
        setScale((prev) => (prev !== 1 ? 1 : prev));
      }
    }
  }, []);

  React.useLayoutEffect(() => {
    calculateFit();
  }, [children, icon, calculateFit]);

  React.useEffect(() => {
    const debouncedFit = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        calculateFit();
      });
    };

    debouncedFit();

    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      const ro = new ResizeObserver(debouncedFit);
      ro.observe(containerRef.current);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        ro.disconnect();
      };
    }

    window.addEventListener("resize", debouncedFit);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", debouncedFit);
    };
  }, [calculateFit]);

  const letterSpacing =
    scale < 0.7 ? "0.04em" : scale < 0.85 ? "0.08em" : "0.14em";

  return (
    <span
      ref={containerRef}
      className={`wx-text-main !bg-transparent !flex ${
        hasBoth ? "!flex-col gap-0.5" : "!flex-row !items-center !justify-center gap-1.5"
      } !items-center !justify-center`}
      style={{
        display: "flex",
        flexDirection: hasBoth ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Hidden off-screen unscaled measurer for true natural baseline width */}
      <span
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          left: -9999,
          top: -9999,
          whiteSpace: "nowrap",
          fontSize: "1em",
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>

      {icon && (
        <span
          ref={iconRef}
          className={`wx-icon-wrapper shrink-0 leading-none ${
            children ? "scale-90" : ""
          }`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            letterSpacing: "normal",
          }}
        >
          {icon}
        </span>
      )}

      {children && (
        <span
          className="inline-block whitespace-nowrap leading-none text-center"
          style={{
            fontSize:
              scale < 1 ? `${(scale * 100).toFixed(1)}%` : undefined,
            letterSpacing,
            maxWidth: "100%",
            overflow: scale <= 0.42 ? "hidden" : "visible",
            textOverflow: scale <= 0.42 ? "ellipsis" : "clip",
            textAlign: "center",
          }}
        >
          {children}
        </span>
      )}
    </span>
  );
};
