import React, { useState, useMemo, useEffect } from "react";
import { Folder } from "lucide-react";
import { PRESET_TEMPLATES } from "../../data/presets";
import { PresetTemplate } from "../../types";
import { MechanicalButton } from "../common/MechanicalButton";
import { PresetDrawerHeader } from "./preset/PresetDrawerHeader";
import { PresetFilterBar } from "./preset/PresetFilterBar";
import { PresetItemCard } from "./preset/PresetItemCard";

export const getPresetNoteCount = (p: PresetTemplate): number => {
  const rootCount = p.rootNotes?.length || 0;
  const nodeCount = Object.values(p.nodeNotes || {}).reduce(
    (acc, arr) => acc + arr.length,
    0
  );
  return rootCount + nodeCount;
};

export const getLayoutLabel = (layout: string): string => {
  switch (layout) {
    case "radial":
      return "Radial";
    case "horizontal-tree":
      return "Pohon Horisontal";
    case "vertical-tree":
      return "Hirarki Vertikal";
    case "fishbone":
      return "Tulang Ikan";
    case "bubble-cluster":
      return "Kluster Gelembung";
    case "bilateral-bracket":
      return "Bracket 2 Sisi";
    case "grid-network":
      return "Jaringan Matriks";
    default:
      return layout;
  }
};

interface PresetSelectorDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelectPreset: (preset: PresetTemplate) => void;
}

export const PresetSelectorDropdown: React.FC<PresetSelectorDropdownProps> = ({
  isOpen,
  onToggle,
  onClose,
  onSelectPreset,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<"ALL" | "Umum" | "Spesifik">("ALL");

  // Handle ESC key to dismiss drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredPresets = useMemo(() => {
    let list = [...PRESET_TEMPLATES];
    const q = searchQuery.trim().toLowerCase();

    if (selectedFolder !== "ALL") {
      list = list.filter((p) => p.folder === selectedFolder);
    }

    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.names.some((n) => n.toLowerCase().includes(q))
      );
    }

    return list;
  }, [searchQuery, selectedFolder]);

  const handleSelect = (preset: PresetTemplate) => {
    onSelectPreset(preset);
    onClose();
  };

  return (
    <>
      <MechanicalButton
        id="btn-preset-selector"
        type="button"
        size="xs"
        variant="cyan"
        active={isOpen}
        onClick={onToggle}
        title="Pilih Template Contoh Mind Map"
        icon={
          <Folder
            className={`w-3.5 h-3.5 ${
              isOpen ? "text-cyan-400" : "text-white"
            }`}
          />
        }
      >
        CONTOH DATASET
      </MechanicalButton>

      {/* Preset Drawer Overlay - Matching Memory Card (HistoryDrawer) */}
      {isOpen && (
        <div
          id="preset-drawer-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          className="fixed inset-0 z-[10000] flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div
            id="preset-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            className="bg-black border-l border-cyan-500/40 w-full sm:max-w-md md:max-w-lg h-full flex flex-col shadow-2xl"
          >
            {/* Drawer Header */}
            <PresetDrawerHeader
              totalCount={PRESET_TEMPLATES.length}
              onClose={onClose}
            />

            {/* Filter and Search Bar */}
            <PresetFilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
              totalCount={PRESET_TEMPLATES.length}
              filteredCount={filteredPresets.length}
            />

            {/* Presets List Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-black">
              {/* Audit Callout Banner */}
              <div className="px-3 py-2.5 rounded-xl bg-black border border-cyan-500/30 text-[11px] text-white flex items-start gap-2.5">
                <span className="text-base leading-none pt-0.5">📝</span>
                <div className="leading-snug text-white">
                  <strong className="text-white font-semibold block mb-0.5">
                    Audit Dataset & Catatan Kartu:
                  </strong>
                  Semua dataset contoh telah diaudit dan dilengkapi{" "}
                  <strong className="text-white font-semibold underline decoration-cyan-400 decoration-1 underline-offset-2">
                    Catatan Kartu (📝)
                  </strong>
                  , gaya konektor, tema warna, dan bentuk kartu untuk mendemokan
                  fitur terlengkap mind map.
                </div>
              </div>

              {/* Items */}
              {filteredPresets.length === 0 ? (
                <div className="py-12 text-center text-white text-xs">
                  Tidak ada template yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredPresets.map((preset) => (
                    <PresetItemCard
                      key={preset.id}
                      preset={preset}
                      onSelect={handleSelect}
                      getPresetNoteCount={getPresetNoteCount}
                      getLayoutLabel={getLayoutLabel}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
