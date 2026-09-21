import React from "react";
import { ColorPreset, NODE_COLOR_PRESETS } from "./nodeColorPresets";

interface NodeColorPickerBodyProps {
  bgColor: string;
  setBgColor: (val: string) => void;
  borderColor: string;
  setBorderColor: (val: string) => void;
  previewBg: string;
  previewBorder: string;
  labelPreview?: string;
  emojiPreview?: string;
  onApplyPreset: (preset: ColorPreset) => void;
}

export const NodeColorPickerBody: React.FC<NodeColorPickerBodyProps> = ({
  bgColor,
  setBgColor,
  borderColor,
  setBorderColor,
  previewBg,
  previewBorder,
  labelPreview = "Nama Kotak",
  emojiPreview = "",
  onApplyPreset,
}) => {
  return (
    <div className="px-3.5 pb-3.5 pt-2 border-t border-cyan-500/20 space-y-3 animate-fade-in">
      {/* Mini Live Preview */}
      <div className="p-2.5 rounded-xl bg-black border border-cyan-500/30 flex items-center justify-between gap-3">
        <span className="text-[11px] text-neutral-400">Pratinjau Kartu:</span>
        <div
          className="px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md max-w-[240px] truncate"
          style={{
            backgroundColor: previewBg,
            borderColor: previewBorder,
            borderWidth: "2.5px",
            borderStyle: "solid",
            color: "#ffffff",
          }}
          id="node-color-live-preview"
        >
          {emojiPreview && <span className="text-sm">{emojiPreview}</span>}
          <span className="truncate">{labelPreview || "Nama Kotak"}</span>
        </div>
      </div>

      {/* Presets List */}
      <div>
        <label className="block text-[11px] text-neutral-400 mb-1.5 font-medium">
          Pilihan Palet Siap Pakai:
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {NODE_COLOR_PRESETS.map((preset) => {
            const isSelected =
              bgColor.toLowerCase() === preset.bgColor.toLowerCase() &&
              borderColor.toLowerCase() === preset.borderColor.toLowerCase();

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className={`p-1.5 rounded-lg border text-[11px] flex items-center gap-1.5 transition-all text-left cursor-pointer ${
                  isSelected
                    ? "bg-black border-cyan-400 ring-1 ring-cyan-400 text-white shadow-sm"
                    : "bg-black hover:bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                }`}
                id={`btn-preset-color-${preset.id}`}
              >
                <div
                  className="w-4 h-4 rounded-full shrink-0 border"
                  style={{
                    backgroundColor: preset.bgColor,
                    borderColor: preset.borderColor,
                    borderWidth: "2px",
                  }}
                />
                <span className="truncate">{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Color Pickers */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {/* Fill Color */}
        <div className="p-2 rounded-xl bg-black border border-cyan-500/20 space-y-1">
          <label className="block text-[10px] text-neutral-400 font-medium">
            Warna Isi (Fill/Latar)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor || "#4f46e5"}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-7 h-7 rounded-lg border border-neutral-700 cursor-pointer bg-transparent p-0"
              id="input-picker-node-bg"
              title="Pilih warna latar kartu"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              placeholder="#4f46e5"
              className="w-full text-xs font-mono px-2 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-400"
              id="input-hex-node-bg"
            />
          </div>
        </div>

        {/* Stroke / Border Color */}
        <div className="p-2 rounded-xl bg-black border border-cyan-500/20 space-y-1">
          <label className="block text-[10px] text-neutral-400 font-medium">
            Warna Garis Tepi (Stroke/Border)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={borderColor || "#818cf8"}
              onChange={(e) => setBorderColor(e.target.value)}
              className="w-7 h-7 rounded-lg border border-neutral-700 cursor-pointer bg-transparent p-0"
              id="input-picker-node-border"
              title="Pilih warna garis tepi kartu"
            />
            <input
              type="text"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              placeholder="#818cf8"
              className="w-full text-xs font-mono px-2 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-400"
              id="input-hex-node-border"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
