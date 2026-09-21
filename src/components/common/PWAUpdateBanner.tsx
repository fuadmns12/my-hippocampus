import React from "react";
import { Sparkles, RefreshCw, X, ArrowUpCircle } from "lucide-react";
import { usePWAOffline } from "../../context/PWAOfflineContext";

export const PWAUpdateBanner: React.FC = () => {
  const { needRefresh, applyUpdate, dismissUpdateNotification } =
    usePWAOffline();

  if (!needRefresh) return null;

  return (
    <aside
      id="pwa-update-banner"
      aria-label="Pemberitahuan Pembaruan PWA"
      className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg p-3.5 sm:p-4 rounded-2xl bg-black/95 border border-cyan-400/80 shadow-2xl shadow-cyan-950/80 backdrop-blur-xl text-white animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 shrink-0 mt-0.5 sm:mt-0">
            <ArrowUpCircle className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold tracking-wide text-white flex items-center gap-1.5">
                Pembaruan Versi Tersedia!
              </h4>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-cyan-400 text-black uppercase">
                Baru
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-300 mt-0.5 leading-relaxed">
              Berkas sistem terbaru telah siap. Muat ulang sekarang untuk menikmati fitur mutakhir tanpa kehilangan data diagram Anda.
            </p>
          </div>
        </div>

        <button
          id="btn-pwa-dismiss-update"
          type="button"
          onClick={dismissUpdateNotification}
          className="p-1.5 rounded-lg bg-black border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer shrink-0"
          title="Tutup pemberitahuan"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-end gap-2.5">
        <button
          id="btn-pwa-update-later"
          type="button"
          onClick={dismissUpdateNotification}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
        >
          Nanti Saja
        </button>
        <button
          id="btn-pwa-update-now"
          type="button"
          onClick={applyUpdate}
          className="px-4 py-1.5 rounded-xl text-xs font-bold tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 active:scale-95 transition-all shadow-md shadow-cyan-950 flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>PERBARUI SEKARANG</span>
        </button>
      </div>
    </aside>
  );
};
