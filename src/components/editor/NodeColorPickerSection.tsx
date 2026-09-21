import React, { useState } from "react";
import { Palette, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { ColorPreset, NODE_COLOR_PRESETS } from "./nodeColorPresets";
import { NodeColorPickerBody } from "./NodeColorPickerBody";

export type { ColorPreset };
export { NODE_COLOR_PRESETS };

interface NodeColorPickerSectionProps {
  bgColor: string;
  setBgColor: (val: string) => void;
  borderColor: string;
  setBorderColor: (val: string) => void;
  labelPreview?: string;
  emojiPreview?: string;
}

export const NodeColorPickerSection: React.FC<NodeColorPickerSectionProps> = ({
  bgColor,
  setBgColor,
  borderColor,
  setBorderColor,
  labelPreview = "Label Kotak",
  emojiPreview = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isCustomActive = Boolean(bgColor || borderColor);

  const handleApplyPreset = (preset: ColorPreset) => {
    setBgColor(preset.bgColor);
    setBorderColor(preset.borderColor);
  };

  const handleResetToDefault = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBgColor("");
    setBorderColor("");
  };

  // Compute preview styles
  const previewBg = bgColor || "#18181b";
  const previewBorder = borderColor || "#38bdf8";

  return (
    <div
      className="rounded-xl border border-cyan-500/30 bg-black overflow-hidden"
      id="section-node-color-picker"
    >
      {/* Accordion Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-neutral-900/50 transition-colors cursor-pointer"
        id="btn-toggle-color-picker-accordion"
      >
        <div className="flex items-center gap-2">
          <Palette
            className={`w-4 h-4 ${
              isOpen ? "text-cyan-400" : "text-white"
            }`}
          />
          <span className="text-white font-medium text-xs">
            Warna Kartu & Garis Tepi
          </span>
          {isCustomActive ? (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black border border-cyan-500/40 text-[11px] text-white">
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/60 shrink-0"
                style={{ backgroundColor: previewBg, borderColor: previewBorder }}
              />
              <span>Kustom</span>
            </div>
          ) : (
            <span className="text-[11px] text-neutral-400">
              (Tema Default)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isCustomActive && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleResetToDefault}
              className="flex items-center gap-1 text-[10px] text-white hover:text-white hover:underline cursor-pointer"
              title="Kembalikan ke warna tema kanvas"
              id="btn-reset-node-color"
            >
              <RotateCcw className="w-2.5 h-2.5 text-white" />
              <span>Reset</span>
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-cyan-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white" />
          )}
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <NodeColorPickerBody
          bgColor={bgColor}
          setBgColor={setBgColor}
          borderColor={borderColor}
          setBorderColor={setBorderColor}
          previewBg={previewBg}
          previewBorder={previewBorder}
          labelPreview={labelPreview}
          emojiPreview={emojiPreview}
          onApplyPreset={handleApplyPreset}
        />
      )}
    </div>
  );
};

