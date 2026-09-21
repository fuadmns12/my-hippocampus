import React from "react";
import { DynamicFitText } from "./DynamicFitText";

export interface MechanicalButtonProps {
  id?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  title?: string;
  size?: "xs" | "sm" | "md" | "lg" | "wide" | "full";
  variant?: "cyan" | "gold" | "danger" | "emerald" | "neutral";
  className?: string;
  btnClassName?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  showAmbient?: boolean;
  showReflection?: boolean;
  active?: boolean;
  fullWidth?: boolean;
}

/**
 * Industrial Titanium Mechanical Sci-Fi Button
 * From Uiverse.io by oki_8192
 */
export const MechanicalButton: React.FC<MechanicalButtonProps> = ({
  id,
  type = "button",
  onClick,
  disabled = false,
  title,
  size = "md",
  variant = "cyan",
  className = "",
  btnClassName = "",
  children,
  icon,
  showAmbient = true,
  showReflection = false,
  active = false,
  fullWidth = false,
}) => {
  const sizeClass = fullWidth
    ? "wx-wrap--full w-full"
    : {
        xs: "wx-wrap--xs",
        sm: "wx-wrap--sm",
        md: "wx-wrap--md",
        lg: "wx-wrap--lg",
        wide: "wx-wrap--wide",
        full: "wx-wrap--full w-full",
      }[size] || "wx-wrap--md";

  const variantClass = {
    cyan: "wx-wrap--cyan",
    gold: "wx-wrap--gold",
    danger: "wx-wrap--danger",
    emerald: "wx-wrap--emerald",
    neutral: "wx-wrap--neutral",
  }[variant] || "wx-wrap--cyan";

  const textLabel = typeof children === "string" ? children : undefined;

  return (
    <div className={`wx-wrap ${sizeClass} ${variantClass} ${className}`}>
      {showAmbient && <div className="wx-ambient" />}

      <button
        id={id}
        type={type}
        onClick={onClick}
        disabled={disabled}
        title={title || textLabel}
        aria-label={title || textLabel}
        className={`wx-btn ${active ? "wx-btn--active" : ""} ${btnClassName}`}
      >
        <div className="wx-panel wx-panel--left" />
        <div className="wx-panel wx-panel--right" />

        <div className="wx-face">
          <i className="wx-screw wx-screw--tl" />
          <i className="wx-screw wx-screw--tr" />
          <i className="wx-screw wx-screw--bl" />
          <i className="wx-screw wx-screw--br" />

          <DynamicFitText icon={icon}>{children}</DynamicFitText>
        </div>

        <div className="wx-glow" />
        <div className="wx-pulse" />
      </button>

      {showReflection && <div className="wx-reflection" />}
    </div>
  );
};

