import React, { useState, useEffect } from "react";
import { AlertTriangle, X, Database } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

export interface ConfirmClearCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (alsoClearInputs: boolean) => void;
  mapTitle?: string;
  totalMapsCount?: number;
}

export const ConfirmClearCanvasModal: React.FC<ConfirmClearCanvasModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  mapTitle,
  totalMapsCount = 1,
}) => {
  const [alsoClearInputs, setAlsoClearInputs] = useState(false);

  // Handle ESC key to dismiss
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

  if (!isOpen) return null;

  return (
    <div
      id="clear-canvas-modal-overlay"
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={() => {
        soundFx.play("click");
        onClose();
      }}
    >
      <div
        id="clear-canvas-modal-content"
        className="bg-black border border-cyan-500/40 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl shadow-cyan-950/30 relative text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundFx.play("click");
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-black border border-cyan-400 hover:border-cyan-300 hover:bg-neutral-900 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
          title="Batal dan tutup"
          aria-label="Tutup"
        >
          <X className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Warning Icon & Heading */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-black border border-red-500/50 flex items-center justify-center shrink-0 text-rose-400 shadow-lg shadow-red-950/50">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Kosongkan Kanvas Mind Map?
            </h3>
            <p className="text-xs text-white mt-0.5 font-medium">
              Konfirmasi penghapusan tampilan kanvas
            </p>
          </div>
        </div>

        {/* Content & Explanations */}
        <div className="space-y-3 text-xs sm:text-sm text-white leading-relaxed bg-black p-3.5 rounded-xl border border-neutral-800">
          <p>
            Semua visualisasi mind map{" "}
            {mapTitle ? (
              <span className="font-semibold text-white">"{mapTitle}"</span>
            ) : null}{" "}
            {totalMapsCount > 1 ? (
              <span className="font-semibold text-white">
                ({totalMapsCount} mind map di kanvas)
              </span>
            ) : null}{" "}
            akan dihapus dari kanvas dan kanvas akan kembali ke keadaan kosong.
          </p>

          <div className="flex items-center gap-2 pt-1 text-white text-xs">
            <Database className="w-3.5 h-3.5 text-white shrink-0" />
            <span>
              Catatan: Data yang telah disimpan di{" "}
              <strong className="text-white font-semibold">Memory Card</strong> tetap aman
              dan tidak akan hilang.
            </span>
          </div>
        </div>

        {/* Optional Toggle: Also clear form input fields */}
        <label className="flex items-center gap-2.5 my-4 p-2.5 rounded-xl bg-black border border-neutral-800/80 hover:border-neutral-700 text-xs text-white cursor-pointer select-none transition-colors">
          <input
            type="checkbox"
            checked={alsoClearInputs}
            onChange={(e) => {
              soundFx.play("toggle");
              setAlsoClearInputs(e.target.checked);
            }}
            className="w-4 h-4 rounded border-neutral-700 bg-black text-white focus:ring-red-500 focus:ring-offset-neutral-900 cursor-pointer"
          />
          <span>Kosongkan juga teks topik & daftar nama di formulir input</span>
        </label>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800/80 select-none">
          <button
            id="btn-cancel-clear-canvas"
            type="button"
            onClick={() => {
              soundFx.play("click");
              onClose();
            }}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold tracking-wider bg-black text-neutral-300 border border-neutral-700/80 hover:bg-neutral-800 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
          >
            Batal
          </button>
          <button
            id="btn-confirm-clear-canvas"
            type="button"
            onClick={() => {
              soundFx.play("delete");
              onConfirm(alsoClearInputs);
            }}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold tracking-wider bg-black text-white border border-red-500/50 hover:bg-red-950/40 hover:border-red-400 transition-all duration-150 active:scale-95 cursor-pointer shadow-md"
            title="Kosongkan Kanvas"
            aria-label="Kosongkan Kanvas"
          >
            Iya
          </button>
        </div>
      </div>
    </div>
  );
};
