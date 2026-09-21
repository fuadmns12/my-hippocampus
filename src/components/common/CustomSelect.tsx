import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

export interface CustomSelectOption {
  value: string;
  label: string;
  subLabel?: string;
  badge?: string;
  icon?: React.ReactNode;
  colorSwatch?: string;
}

export interface CustomSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  maxMenuHeight?: string;
  ariaLabel?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder = "Pilih...",
  disabled = false,
  className = "",
  menuClassName = "",
  maxMenuHeight = "max-h-60",
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (disabled) return;
    soundFx.play("click");
    setIsOpen((prev) => !prev);
  };

  const handleSelectOption = (optValue: string) => {
    soundFx.play("click");
    onChange(optValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDropdown();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = options.findIndex((opt) => opt.value === value);
        const nextIndex = (currentIndex + 1) % options.length;
        onChange(options[nextIndex].value);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = options.findIndex((opt) => opt.value === value);
        const prevIndex = (currentIndex - 1 + options.length) % options.length;
        onChange(options[prevIndex].value);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      id={id ? `${id}-container` : undefined}
    >
      {/* Custom Select Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || placeholder}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className={`w-full bg-black border border-cyan-500/30 hover:border-cyan-400 text-white text-[11px] sm:text-xs rounded-xl px-3 py-2 min-h-[40px] font-medium flex items-center justify-between gap-2 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 cursor-pointer transition-all shadow-sm active:scale-[0.99] ${
          isOpen ? "border-cyan-400 ring-1 ring-cyan-400/50 bg-black" : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="flex items-center gap-2 truncate text-left">
          {selectedOption?.colorSwatch && (
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
              style={{ backgroundColor: selectedOption.colorSwatch }}
            />
          )}
          {selectedOption?.icon && (
            <span className="shrink-0 text-white">{selectedOption.icon}</span>
          )}
          <span className="truncate text-white">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.subLabel && (
            <span className="text-[10px] text-white truncate hidden sm:inline">
              ({selectedOption.subLabel})
            </span>
          )}
        </span>

        <span className="flex items-center gap-1 shrink-0 ml-1">
          {selectedOption?.badge && (
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-black text-white border border-cyan-500/30">
              {selectedOption.badge}
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "text-cyan-400 rotate-180" : "text-white"
            }`}
          />
        </span>
      </button>

      {/* Custom Dropdown Menu with CSS animations and dark theme styling */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 right-0 top-full mt-1.5 z-50 bg-black backdrop-blur-xl border border-cyan-500/40 rounded-xl shadow-2xl p-1 overflow-y-auto ${maxMenuHeight} ${menuClassName}`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#0891b2 #0a0a0a",
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelectOption(opt.value)}
                className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-[11px] sm:text-xs font-medium cursor-pointer transition-all mb-0.5 last:mb-0 ${
                  isSelected
                    ? "bg-black text-white border border-cyan-500/40 shadow-sm"
                    : "text-white hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  {opt.colorSwatch && (
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                      style={{ backgroundColor: opt.colorSwatch }}
                    />
                  )}
                  {opt.icon && (
                    <span className="shrink-0 text-white">
                      {opt.icon}
                    </span>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-white">{opt.label}</span>
                    {opt.subLabel && (
                      <span className="text-[10px] text-white truncate">
                        {opt.subLabel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {opt.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-black text-white border border-neutral-700">
                      {opt.badge}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
