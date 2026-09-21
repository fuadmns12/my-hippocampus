import React from "react";
import { Volume2, VolumeX, Vibrate, VibrateOff } from "lucide-react";
import { device } from "../../../utils/deviceDetection";
import { NeoToggle } from "../../common/NeoToggle";

interface SoundAndHapticSectionProps {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  isHapticEnabled: boolean;
  isHapticSupported: boolean;
  toggleHaptic: () => void;
}

export const SoundAndHapticSection: React.FC<SoundAndHapticSectionProps> = ({
  isSoundEnabled,
  toggleSound,
  isHapticEnabled,
  isHapticSupported,
  toggleHaptic,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
        Umpan Balik & Interaktivitas
      </h3>

      {/* Sound FX Toggle Row */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-black border border-neutral-800 hover:border-neutral-700 transition-colors">
        <div className="flex items-start gap-3 pr-3">
          <div
            className={`p-2 rounded-lg border shrink-0 transition-colors ${
              isSoundEnabled
                ? "bg-black border-cyan-500/50 text-white"
                : "bg-neutral-800 border-neutral-700 text-neutral-500"
            }`}
          >
            {isSoundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <div className="font-semibold text-white text-xs sm:text-sm flex items-center gap-2">
              Efek Suara (Sound FX)
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
              Audio sci-fi bernada santai saat klik node, tombol, dan ekspor peta pikiran.
            </p>
          </div>
        </div>

        <NeoToggle
          id="modal-btn-sound-toggle"
          checked={isSoundEnabled}
          onChange={toggleSound}
          title={isSoundEnabled ? "Sound FX Aktif" : "Sound FX Nonaktif"}
          aria-label="Toggle Efek Suara (Sound FX)"
        />
      </div>

      {/* Haptic Feedback Toggle Row */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-black border border-neutral-800 hover:border-neutral-700 transition-colors">
        <div className="flex items-start gap-3 pr-3">
          <div
            className={`p-2 rounded-lg border shrink-0 transition-colors ${
              isHapticEnabled && isHapticSupported
                ? "bg-black border-emerald-500/50 text-white"
                : "bg-neutral-800 border-neutral-700 text-neutral-500"
            }`}
          >
            {isHapticEnabled && isHapticSupported ? (
              <Vibrate className="w-4 h-4 text-cyan-400" />
            ) : (
              <VibrateOff className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <div className="font-semibold text-white text-xs sm:text-sm flex items-center gap-2">
              Getaran Taktil (Haptic Feedback)
              {!isHapticSupported && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-neutral-800 text-neutral-500 border border-neutral-700">
                  {device.isIOS ? "iOS SAFARI N/A" : "TIDAK DIDUKUNG"}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
              {isHapticSupported
                ? "Getaran mikro responsif saat memilih kartu atau merestrukturisasi mind map."
                : device.isIOS
                ? "Fitur getaran browser dibatasi oleh kebijakan privasi iOS WebKit Safari."
                : "Perangkat ini tidak memiliki motor vibrasi getaran perangkat keras."}
            </p>
          </div>
        </div>

        {isHapticSupported ? (
          <NeoToggle
            id="modal-btn-haptic-toggle"
            checked={isHapticEnabled}
            onChange={toggleHaptic}
            title={isHapticEnabled ? "Getaran Taktil Aktif" : "Getaran Taktil Nonaktif"}
            aria-label="Toggle Getaran Taktil (Haptic Feedback)"
          />
        ) : (
          <span className="text-[11px] text-neutral-500 font-mono italic px-2 py-1">
            N/A
          </span>
        )}
      </div>
    </div>
  );
};
