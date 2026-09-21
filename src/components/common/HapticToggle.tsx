import React from "react";
import { Vibrate, VibrateOff, Ban } from "lucide-react";
import { useHaptics } from "../../hooks/useHaptics";
import { device } from "../../utils/deviceDetection";

interface HapticToggleProps {
  className?: string;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export const HapticToggle: React.FC<HapticToggleProps> = ({
  className = "",
  size = "md",
  showLabel = false,
}) => {
  const { isHapticEnabled, isSupported, toggleHaptic } = useHaptics();

  // If device doesn't support haptics (iOS Safari or desktop without vibrator)
  if (!isSupported) {
    const reasonText = device.isIOS
      ? "Haptic Feedback tidak didukung oleh Apple Safari / iOS WebKit"
      : "Haptic Feedback hanya didukung pada perangkat sentuh (Android)";

    return (
      <span
        title={reasonText}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium tracking-wider bg-black text-neutral-500 border border-neutral-800 cursor-not-allowed select-none opacity-60 ${className}`}
      >
        <Ban className="w-3.5 h-3.5 shrink-0 text-white" />
        <span className="hidden sm:inline">HAPTIC N/A</span>
        <span className="sm:hidden">HAPTIC</span>
      </span>
    );
  }

  return (
    <button
      id="btn-haptic-fx-toggle"
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleHaptic();
      }}
      title={
        isHapticEnabled
          ? "Getaran / Haptic Feedback Aktif (Klik untuk Mematikan)"
          : "Getaran / Haptic Feedback Mati (Klik untuk Menyalakan)"
      }
      aria-label={
        isHapticEnabled
          ? "Getaran / Haptic Feedback Aktif (Klik untuk Mematikan)"
          : "Getaran / Haptic Feedback Mati (Klik untuk Menyalakan)"
      }
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold tracking-wider transition-all duration-150 active:scale-95 border cursor-pointer select-none ${
        isHapticEnabled
          ? "bg-black text-white border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white shadow-sm"
          : "bg-black text-neutral-400 border-neutral-700/80 hover:bg-neutral-900 hover:text-neutral-300"
      } ${className}`}
    >
      {isHapticEnabled ? (
        <Vibrate className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
      ) : (
        <VibrateOff className="w-3.5 h-3.5 shrink-0 text-white" />
      )}
      <span>{isHapticEnabled ? "HAPTIC ON" : "HAPTIC OFF"}</span>
    </button>
  );
};
