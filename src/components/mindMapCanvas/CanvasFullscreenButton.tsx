import React from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";
import { device } from "../../utils/deviceDetection";
import { useThemeMode } from "../../context/ThemeModeContext";

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
      <button
        id="btn-canvas-fullscreen-toggle"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          soundFx.play("click");
          onToggleFullscreen();
        }}
        title={
          isFullscreen
            ? device.hasPhysicalEscKey
              ? "Keluar Layar Penuh (ESC)"
              : "Keluar Layar Penuh"
            : device.needsPseudoFullscreen
            ? "Layar Penuh (Mode Kanvas Fokus)"
            : "Layar Penuh"
        }
        aria-label={
          isFullscreen
            ? device.hasPhysicalEscKey
              ? "Keluar Layar Penuh (ESC)"
              : "Keluar Layar Penuh"
            : "Layar Penuh"
        }
        className={`inline-flex items-center justify-center p-2 rounded-xl transition-all duration-150 active:scale-95 shadow-lg border backdrop-blur-md cursor-pointer select-none ${
          isFullscreen
            ? isLight
              ? "bg-white text-amber-700 border-amber-400 hover:bg-amber-50"
              : "bg-black text-white border-amber-500/40 hover:bg-neutral-900 hover:border-amber-400"
            : isLight
            ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-cyan-500 hover:text-cyan-700 shadow-slate-200/50"
            : "bg-black text-white border border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white"
        }`}
      >
        {isFullscreen ? (
          <Minimize2 className={`w-4 h-4 shrink-0 ${isLight ? "text-amber-600" : "text-cyan-400"}`} />
        ) : (
          <Maximize2 className={`w-4 h-4 shrink-0 ${isLight ? "text-slate-700" : "text-white"}`} />
        )}
      </button>
    </div>
  );
};
