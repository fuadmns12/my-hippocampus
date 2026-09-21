import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { MindMapNode } from "../../../types";
import { soundFx } from "../../../utils/soundEffects";
import { useThemeMode } from "../../../context/ThemeModeContext";
import { CanvasSearchBar } from "./CanvasSearchBar";
import { CanvasMapSwitcherMenu } from "./CanvasMapSwitcherMenu";

export interface CanvasHeaderToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  matchCount?: number;
  onResetNodeOffsets?: () => void;
  allRoots?: MindMapNode[];
  activeRootId?: string;
  onSelectRoot?: (rootId: string) => void;
  onRemoveMindMap?: (rootId: string) => void;
  onAddNewMindMap?: () => void;
  onClearCanvas?: () => void;
  isClearConfirmOpen?: boolean;
}

export const CanvasHeaderToolbar: React.FC<CanvasHeaderToolbarProps> = ({
  searchQuery,
  onSearchChange,
  matchCount,
  allRoots,
  activeRootId,
  onSelectRoot,
  onRemoveMindMap,
  onAddNewMindMap,
  onClearCanvas,
  isClearConfirmOpen = false,
}) => {
  const themeModeCtx = useThemeMode();
  const isLight = themeModeCtx?.isLight ?? false;

  return (
    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 flex-wrap max-w-[calc(100%-80px)] select-none">
      {/* Search Bar inside Canvas */}
      <CanvasSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        matchCount={matchCount}
      />

      {/* Multi-Map Dropdown & Selector */}
      {allRoots && allRoots.length > 0 && (
        <CanvasMapSwitcherMenu
          allRoots={allRoots}
          activeRootId={activeRootId}
          onSelectRoot={onSelectRoot}
          onRemoveMindMap={onRemoveMindMap}
          onAddNewMindMap={onAddNewMindMap}
          onClearCanvas={onClearCanvas}
        />
      )}

      {/* Quick Add Button */}
      {onAddNewMindMap && (
        <div className="hidden sm:block">
          <button
            id="btn-quick-add-mindmap"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.play("spawn");
              onAddNewMindMap();
            }}
            title="Tambah Mind Map baru ke kanvas"
            aria-label="Tambah Mind Map Baru"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-150 active:scale-95 cursor-pointer shadow-sm ${
              isLight
                ? "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-cyan-500 hover:text-cyan-700 shadow-slate-200/50"
                : "bg-black text-white border border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white"
            }`}
          >
            <Plus className={`w-3.5 h-3.5 ${isLight ? "text-cyan-600" : "text-white"}`} />
            <span>PETA BARU</span>
          </button>
        </div>
      )}

      {/* Quick Clear Canvas Button */}
      {onClearCanvas && (
        <button
          id="btn-canvas-quick-clear"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            soundFx.play("click");
            onClearCanvas();
          }}
          title="Kosongkan Kanvas - Hapus visualisasi mind map dari kanvas"
          aria-label="Kosongkan Kanvas"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-150 active:scale-95 border cursor-pointer shadow-sm ${
            isClearConfirmOpen
              ? isLight
                ? "bg-rose-50 text-rose-700 border-rose-400 ring-1 ring-rose-400/40"
                : "bg-black text-white border-rose-400 ring-1 ring-rose-500/40"
              : isLight
              ? "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 hover:border-rose-400 hover:text-rose-700 shadow-slate-200/50"
              : "bg-black text-white border border-rose-500/40 hover:bg-neutral-900 hover:border-rose-400 hover:text-white"
          }`}
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
          <span>KOSONGKAN KANVAS</span>
        </button>
      )}
    </div>
  );
};
