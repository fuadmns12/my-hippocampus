import React from "react";
import { ZoomIn, ZoomOut, RotateCcw, Scan, Undo2, Redo2, Cloud } from "lucide-react";
import { soundFx } from "../../../utils/soundEffects";
import { useThemeMode } from "../../../context/ThemeModeContext";

export interface CanvasZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onResetNodeOffsets: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  showBranchBoundaries?: boolean;
  onToggleBoundaries?: () => void;
}

export const CanvasZoomControls: React.FC<CanvasZoomControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onResetNodeOffsets,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  showBranchBoundaries = true,
  onToggleBoundaries,
}) => {
  const themeModeCtx = useThemeMode();
  const isLight = themeModeCtx?.isLight ?? false;

  return (
    <div
      className={`absolute bottom-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl shadow-2xl text-xs select-none border transition-colors ${
        isLight
          ? "bg-white border-slate-300 text-slate-800 shadow-slate-300/60"
          : "bg-black border-cyan-500/40 text-white"
      }`}
    >
      <button
        id="btn-canvas-zoom-in"
        type="button"
        onClick={() => {
          soundFx.play("zoom");
          onZoomIn();
        }}
        title="Perbesar"
        aria-label="Perbesar"
        className={`p-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
          isLight
            ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-cyan-700 hover:border-cyan-400"
            : "bg-black text-neutral-300 border-neutral-700/80 hover:border-cyan-500/50 hover:text-white hover:bg-neutral-900"
        }`}
      >
        <ZoomIn className={`w-3.5 h-3.5 ${isLight ? "text-slate-700" : "text-white"}`} />
      </button>

      <span
        className={`w-11 text-center font-mono font-medium text-[11px] select-none ${
          isLight ? "text-slate-700" : "text-neutral-300"
        }`}
      >
        {Math.round(zoom * 100)}%
      </span>

      <button
        id="btn-canvas-zoom-out"
        type="button"
        onClick={() => {
          soundFx.play("zoom");
          onZoomOut();
        }}
        title="Perkecil"
        aria-label="Perkecil"
        className={`p-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
          isLight
            ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-cyan-700 hover:border-cyan-400"
            : "bg-black text-neutral-300 border-neutral-700/80 hover:border-cyan-500/50 hover:text-white hover:bg-neutral-900"
        }`}
      >
        <ZoomOut className={`w-3.5 h-3.5 ${isLight ? "text-slate-700" : "text-white"}`} />
      </button>

      {/* Tombol Undo dan Redo Canvas di sebelah kanan tombol zoom out */}
      <div
        className={`w-px h-4 mx-0.5 ${
          isLight ? "bg-slate-200" : "bg-cyan-500/30"
        }`}
      />

      <button
        id="btn-canvas-undo"
        type="button"
        onClick={() => {
          if (canUndo && onUndo) {
            soundFx.play("click");
            onUndo();
          }
        }}
        disabled={!canUndo}
        title={
          canUndo
            ? "Urungkan Perubahan Kanvas (Undo - Ctrl+Z)"
            : "Tidak ada riwayat untuk diurungkan"
        }
        aria-label="Urungkan Perubahan Kanvas (Undo)"
        className={`p-1.5 rounded-xl transition-all active:scale-95 ${
          canUndo
            ? isLight
              ? "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-cyan-700 hover:border-cyan-400 cursor-pointer"
              : "bg-black text-neutral-300 border border-neutral-700/80 hover:border-cyan-500/50 hover:text-white hover:bg-neutral-900 cursor-pointer"
            : isLight
            ? "bg-slate-50 text-slate-300 border border-slate-100 opacity-40 cursor-not-allowed"
            : "bg-black text-neutral-600 border border-neutral-800/60 opacity-35 cursor-not-allowed"
        }`}
      >
        <Undo2
          className={`w-3.5 h-3.5 ${
            canUndo
              ? isLight
                ? "text-slate-700"
                : "text-white"
              : isLight
              ? "text-slate-300"
              : "text-neutral-500"
          }`}
        />
      </button>

      <button
        id="btn-canvas-redo"
        type="button"
        onClick={() => {
          if (canRedo && onRedo) {
            soundFx.play("click");
            onRedo();
          }
        }}
        disabled={!canRedo}
        title={
          canRedo
            ? "Ulangi Perubahan Kanvas (Redo - Ctrl+Y)"
            : "Tidak ada riwayat untuk diulangi"
        }
        aria-label="Ulangi Perubahan Kanvas (Redo)"
        className={`p-1.5 rounded-xl transition-all active:scale-95 ${
          canRedo
            ? isLight
              ? "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-cyan-700 hover:border-cyan-400 cursor-pointer"
              : "bg-black text-neutral-300 border border-neutral-700/80 hover:border-cyan-500/50 hover:text-white hover:bg-neutral-900 cursor-pointer"
            : isLight
            ? "bg-slate-50 text-slate-300 border border-slate-100 opacity-40 cursor-not-allowed"
            : "bg-black text-neutral-600 border border-neutral-800/60 opacity-35 cursor-not-allowed"
        }`}
      >
        <Redo2
          className={`w-3.5 h-3.5 ${
            canRedo
              ? isLight
                ? "text-slate-700"
                : "text-white"
              : isLight
              ? "text-slate-300"
              : "text-neutral-500"
          }`}
        />
      </button>

      <div
        className={`w-px h-4 mx-0.5 ${
          isLight ? "bg-slate-200" : "bg-cyan-500/30"
        }`}
      />

      {/* Cloud Hulls / Batas Wilayah Toggle */}
      {onToggleBoundaries && (
        <button
          id="btn-toggle-boundaries"
          type="button"
          onClick={() => {
            soundFx.play("click");
            onToggleBoundaries();
          }}
          title={
            showBranchBoundaries
              ? "Sembunyikan Batas Wilayah Awan (Cloud Hulls)"
              : "Tampilkan Batas Wilayah Awan / Cloud Hulls (Prinsip Tony Buzan)"
          }
          aria-label="Toggle Batas Wilayah Awan"
          className={`p-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
            showBranchBoundaries
              ? isLight
                ? "bg-cyan-100 text-cyan-800 border-cyan-400 shadow-sm"
                : "bg-cyan-950/80 text-cyan-300 border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.35)]"
              : isLight
              ? "bg-slate-50 text-slate-600 border-slate-200 hover:text-cyan-700 hover:border-cyan-400"
              : "bg-black text-neutral-400 border-neutral-700/80 hover:text-white hover:border-cyan-500/40"
          }`}
        >
          <Cloud className="w-3.5 h-3.5" />
        </button>
      )}

      <button
        id="btn-zoom-fit-screen"
        type="button"
        onClick={() => {
          soundFx.play("click");
          onFitToScreen();
        }}
        title="Lihat Semua: Menyesuaikan zoom dan posisi agar seluruh cabang pas dan tampak jelas di layar (Fit to Screen)"
        aria-label="Lihat Semua: Menyesuaikan zoom dan posisi agar seluruh cabang pas dan tampak jelas di layar (Fit to Screen)"
        className={`p-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
          isLight
            ? "bg-slate-50 text-cyan-700 border-cyan-300 hover:bg-cyan-50 hover:border-cyan-500"
            : "bg-black text-white border border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white"
        }`}
      >
        <Scan className={`w-3.5 h-3.5 shrink-0 ${isLight ? "text-cyan-700" : "text-white"}`} />
      </button>

      <button
        id="btn-zoom-reset-offsets"
        type="button"
        onClick={() => {
          soundFx.play("click");
          onResetNodeOffsets();
        }}
        title="Tata Ulang: Mengembalikan posisi kartu-kartu yang pernah digeser manual ke tata letak awal yang rapi"
        aria-label="Tata Ulang: Mengembalikan posisi kartu-kartu yang pernah digeser manual ke tata letak awal yang rapi"
        className={`p-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
          isLight
            ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-900"
            : "bg-black text-neutral-300 border border-neutral-700/80 hover:bg-neutral-900 hover:border-neutral-500 hover:text-white"
        }`}
      >
        <RotateCcw className={`w-3.5 h-3.5 shrink-0 ${isLight ? "text-slate-700" : "text-white"}`} />
      </button>
    </div>
  );
};
