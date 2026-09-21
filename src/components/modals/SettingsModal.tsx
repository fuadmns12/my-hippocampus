import React, { useEffect, useState } from "react";
import { Settings, X, ShieldCheck } from "lucide-react";
import { useSoundEffects } from "../../hooks/useSoundEffects";
import { useHaptics } from "../../hooks/useHaptics";
import { usePWAInstall } from "../../hooks/usePWAInstall";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { usePWAOfflineManager } from "../../hooks/usePWAOfflineManager";
import { ConfirmOfflineModal } from "./ConfirmOfflineModal";
import { YouTubeMusicSection } from "./YouTubeMusicSection";
import { SoundAndHapticSection } from "./settings/SoundAndHapticSection";
import { PWAOfflineSection } from "./settings/PWAOfflineSection";
import { ThemeModeSection } from "./settings/ThemeModeSection";

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isSoundEnabled, toggleSound } = useSoundEffects();
  const {
    isHapticEnabled,
    isSupported: isHapticSupported,
    toggleHaptic,
  } = useHaptics();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const {
    isOfflineEnabled,
    isProcessing,
    showConfirmModal,
    requestEnableOffline,
    confirmEnableOffline,
    cancelEnableOffline,
    disableOffline,
  } = usePWAOfflineManager();
  const isOnline = useOnlineStatus();
  const [, setOfflineModalToast] = useState<string | null>(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    await install();
  };

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="settings-modal"
        className="bg-black border border-cyan-500/40 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-950/60 relative text-white overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-cyan-500/30 bg-black">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-black border border-cyan-500/50 text-white">
              <Settings className="w-5 h-5 text-white animate-[spin_10s_linear_infinite]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-wider text-white">
                PENGATURAN & PREFERENSI
              </h2>
              <p className="text-[11px] sm:text-xs text-white font-mono">
                Audio, Haptik, PWA Offline & Instalasi
              </p>
            </div>
          </div>
          <button
            id="btn-close-settings-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black border border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 hover:bg-neutral-900 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
            title="Tutup Pengaturan"
          >
            <X className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm text-neutral-300">
          {/* Section 0: Theme Mode (Dark / Light) */}
          <ThemeModeSection />

          {/* Section 1: Audio & Haptic Controls */}
          <SoundAndHapticSection
            isSoundEnabled={isSoundEnabled}
            toggleSound={toggleSound}
            isHapticEnabled={isHapticEnabled}
            isHapticSupported={isHapticSupported}
            toggleHaptic={toggleHaptic}
          />

          {/* Section 2: PWA Offline Support & Installation */}
          <PWAOfflineSection
            isOfflineEnabled={isOfflineEnabled}
            isProcessing={isProcessing}
            isOnline={isOnline}
            isInstalled={isInstalled}
            isInstallable={isInstallable}
            isIOS={isIOS}
            onDisableOffline={disableOffline}
            onRequestEnableOffline={requestEnableOffline}
            onConfirmEnableOffline={confirmEnableOffline}
            onInstallClick={handleInstallClick}
          />

          {/* Section 3: Privacy & Security */}
          <div className="p-3 rounded-xl bg-black border border-neutral-800 flex items-start gap-2.5 text-[11px] text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <p>
              Privasi terjamin: Data mind map Anda tidak diunggah ke server
              pihak ketiga manapun secara diam-diam. Seluruh pemrosesan grafis
              dan penyimpanan data dijalankan di perangkat lokal Anda.
            </p>
          </div>

          {/* Section 4: YouTube Music Background Player */}
          <YouTubeMusicSection />
        </div>
      </div>

      {/* Dialog Konfirmasi Mode Offline */}
      <ConfirmOfflineModal
        isOpen={showConfirmModal}
        onConfirm={async () => {
          await confirmEnableOffline();
          setOfflineModalToast(
            "Mode Offline berhasil diaktifkan. Berkas aplikasi tersimpan di cache."
          );
          setTimeout(() => setOfflineModalToast(null), 4000);
        }}
        onCancel={cancelEnableOffline}
        isProcessing={isProcessing}
      />
    </div>
  );
};
