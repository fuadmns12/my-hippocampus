import React from "react";
import { WifiOff, AlertTriangle } from "lucide-react";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { safeStorage } from "../../utils/safeStorage";
import { PWA_OFFLINE_STORAGE_KEY } from "../../context/PWAOfflineContext";

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const isOfflineCacheActive =
    safeStorage.getItem(PWA_OFFLINE_STORAGE_KEY) === "true";

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-indicator"
      className={`fixed bottom-4 left-4 z-40 flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-xs font-semibold shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isOfflineCacheActive
          ? "bg-black border-amber-500/60 text-white"
          : "bg-black border-neutral-700 text-neutral-300"
      }`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOfflineCacheActive ? "bg-amber-400" : "bg-neutral-400"
          }`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            isOfflineCacheActive ? "bg-amber-500" : "bg-neutral-400"
          }`}
        ></span>
      </span>
      {isOfflineCacheActive ? (
        <>
          <WifiOff className="w-3.5 h-3.5 text-white shrink-0" />
          <span>Mode Offline Aktif. Menggunakan berkas cache lokal.</span>
        </>
      ) : (
        <>
          <AlertTriangle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>Koneksi Terputus (Mode Online Saja).</span>
        </>
      )}
    </div>
  );
};
