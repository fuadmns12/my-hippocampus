import React, { useEffect } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  confirmLabel = "YA, HAPUS SEKARANG",
  cancelLabel = "BATAL",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        soundFx.play("click");
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="confirm-delete-modal-overlay"
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[10000] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 select-none"
      onClick={() => {
        soundFx.play("click");
        onClose();
      }}
    >
      <div
        id="confirm-delete-modal-card"
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

        {/* Warning Icon & Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="p-3 rounded-2xl bg-black border border-rose-500/50 text-rose-400 shadow-lg shadow-rose-950/30 shrink-0">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <div className="pr-6">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              {title}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Highlight Item Name if provided */}
        {itemName && (
          <div className="mb-5 px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-700/80 flex items-center gap-2.5">
            <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="text-xs font-semibold text-white truncate">
              {itemName}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => {
              soundFx.play("click");
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold tracking-wider bg-black border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.play("delete");
              onConfirm();
            }}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold tracking-wider bg-black border border-rose-500/60 hover:border-rose-400 hover:bg-rose-950/40 text-white transition-all cursor-pointer active:scale-95 shadow-lg shadow-rose-950/30"
          >
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
