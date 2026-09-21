import React, { useState } from "react";
import {
  Smartphone,
  CheckCircle2,
  Download,
  Share,
  PlusSquare,
  Info,
} from "lucide-react";

interface PWAInstallCardProps {
  isInstalled: boolean;
  isInstallable: boolean;
  isIOS: boolean;
  isOfflineEnabled: boolean;
  onConfirmEnableOffline: () => Promise<void>;
  onInstallClick: () => Promise<void>;
}

export const PWAInstallCard: React.FC<PWAInstallCardProps> = ({
  isInstalled,
  isInstallable,
  isIOS,
  isOfflineEnabled,
  onConfirmEnableOffline,
  onInstallClick,
}) => {
  const [showIosDetails, setShowIosDetails] = useState(false);
  const [installSuccessMessage, setInstallSuccessMessage] = useState(false);

  const handleInstall = async () => {
    if (!isOfflineEnabled) {
      await onConfirmEnableOffline();
    }
    await onInstallClick();
    setInstallSuccessMessage(true);
    setTimeout(() => setInstallSuccessMessage(false), 4000);
  };

  return (
    <div className="pt-2 border-t border-neutral-800">
      {isInstalled ? (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-black border border-emerald-500/40 text-white text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          <span>
            Aplikasi My Hippocampus telah terpasang di perangkat Anda sebagai
            aplikasi standalone.
          </span>
        </div>
      ) : isInstallable ? (
        <div className="space-y-2">
          <button
            id="modal-btn-install-pwa"
            type="button"
            onClick={handleInstall}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-cyan-950 cursor-pointer active:scale-98"
          >
            <Download className="w-4 h-4 text-white" />
            PASANG APLIKASI KE LAYAR UTAMA (INSTALL PWA)
          </button>
          <p className="text-[10px] text-center text-neutral-400 font-mono">
            Buka My Hippocampus seperti aplikasi native langsung dari home screen.
          </p>
        </div>
      ) : isIOS ? (
        <div className="space-y-2.5 bg-black p-3.5 rounded-xl border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-white" />
              Instalasi di iPhone / iPad (iOS Safari)
            </span>
            <button
              type="button"
              onClick={() => setShowIosDetails((prev) => !prev)}
              className="text-[11px] text-white hover:underline cursor-pointer"
            >
              {showIosDetails ? "Sembunyikan Cara" : "Lihat Cara"}
            </button>
          </div>

          {showIosDetails && (
            <ol className="text-[11px] text-neutral-300 space-y-1.5 list-decimal list-inside bg-black p-2.5 rounded-lg border border-neutral-800 leading-relaxed">
              <li>
                Buka menu Safari lalu ketuk tombol{" "}
                <strong className="text-white inline-flex items-center gap-1">
                  <Share className="w-3 h-3 text-white" /> Bagikan (Share)
                </strong>
                .
              </li>
              <li>
                Gulir ke bawah dan pilih opsi{" "}
                <strong className="text-white inline-flex items-center gap-1">
                  <PlusSquare className="w-3 h-3 text-white" /> Tambah ke Layar
                  Utama (Add to Home Screen)
                </strong>
                .
              </li>
              <li>
                Ketuk <strong>Tambah (Add)</strong> di pojok kanan atas. Ikon My
                Hippocampus akan muncul di layar utama iOS Anda!
              </li>
            </ol>
          )}
        </div>
      ) : (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-black border border-neutral-800 text-[11px] text-neutral-400">
          <Info className="w-4 h-4 text-white shrink-0 mt-0.5" />
          <span>
            PWA siap digunakan. Jika tombol pasang belum muncul otomatis, Anda
            dapat menginstal melalui menu peramban Chrome/Edge (ikon instal di
            kolom alamat).
          </span>
        </div>
      )}

      {installSuccessMessage && (
        <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-black border border-emerald-500/50 text-white text-xs">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          Instalasi berhasil dimulai! Terima kasih telah menginstal My Hippocampus.
        </div>
      )}
    </div>
  );
};
