import React, { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

interface ConfirmClearNamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalCount: number;
}

export const ConfirmClearNamesModal: React.FC<ConfirmClearNamesModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalCount,
}) => {
  // Close on Escape key
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
      id="confirm-clear-names-modal-overlay"
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 select-none"
      onClick={() => {
        soundFx.play("click");
        onClose();
      }}
    >
      <div
        id="confirm-clear-names-modal"
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

        {/* Warning Icon & Heading */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-black border border-rose-500/50 flex items-center justify-center shrink-0 text-rose-400 shadow-lg shadow-rose-950/50">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Hapus Semua Nama dari Daftar?
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">
              Konfirmasi pengosongan daftar nama / cabang
            </p>
          </div>
        </div>

        {/* Content & Explanations */}
        <div className="space-y-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed bg-black p-3.5 rounded-xl border border-neutral-800">
          <p>
            Apakah Anda yakin ingin menghapus seluruh{" "}
            <strong className="text-white font-mono font-bold">
              {totalCount} nama
            </strong>{" "}
            dari daftar formulir?
          </p>
          <p className="text-[11px] text-neutral-400">
            Seluruh teks nama yang telah dimasukkan akan dikosongkan seketika.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-neutral-800/80 select-none">
          <button
            id="btn-cancel-clear-all-names"
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
            id="btn-confirm-clear-all-names"
            type="button"
            onClick={() => {
              soundFx.play("delete");
              onConfirm();
              onClose();
            }}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold tracking-wider bg-black text-white border border-red-500/50 hover:bg-red-950/40 hover:border-red-400 transition-all duration-150 active:scale-95 cursor-pointer shadow-md"
            title={`Hapus semua (${totalCount})`}
            aria-label={`Hapus semua (${totalCount})`}
          >
            Iya
          </button>
        </div>
      </div>
    </div>
  );
};
