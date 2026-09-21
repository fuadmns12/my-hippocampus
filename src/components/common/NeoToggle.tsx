import React from "react";

interface NeoToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  showStatus?: boolean;
  className?: string;
  title?: string;
  "aria-label"?: string;
}

export const NeoToggle: React.FC<NeoToggleProps> = ({
  id,
  checked,
  onChange,
  disabled = false,
  size = "md",
  showStatus = false,
  className = "",
  title,
  "aria-label": ariaLabel,
}) => {
  return (
    <div
      className={`neo-toggle-container ${size === "sm" ? "neo-toggle-sm" : ""} ${
        disabled ? "opacity-40 pointer-events-none cursor-not-allowed" : ""
      } ${className}`}
      title={title}
    >
      <input
        className="neo-toggle-input"
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={ariaLabel || title || "Toggle switch"}
      />
      <label className="neo-toggle" htmlFor={id}>
        <div className="neo-track">
          <div className="neo-background-layer" />
          <div className="neo-grid-layer" />
          <div className="neo-spectrum-analyzer">
            <div className="neo-spectrum-bar" />
            <div className="neo-spectrum-bar" />
            <div className="neo-spectrum-bar" />
            <div className="neo-spectrum-bar" />
            <div className="neo-spectrum-bar" />
          </div>
          <div className="neo-track-highlight" />
        </div>

        <div className="neo-thumb">
          <div className="neo-thumb-ring" />
          <div className="neo-thumb-core">
            <div className="neo-thumb-icon">
              <div className="neo-thumb-wave" />
              <div className="neo-thumb-pulse" />
            </div>
          </div>
        </div>

        <div className="neo-gesture-area" />

        <div className="neo-interaction-feedback">
          <div className="neo-ripple" />
          <div className="neo-progress-arc" />
        </div>

        {showStatus && (
          <div className="neo-status">
            <div className="neo-status-indicator">
              <div className="neo-status-dot" />
              <div className="neo-status-text" />
            </div>
          </div>
        )}
      </label>
    </div>
  );
};
