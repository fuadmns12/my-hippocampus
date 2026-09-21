import React from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";
import { device } from "../../utils/deviceDetection";
import { useThemeMode } from "../../context/ThemeModeContext";
import { IconActionButton } from "../common/IconActionButton";

interface CanvasFullscreenButtonProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const CanvasFullscreenButton: React.FC<CanvasFullscreenButtonProps> = ({
  isFullscreen,
  onToggleFullscreen,
}) => {
  const themeModeCtx = useThemeMode();
  const isLight = themeModeCtx?.isLight ?? false;

  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
      {isFullscreen && device.hasPhysicalEscKey && (
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 text-xs backdrop-blur px-3 py-1.5 rounded-xl border shadow-xl select-none ${
            isLight
              ? "bg-white text-slate-700 border-slate-300 shadow-slate-200/50"
              : "bg-black text-neutral-300 border-neutral-800"
          }`}
        >
          Tekan{" "}
          <kbd
            className={`font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded border ${
              isLight
                ? "bg-slate-100 text-slate-900 border-slate-300"
                : "bg-black text-white border-cyan-500/30"
            }`}
          >
            ESC
          </kbd>{" "}
          untuk keluar
        </span>
      )}
      <IconActionButton
        id="btn-canvas-fullscreen-toggle"
        isActive={isFullscreen}
        icon={isFullscreen ? Minimize2 : Maximize2}
        title={
          isFullscreen
            ? device.hasPhysicalEscKey
              ? "Keluar Layar Penuh Kanvas (Mode Kanvas Fokus, ESC)"
              : "Keluar Layar Penuh Kanvas (Mode Kanvas Fokus)"
            : "Layar Penuh Kanvas (Mode Kanvas Fokus)"
        }
        ariaLabel={
          isFullscreen
            ? device.hasPhysicalEscKey
              ? "Keluar Layar Penuh Kanvas (Mode Kanvas Fokus, ESC)"
              : "Keluar Layar Penuh Kanvas (Mode Kanvas Fokus)"
            : "Layar Penuh Kanvas (Mode Kanvas Fokus)"
        }
        onClick={(e) => {
          e.stopPropagation();
          soundFx.play("click");
          onToggleFullscreen();
        }}
      />
    </div>
  );
};
