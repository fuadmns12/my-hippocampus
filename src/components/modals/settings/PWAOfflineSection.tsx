import React, { useState } from "react";
import {
  Smartphone,
  HardDrive,
  Wifi,
  WifiOff,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ArrowUpCircle,
} from "lucide-react";
import { PWAInstallCard } from "./PWAInstallCard";
import { usePWAOffline } from "../../../context/PWAOfflineContext";

interface PWAOfflineSectionProps {
  isOfflineEnabled: boolean;
  isProcessing: boolean;
  isOnline: boolean;
  isInstalled: boolean;
  isInstallable: boolean;
  isIOS: boolean;
  onDisableOffline: () => Promise<void>;
  onRequestEnableOffline: () => void;
  onConfirmEnableOffline: () => Promise<void>;
  onInstallClick: () => Promise<void>;
}

export const PWAOfflineSection: React.FC<PWAOfflineSectionProps> = ({
  isOfflineEnabled,
  isProcessing,
  isOnline,
  isInstalled,
  isInstallable,
  isIOS,
  onDisableOffline,
  onRequestEnableOffline,
  onConfirmEnableOffline,
  onInstallClick,
}) => {
  const [offlineToastMessage, setOfflineToastMessage] = useState<string | null>(
    null
  );

  const {
    needRefresh,
    isCheckingUpdate,
    updateMessage,
    lastCheckedTime,
    checkForUpdate,
    applyUpdate,
  } = usePWAOffline();

  return (
    <div className="space-y-3 pt-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
        <Smartphone className="w-3.5 h-3.5 text-white" />
        PWA & Opsi Mode Offline
      </h3>

      {/* Mode Operasi: Online Saja vs Offline PWA */}
      <div className="p-4 rounded-xl bg-black border border-neutral-800 space-y-3">
        <div className="pb-3 border-b border-neutral-800 space-y-2.5">
          <div>
            <div className="font-semibold text-white text-xs sm:text-sm">
              Mode Penyimpanan Cache Berkas
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-1">
              {isOfflineEnabled
                ? "Berkas tampilan aplikasi tersimpan di memori lokal. Mate dapat dibuka saat offline atau mode pesawat."
                : "Aplikasi berjalan online tanpa mengunduh berkas cache ke perangkat. Hemat kuota dan memori penyimpanan."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border ${
                isOfflineEnabled
                  ? "bg-black text-white border-emerald-500/40"
                  : "bg-neutral-800 text-neutral-300 border-neutral-700"
              }`}
            >
              {isOfflineEnabled
                ? "OFFLINE AKTIF (CACHE TERSIMPAN)"
                : "ONLINE SAJA (TANPA CACHE)"}
            </span>

            {isOfflineEnabled ? (
              <button
                id="btn-disable-offline-mode"
                type="button"
                disabled={isProcessing}
                onClick={async () => {
                  await onDisableOffline();
                  setOfflineToastMessage(
                    "Cache offline dihapus. Aplikasi kembali ke Mode Online Saja."
                  );
                  setTimeout(() => setOfflineToastMessage(null), 4000);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider text-white bg-black hover:bg-neutral-900 border border-amber-500/50 transition-all active:scale-95 cursor-pointer shrink-0 disabled:opacity-50"
              >
                HAPUS CACHE (ONLINE SAJA)
              </button>
            ) : (
              <button
                id="btn-request-offline-mode"
                type="button"
                disabled={isProcessing}
                onClick={onRequestEnableOffline}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider text-white bg-cyan-400 hover:bg-cyan-300 border border-cyan-400 font-bold transition-all active:scale-95 cursor-pointer shrink-0 disabled:opacity-50 shadow-sm shadow-cyan-950"
              >
                AKTIFKAN OFFLINE...
              </button>
            )}
          </div>
        </div>

        {offlineToastMessage && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-black border border-cyan-500/40 text-white text-xs">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>{offlineToastMessage}</span>
          </div>
        )}

        {/* Network & Local Storage Status */}
        <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
          <div className="flex items-center gap-2 font-medium text-neutral-300">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-white" />
                <span>Jaringan:</span>
                <span className="text-white font-mono text-[11px] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  Online
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-white" />
                <span>Jaringan:</span>
                <span className="text-white font-mono text-[11px] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                  Terputus
                </span>
              </>
            )}
          </div>

          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black text-neutral-400 border border-neutral-800">
            {isOfflineEnabled
              ? "Service Worker Aktif"
              : "Service Worker Nonaktif"}
          </span>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-neutral-300 bg-black p-3 rounded-lg border border-neutral-800">
          <HardDrive className="w-4 h-4 text-white shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white">
              Penyimpanan Dokumen Lokal (Local Storage)
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
              Data mind map, riwayat perubahan, dan folder Anda selalu
              tersimpan secara lokal di browser Anda. Pengguna online maupun
              offline tetap dapat menyimpan dan mengedit peta konsep secara
              mandiri.
            </p>
          </div>
        </div>

        {/* PWA Update Status & Check Handler */}
        {isOfflineEnabled && (
          <div className="p-3 rounded-xl bg-black border border-cyan-500/30 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-semibold text-white text-xs">
                  Pembaruan Sistem & Cache PWA
                </span>
              </div>
              <button
                id="btn-check-pwa-update"
                type="button"
                disabled={isCheckingUpdate || !isOnline}
                onClick={() => checkForUpdate()}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-cyan-300 hover:text-white bg-black hover:bg-neutral-900 border border-cyan-500/50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3 h-3 ${isCheckingUpdate ? "animate-spin" : ""}`}
                />
                <span>
                  {isCheckingUpdate ? "Memeriksa..." : "Periksa Pembaruan"}
                </span>
              </button>
            </div>

            {needRefresh ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-950/60 border border-cyan-400 text-white text-[11px]">
                <div className="flex items-center gap-2">
                  <ArrowUpCircle className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span>Versi baru siap dipasang!</span>
                </div>
                <button
                  id="btn-apply-pwa-update-settings"
                  type="button"
                  onClick={applyUpdate}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold text-black bg-cyan-400 hover:bg-cyan-300 cursor-pointer shadow-xs"
                >
                  Perbarui Sekarang
                </button>
              </div>
            ) : updateMessage ? (
              <p className="text-[11px] text-cyan-300/90 font-mono">
                {updateMessage}{" "}
                {lastCheckedTime && `(Terakhir dicek: ${lastCheckedTime})`}
              </p>
            ) : (
              <p className="text-[11px] text-neutral-400">
                Pembaruan website diunduh otomatis di latar belakang saat online. Klik tombol di atas untuk memeriksa secara manual.
              </p>
            )}
          </div>
        )}

        {/* Install PWA Button / Status */}
        <PWAInstallCard
          isInstalled={isInstalled}
          isInstallable={isInstallable}
          isIOS={isIOS}
          isOfflineEnabled={isOfflineEnabled}
          onConfirmEnableOffline={onConfirmEnableOffline}
          onInstallClick={onInstallClick}
        />
      </div>
    </div>
  );
};
