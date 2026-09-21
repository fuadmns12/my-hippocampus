import React, { useMemo } from "react";
import { PlusCircle, SlidersHorizontal } from "lucide-react";
import { MindMapData } from "../../types";
import { MechanicalButton } from "../common/MechanicalButton";

export interface HeaderRootControlsProps {
  mindMapData: MindMapData | null;
  isPanelOpen: boolean;
  isInputCollapsed?: boolean;
  isLayoutThemeOpen?: boolean;
  onToggleCombinedPanels?: () => void;
  onToggleInputCollapse?: () => void;
  onToggleLayoutTheme?: () => void;
  onOpenNewMindMap?: () => void;
  onOpenEditMindMap?: () => void;
  onSelectRoot?: (rootId: string) => void;
}

export const HeaderRootControls: React.FC<HeaderRootControlsProps> = ({
  mindMapData,
  isPanelOpen,
  isInputCollapsed = false,
  isLayoutThemeOpen = false,
  onToggleCombinedPanels,
  onToggleInputCollapse,
  onToggleLayoutTheme,
  onOpenNewMindMap,
  onOpenEditMindMap,
}) => {
  // Compute all roots and currently active root
  const allRoots = useMemo(() => {
    if (!mindMapData) return [];
    return [mindMapData.root, ...(mindMapData.additionalRoots || [])];
  }, [mindMapData]);

  const hasMultipleRoots = allRoots.length > 1;

  const activeRoot = useMemo(() => {
    if (!mindMapData) return null;
    if (mindMapData.activeRootId) {
      const found = allRoots.find((r) => r.id === mindMapData.activeRootId);
      if (found) return found;
    }
    return mindMapData.root;
  }, [mindMapData, allRoots]);

  const activeRootIndex = useMemo(() => {
    if (!activeRoot) return 0;
    const idx = allRoots.findIndex((r) => r.id === activeRoot.id);
    return idx >= 0 ? idx : 0;
  }, [allRoots, activeRoot]);

  const handleToggleCombined = () => {
    if (onToggleCombinedPanels) {
      onToggleCombinedPanels();
      return;
    }
    if (isPanelOpen) {
      if (onToggleInputCollapse && !isInputCollapsed) onToggleInputCollapse();
      if (onToggleLayoutTheme && isLayoutThemeOpen) onToggleLayoutTheme();
    } else {
      if (onToggleInputCollapse && isInputCollapsed) onToggleInputCollapse();
      if (onToggleLayoutTheme && !isLayoutThemeOpen) onToggleLayoutTheme();
      setTimeout(() => {
        const inputEl = document.getElementById("input-panel-section");
        if (inputEl) {
          inputEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      {/* Tombol 1: Memasukkan Mind Mapping yang Baru */}
      <MechanicalButton
        id="header-new-mindmap-btn"
        type="button"
        size="xs"
        variant="cyan"
        onClick={onOpenNewMindMap || handleToggleCombined}
        title="Masukkan & Buat Mind Mapping Baru (Buka Formulir Baru)"
        icon={<PlusCircle className="w-3.5 h-3.5 text-white" />}
      >
        + MIND MAP BARU
      </MechanicalButton>

      {/* Tombol 2: Tempat Edit Mind Map & Tata Letak (Dinamis sesuai Mind Map yang aktif) */}
      {(onOpenEditMindMap ||
        onToggleCombinedPanels ||
        onToggleInputCollapse ||
        onToggleLayoutTheme) && (
        <div className="relative inline-flex items-center gap-1">
          <MechanicalButton
            id="header-toggle-input-layout-btn"
            type="button"
            size="xs"
            variant="cyan"
            active={isPanelOpen}
            onClick={onOpenEditMindMap || handleToggleCombined}
            title={
              hasMultipleRoots && activeRoot
                ? `Sedang Mengedit: "${activeRoot.label}" (${activeRootIndex + 1} dari ${allRoots.length} topik di kanvas). Klik untuk Buka Tempat Edit & Tata Letak`
                : "Tempat Edit Mind Map, Pengaturan Tata Letak & Gaya Visual"
            }
            icon={
              <SlidersHorizontal
                className={`w-3.5 h-3.5 ${
                  isPanelOpen ? "text-cyan-400" : "text-white"
                }`}
              />
            }
          >
            {hasMultipleRoots && activeRoot ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="hidden md:inline">EDIT:</span>
                <span className="font-semibold">
                  "{activeRoot.label}"
                </span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-black/40 font-mono border border-cyan-400/30">
                  {activeRootIndex + 1}/{allRoots.length}
                </span>
              </span>
            ) : (
              <span>TEMPAT EDIT & TATA LETAK</span>
            )}
          </MechanicalButton>
        </div>
      )}
    </div>
  );
};
