import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useSoundEffects } from "../../hooks/useSoundEffects";
import { MechanicalButton } from "./MechanicalButton";

interface SoundToggleProps {
  className?: string;
  size?: "sm" | "md";
  showLabel?: boolean;
  variant?: "simple" | "mechanical";
}

export const SoundToggle: React.FC<SoundToggleProps> = ({
  className = "",
  size = "md",
  showLabel = false,
  variant = "simple",
}) => {
  const { isSoundEnabled, toggleSound } = useSoundEffects();

  if (variant === "simple") {
    return (
      <button
        id="btn-sound-fx-toggle"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleSound();
        }}
        title={
          isSoundEnabled
            ? "Sound FX Aktif (Klik untuk Membisukan)"
            : "Sound FX Bisu (Klik untuk Mengaktifkan)"
        }
        aria-label={
          isSoundEnabled
            ? "Sound FX Aktif (Klik untuk Membisukan)"
            : "Sound FX Bisu (Klik untuk Mengaktifkan)"
        }
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold tracking-wider transition-all duration-150 active:scale-95 border cursor-pointer select-none ${
          isSoundEnabled
            ? "bg-black text-white border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white shadow-sm"
            : "bg-black text-neutral-400 border-neutral-700/80 hover:bg-neutral-900 hover:text-neutral-300"
        } ${className}`}
      >
        {isSoundEnabled ? (
          <Volume2 className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 shrink-0 text-white" />
        )}
        <span>{isSoundEnabled ? "SUARA ON" : "SUARA OFF"}</span>
      </button>
    );
  }

  return (
    <MechanicalButton
      id="btn-sound-fx-toggle"
      type="button"
      size="xs"
      variant={isSoundEnabled ? "cyan" : "neutral"}
      active={isSoundEnabled}
      onClick={(e) => {
        e.stopPropagation();
        toggleSound();
      }}
      className={className}
      title={isSoundEnabled ? "Sound FX Aktif (Klik untuk Membisukan)" : "Sound FX Bisu (Klik untuk Mengaktifkan)"}
      icon={
        isSoundEnabled ? (
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-white" />
        )
      }
    >
      {isSoundEnabled ? "SUARA ON" : "SUARA OFF"}
    </MechanicalButton>
  );
};
