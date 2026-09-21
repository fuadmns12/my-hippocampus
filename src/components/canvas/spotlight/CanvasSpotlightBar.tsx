import React from "react";
import { Sparkles, X, ChevronRight, Home, ArrowLeft } from "lucide-react";
import { BreadcrumbItem } from "./types";

export interface CanvasSpotlightBarProps {
  spotlightNodeId: string | null;
  spotlightNodeLabel: string | null;
  onClearSpotlight: () => void;
  drillDownNodeId: string | null;
  breadcrumbs: BreadcrumbItem[];
  onExitDrillDown: () => void;
  onJumpBreadcrumb: (nodeId: string) => void;
}

export const CanvasSpotlightBar: React.FC<CanvasSpotlightBarProps> = ({
  spotlightNodeId,
  spotlightNodeLabel,
  onClearSpotlight,
  drillDownNodeId,
  breadcrumbs,
  onExitDrillDown,
  onJumpBreadcrumb,
}) => {
  if (!spotlightNodeId && !drillDownNodeId) return null;

  return (
    <div
      className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 max-w-[92vw] sm:max-w-xl animate-fade-in select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. Branch Spotlight / Isolation Mode Indicator */}
      {spotlightNodeId && (
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-black/90 border border-amber-500/50 shadow-2xl backdrop-blur-md text-xs text-white">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Sparkles className="w-4 h-4 animate-pulse text-amber-400" />
            <span className="tracking-wide">FOKUS CABANG:</span>
          </div>

          <span className="font-medium text-amber-200 max-w-[160px] sm:max-w-[220px] truncate">
            {spotlightNodeLabel || "Cabang Aktif"}
          </span>

          <span className="hidden sm:inline text-[10px] text-neutral-400 bg-neutral-900/80 px-1.5 py-0.5 rounded border border-neutral-700">
            Redup 20%
          </span>

          <button
            type="button"
            onClick={onClearSpotlight}
            title="Keluar dari mode fokus cabang (Tekan Esc)"
            className="ml-1 inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white border border-amber-500/40 text-[11px] font-semibold transition-all active:scale-95 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Tutup (Esc)</span>
          </button>
        </div>
      )}

      {/* 2. Subtree Drill-Down Mode Breadcrumbs */}
      {drillDownNodeId && !spotlightNodeId && (
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-black/90 border border-cyan-500/50 shadow-2xl backdrop-blur-md text-xs text-white overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={onExitDrillDown}
            className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-cyan-400 hover:text-cyan-300 border border-neutral-700 transition-all active:scale-95 cursor-pointer shrink-0"
            title="Kembali ke Peta Utama"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.id}>
                  {idx > 0 && (
                    <ChevronRight className="w-3 h-3 text-neutral-500 shrink-0" />
                  )}
                  <button
                    type="button"
                    onClick={() => onJumpBreadcrumb(crumb.id)}
                    className={`px-2 py-0.5 rounded-lg text-xs transition-all truncate max-w-[120px] ${
                      isLast
                        ? "font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/80 cursor-pointer"
                    }`}
                    title={crumb.label}
                  >
                    {idx === 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <Home className="w-3 h-3" />
                        <span>Peta</span>
                      </span>
                    ) : (
                      crumb.label
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onExitDrillDown}
            className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-white border border-cyan-500/40 text-[11px] font-semibold transition-all active:scale-95 cursor-pointer shrink-0"
            title="Keluar dari Subtree"
          >
            <X className="w-3.5 h-3.5" />
            <span>Peta Penuh</span>
          </button>
        </div>
      )}
    </div>
  );
};
