import React, { useEffect } from "react";
import { Folder, X, Check, Database, Layers } from "lucide-react";
import { PresetTemplate } from "../../types";
import { getPresetNoteCount, getLayoutLabel } from "../header/PresetSelectorDropdown";
import { soundFx } from "../../utils/soundEffects";

export interface ConfirmLoadPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  preset: PresetTemplate | null;
  hasExistingCanvasData?: boolean;
}

export const ConfirmLoadPresetModal: React.FC<ConfirmLoadPresetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  preset,
  hasExistingCanvasData = false,
}) => {
  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        soundFx.play("click");
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !preset) return null;

  const noteCount = getPresetNoteCount(preset);
  const isSpesifik = preset.folder === "Spesifik";

  return (
    <div
      id="confirm-load-preset-overlay"
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={() => {
        soundFx.play("click");
        onClose();
      }}
    >
      <div
        id="confirm-load-preset-modal"
        className="bg-black border border-cyan-500/40 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl shadow-cyan-950/40 relative text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundFx.play("click");
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-black border border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 hover:bg-neutral-900 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
          title="Batal dan tutup"
          aria-label="Tutup"
        >
          <X className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-start gap-3.5 mb-4">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg bg-black border border-cyan-500/50 text-white"
          >
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Muat Template Contoh?
            </h3>
            <p className="text-xs text-white mt-0.5">
              Konfirmasi pemuatan dataset ke formulir & kanvas
            </p>
          </div>
        </div>

        {/* Selected Preset Card Preview */}
        <div className="bg-black border border-neutral-800 rounded-xl p-3.5 mb-4">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-semibold text-sm text-white">
              {preset.title}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className="inline-flex items-center gap-1 text-[10px] text-white px-1.5 py-0.5 rounded font-medium border bg-black border-cyan-500/40"
              >
                <Folder className="w-2.5 h-2.5 text-white" />
                {preset.folder || "Umum"}
              </span>
              {noteCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] text-white bg-black border border-cyan-500/40 px-1.5 py-0.5 rounded font-medium">
                  📝 {noteCount} Catatan
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-white leading-relaxed mb-2.5">
            {preset.subtitle}
          </p>

          <div className="w-full flex flex-wrap items-center gap-1 sm:gap-1.5 text-[7.5px] sm:text-[8.5px] text-white pt-1 border-t border-neutral-800/80">
            <span className="bg-black px-1.5 sm:px-2 py-0.5 rounded border border-neutral-700/60 font-mono text-white whitespace-nowrap leading-tight shrink-0">
              {preset.names.length} item
            </span>
            <span className="bg-black px-1.5 sm:px-2 py-0.5 rounded border border-neutral-700/60 text-white whitespace-nowrap leading-tight shrink-0">
              📐 {getLayoutLabel(preset.suggestedLayout)}
            </span>
            <span className="bg-black px-1.5 sm:px-2 py-0.5 rounded border border-neutral-700/60 capitalize text-white whitespace-nowrap leading-tight shrink-0">
              🎨 {preset.suggestedTheme}
            </span>
            {preset.suggestedGroupingStrategy && (
              <span className="bg-black px-1.5 sm:px-2 py-0.5 rounded border border-cyan-500/30 text-white whitespace-nowrap leading-tight shrink-0">
                {preset.suggestedGroupingStrategy === "flat-direct"
                  ? "⚡ Spoke Langsung"
                  : preset.suggestedGroupingStrategy === "balanced-spokes"
                  ? preset.customConfig?.balancedBranchPrefix
                    ? `⚖️ ${preset.customConfig.balancedBranchCount || 4} ${preset.customConfig.balancedBranchPrefix}`
                    : "⚖️ Terbagi Seimbang"
                  : "🔤 Abjad A-Z"}
              </span>
            )}
            <span className="px-1.5 py-0.5 rounded border text-[7px] sm:text-[8px] font-mono uppercase tracking-wider text-white bg-black border-cyan-500/40 whitespace-nowrap leading-tight shrink-0">
              {preset.folder}
            </span>
          </div>
        </div>

        {/* Warning / Explanation Details */}
        <div className="space-y-2 text-xs text-white leading-relaxed bg-black p-3 rounded-xl border border-neutral-800/80 mb-5">
          <p>
            {hasExistingCanvasData ? (
              <>
                Memuat template ini akan{" "}
                <strong className="text-white font-semibold">menggantikan</strong> topik,
                daftar nama, dan tampilan mind map yang sedang aktif di kanvas saat ini.
              </>
            ) : (
              <>
                Dataset ini akan diterapkan ke formulir input dan langsung
                divisualisasikan secara interaktif di kanvas.
              </>
            )}
          </p>
          <div className="flex items-center gap-2 pt-1 text-white text-[11px]">
            <Database className="w-3.5 h-3.5 text-white shrink-0" />
            <span>
              Riwayat yang sudah tersimpan di{" "}
              <strong className="text-white font-semibold">Memory Card</strong> tetap aman.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800/80 select-none">
          <button
            id="btn-cancel-load-preset"
            type="button"
            onClick={() => {
              soundFx.play("click");
              onClose();
            }}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold tracking-wider bg-black text-neutral-300 border border-neutral-700/80 hover:bg-neutral-900 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
          >
            Batal
          </button>
          <button
            id="btn-confirm-load-preset"
            type="button"
            onClick={() => {
              soundFx.play("success");
              onConfirm();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold tracking-wider bg-black text-white border border-cyan-500/50 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-md shadow-cyan-950/50"
          >
            <Check className="w-3.5 h-3.5 text-white" />
            <span>MUAT TEMPLATE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
