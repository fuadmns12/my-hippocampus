import React, { useState, useRef, useEffect } from "react";
import { Layers, Plus, Trash2 } from "lucide-react";
import { MindMapNode } from "../../../types";
import { soundFx } from "../../../utils/soundEffects";
import { useThemeMode } from "../../../context/ThemeModeContext";
import { ConfirmDeleteModal } from "../../modals/ConfirmDeleteModal";

export interface CanvasMapSwitcherMenuProps {
  allRoots: MindMapNode[];
  activeRootId?: string;
  onSelectRoot?: (rootId: string) => void;
  onRemoveMindMap?: (rootId: string) => void;
  onAddNewMindMap?: () => void;
  onClearCanvas?: () => void;
}

export const CanvasMapSwitcherMenu: React.FC<CanvasMapSwitcherMenuProps> = ({
  allRoots,
  activeRootId,
  onSelectRoot,
  onRemoveMindMap,
  onAddNewMindMap,
  onClearCanvas,
}) => {
  const [showMapsMenu, setShowMapsMenu] = useState(false);
  const [mapToRemove, setMapToRemove] = useState<MindMapNode | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMapsMenu(false);
      }
    };
    if (showMapsMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMapsMenu]);

  const themeModeCtx = useThemeMode();
  const isLight = themeModeCtx?.isLight ?? false;

  const count = allRoots.length;
  const currentActive = allRoots.find((r) => r.id === activeRootId) || allRoots[0];

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          id="btn-canvas-map-switcher"
          type="button"
          onClick={() => {
            soundFx.play("click");
            setShowMapsMenu((prev) => !prev);
          }}
          title="Daftar Mind Map di Kanvas - Klik untuk beralih atau kelola"
          aria-label="Daftar Mind Map"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-150 active:scale-95 border cursor-pointer select-none shadow-sm ${
            showMapsMenu
              ? isLight
                ? "bg-slate-50 text-cyan-700 border-cyan-500 shadow-slate-200/50"
                : "bg-black text-white border-cyan-500/60"
              : isLight
              ? "bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:text-cyan-700 hover:border-cyan-500 shadow-slate-200/50"
              : "bg-black text-neutral-300 border-neutral-700/80 hover:bg-neutral-900 hover:text-white"
          }`}
        >
          <Layers
            className={`w-3.5 h-3.5 ${
              showMapsMenu
                ? "text-cyan-600 dark:text-cyan-400"
                : isLight
                ? "text-slate-600"
                : "text-white"
            }`}
          />
          <span>{count > 1 ? `${count} MIND MAP` : (currentActive?.label || "1 MIND MAP").toUpperCase()}</span>
        </button>

        {showMapsMenu && (
          <div
            className={`absolute top-full left-0 mt-1.5 w-72 sm:w-80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${
              isLight
                ? "bg-white border border-slate-200 text-slate-900 shadow-slate-300/60"
                : "bg-black border border-cyan-500/40 text-white"
            }`}
          >
            <div
              className={`px-2.5 py-1.5 border-b mb-1.5 flex items-center justify-between ${
                isLight ? "border-slate-100" : "border-neutral-800/80"
              }`}
            >
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                Mind Map di Kanvas ({count})
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isLight ? "text-slate-500" : "text-neutral-400"
                }`}
              >
                Bisa digeser bebas
              </span>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1 custom-scrollbar">
              {allRoots.map((r) => {
                const isActive = r.id === (activeRootId || allRoots[0].id);
                return (
                  <div
                    key={r.id}
                    className={`group flex items-center justify-between gap-2 p-2 rounded-xl border text-xs transition-all ${
                      isActive
                        ? isLight
                          ? "bg-cyan-50 border-cyan-400 text-cyan-950 shadow-sm ring-1 ring-cyan-400/30"
                          : "bg-black border-cyan-500/60 text-white shadow-sm ring-1 ring-cyan-500/30"
                        : isLight
                        ? "bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-900"
                        : "bg-black hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.play("pop");
                        onSelectRoot?.(r.id);
                        setShowMapsMenu(false);
                      }}
                      className="flex-1 text-left flex items-start gap-2 overflow-hidden cursor-pointer"
                      title={`Beralih mengedit: ${r.label}`}
                    >
                      <div className="mt-0.5">
                        {isActive ? (
                          <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block ring-2 ring-cyan-400/30" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-neutral-600 inline-block group-hover:bg-slate-600 dark:group-hover:bg-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-semibold truncate text-[11.5px] flex items-center gap-1.5 ${
                            isLight ? "text-slate-900" : "text-white"
                          }`}
                        >
                          <span className="truncate">{r.label}</span>
                          {isActive && (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase border ${
                                isLight
                                  ? "bg-cyan-100 text-cyan-800 border-cyan-300"
                                  : "bg-black text-white border-cyan-500/30"
                              }`}
                            >
                              Aktif Diedit
                            </span>
                          )}
                        </div>
                        {r.subtitle && (
                          <div
                            className={`text-[10px] truncate mt-0.5 ${
                              isLight ? "text-slate-500" : "text-neutral-400"
                            }`}
                          >
                            {r.subtitle}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Delete this mind map from canvas if more than 1 or confirmed */}
                    {allRoots.length > 1 && onRemoveMindMap && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFx.play("click");
                          setMapToRemove(r);
                          setShowMapsMenu(false);
                        }}
                        className="opacity-60 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-rose-500 dark:text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Hapus mind map ini dari kanvas"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {onAddNewMindMap && (
              <div
                className={`mt-2 pt-2 border-t space-y-1.5 flex flex-col gap-1 ${
                  isLight ? "border-slate-100" : "border-neutral-800/80"
                }`}
              >
                <button
                  id="btn-add-new-map-to-canvas"
                  type="button"
                  onClick={() => {
                    soundFx.play("spawn");
                    setShowMapsMenu(false);
                    onAddNewMindMap();
                  }}
                  className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-150 active:scale-95 cursor-pointer shadow-sm ${
                    isLight
                      ? "bg-slate-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-50 hover:border-cyan-400"
                      : "bg-black text-white border border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white"
                  }`}
                >
                  <Plus className={`w-3.5 h-3.5 ${isLight ? "text-cyan-700" : "text-white"}`} />
                  <span>TAMBAH MIND MAP BARU</span>
                </button>

                {onClearCanvas && (
                  <button
                    id="btn-clear-canvas-from-switcher"
                    type="button"
                    onClick={() => {
                      soundFx.play("click");
                      setShowMapsMenu(false);
                      onClearCanvas();
                    }}
                    className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all duration-150 active:scale-95 cursor-pointer shadow-sm ${
                      isLight
                        ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-400"
                        : "bg-black text-white border border-rose-500/40 hover:bg-neutral-900 hover:border-rose-400 hover:text-white"
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                    <span>KOSONGKAN KANVAS</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popup Konfirmasi Hapus Mind Map dari Kanvas */}
      <ConfirmDeleteModal
        isOpen={Boolean(mapToRemove)}
        onClose={() => setMapToRemove(null)}
        onConfirm={() => {
          if (mapToRemove && onRemoveMindMap) {
            onRemoveMindMap(mapToRemove.id);
            setMapToRemove(null);
          }
        }}
        title="Hapus Mind Map Dari Kanvas"
        description="Apakah Anda yakin ingin menghapus mind map ini dari kanvas? Mind map lain di kanvas akan tetap aman."
        itemName={mapToRemove?.label || "Mind Map"}
        confirmLabel="HAPUS DARI KANVAS"
      />
    </>
  );
};
