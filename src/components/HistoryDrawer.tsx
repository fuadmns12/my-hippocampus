import React, { useState, useMemo } from "react";
import { MindMapData } from "../types";
import { HistoryItemCard } from "./history/HistoryItemCard";
import { HistoryFolderTabs } from "./history/HistoryFolderTabs";
import { HistoryDrawerHeader } from "./history/HistoryDrawerHeader";
import { HistoryEmptyState } from "./history/HistoryEmptyState";
import { HistoryDrawerFooter } from "./history/HistoryDrawerFooter";
import { searchInNodes } from "./history/historySearchHelper";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedMaps: MindMapData[];
  onLoadMap: (map: MindMapData) => void;
  onDeleteMap: (id: string) => void;
  onClearAllHistory: () => void;
  onOpenUpload?: () => void;
  hasCurrentMap?: boolean;
  onSaveCurrentMap?: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedMaps,
  onLoadMap,
  onDeleteMap,
  onClearAllHistory,
  onOpenUpload,
  hasCurrentMap,
  onSaveCurrentMap,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "title">("newest");
  const [mapToDelete, setMapToDelete] = useState<MindMapData | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const filteredMaps = useMemo(() => {
    let list = [...savedMaps];
    const q = searchQuery.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.subtitle && m.subtitle.toLowerCase().includes(q)) ||
          searchInNodes(m.root, q)
      );
    }

    if (sortBy === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
    }

    return list;
  }, [savedMaps, searchQuery, sortBy]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[10000] flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
        <div
          id="history-drawer-panel"
          className="bg-black border-l border-cyan-500/40 w-full sm:max-w-md md:max-w-lg h-full flex flex-col shadow-2xl"
        >
          {/* Header & Quick Toolbar */}
          <HistoryDrawerHeader
            savedMaps={savedMaps}
            onClose={onClose}
            onOpenUpload={onOpenUpload}
          />

          {/* Search Bar & Sorting */}
          <HistoryFolderTabs
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalCount={savedMaps.length}
            filteredCount={filteredMaps.length}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* List of saved mind maps */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-black">
            {filteredMaps.length === 0 ? (
              <HistoryEmptyState
                searchQuery={searchQuery}
                hasCurrentMap={hasCurrentMap}
                onSaveCurrentMap={onSaveCurrentMap}
              />
            ) : (
              filteredMaps.map((map) => (
                <HistoryItemCard
                  key={map.id}
                  map={map}
                  onSelectMap={(selected) => {
                    onLoadMap(selected);
                    onClose();
                  }}
                  onRequestDelete={(m) => setMapToDelete(m)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <HistoryDrawerFooter
            totalCount={savedMaps.length}
            onClearAllHistory={() => setShowClearAllConfirm(true)}
          />
        </div>
      </div>

      {/* Popup Konfirmasi Hapus Satu Mind Map */}
      <ConfirmDeleteModal
        isOpen={Boolean(mapToDelete)}
        onClose={() => setMapToDelete(null)}
        onConfirm={() => {
          if (mapToDelete) {
            onDeleteMap(mapToDelete.id);
            setMapToDelete(null);
          }
        }}
        title="Hapus Mind Map Dari Riwayat"
        description="Apakah Anda yakin ingin menghapus mind map ini dari Memory Card? Data yang dihapus tidak dapat dipulihkan."
        itemName={mapToDelete?.title || "Mind Map"}
        confirmLabel="HAPUS DARI MEMORY CARD"
      />

      {/* Popup Konfirmasi Kosongkan Semua Mind Map */}
      <ConfirmDeleteModal
        isOpen={showClearAllConfirm}
        onClose={() => setShowClearAllConfirm(false)}
        onConfirm={() => {
          onClearAllHistory();
          setShowClearAllConfirm(false);
        }}
        title="Kosongkan Semua Mind Map"
        description={`Apakah Anda yakin ingin menghapus seluruh ${savedMaps.length} mind map yang tersimpan di Memory Card? Tindakan ini akan mengosongkan seluruh riwayat lokal.`}
        confirmLabel="KOSONGKAN SEMUA"
      />
    </>
  );
};
