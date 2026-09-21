import React, { useEffect } from "react";
import { Download, Globe, X, HardDrive, CheckCircle2, ShieldAlert } from "lucide-react";

export interface ConfirmOfflineModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const ConfirmOfflineModal: React.FC<ConfirmOfflineModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isProcessing = false,
}) => {
  // Dismiss on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isProcessing) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel, isProcessing]);

  if (!isOpen) return null;

  return (
    <div
      id="confirm-offline-modal-overlay"
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[60] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={!isProcessing ? onCancel : undefined}
    >
      <div
        id="confirm-offline-modal"
        className="bg-black border border-cyan-500/50 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl shadow-cyan-950/70 relative text-white overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-black border border-cyan-500/50 text-white">
              <Download className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-wide text-white">
                Konfirmasi Penyimpanan Offline
              </h3>
              <p className="text-xs text-white font-mono">
                Pilihan Pengunduhan Berkas Cache PWA
              </p>
            </div>
          </div>
          {!isProcessing && (
            <button
              id="btn-close-confirm-offline"
              type="button"
              onClick={onCancel}
              className="p-1.5 rounded-lg bg-black border border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 hover:bg-neutral-900 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4 text-cyan-400" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs sm:text-sm text-neutral-300">
          <div className="p-3.5 rounded-xl bg-black border border-neutral-800 flex items-start gap-3">
            <Globe className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">
                Mode Online Saja (Default)
              </p>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Jika Anda memilih untuk tetap online, aplikasi dimuat langsung dari server setiap kali dibuka tanpa mengunduh berkas cache ke memori perangkat. Hemat kuota dan tidak memakan ruang penyimpanan Anda.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-cyan-500/40 flex items-start gap-3">
            <HardDrive className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">
                Dukungan Offline PWA (Unduh Cache)
              </p>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Browser akan mengunduh berkas komponen tampilan (~1-2 MB) dan menyimpannya di memori lokal (*Cache Storage*). Dengan opsi ini, aplikasi dapat dibuka dan digunakan secara penuh saat Anda tidak memiliki sambungan internet atau dalam mode pesawat.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
            Anda dapat mematikan dan membersihkan berkas cache ini kapan saja melalui menu Pengaturan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-neutral-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            id="btn-cancel-enable-offline"
            type="button"
            disabled={isProcessing}
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-neutral-300 text-xs font-semibold tracking-wider transition-colors border border-neutral-700 cursor-pointer disabled:opacity-50"
          >
            TETAP MODE ONLINE SAJA
          </button>
          <button
            id="btn-confirm-enable-offline"
            type="button"
            disabled={isProcessing}
            onClick={onConfirm}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold tracking-wider transition-all shadow-md shadow-cyan-950/60 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            {isProcessing ? (
              <span>Mengunduh Berkas...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>YA, UNDUH & AKTIFKAN OFFLINE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
