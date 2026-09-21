import { useState, useEffect, useCallback, useRef } from "react";
import { MindMapData, DocumentFolder } from "../types";
import { soundFx } from "../utils/soundEffects";
import { safeStorage } from "../utils/safeStorage";
import {
  AutoSaveDependencies,
  SaveToHistoryOptions,
  SaveMultipleToHistoryOptions,
  STORAGE_KEY,
  PRESET_MAP_IDS,
  PRESET_IDS,
  persistHistory,
  loadHistoryFromLocalStorage,
  insertOrUpdateHistoryItem,
  insertOrUpdateMultipleHistoryItems,
  useAutoSavePersistence,
} from "./mindMapPersistence";

export type { AutoSaveDependencies, SaveToHistoryOptions, SaveMultipleToHistoryOptions };

export function useMindMapPersistence(
  deps: AutoSaveDependencies,
  showToast?: (msg: string, duration?: number) => void
) {
  const [savedHistory, setSavedHistory] = useState<MindMapData[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const depsRef = useRef(deps);
  depsRef.current = deps;

  const savedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load history from localStorage on mount (only user-saved mind maps, exclude preset dataset seeds)
  useEffect(() => {
    const loaded = loadHistoryFromLocalStorage();
    setSavedHistory(loaded);
    persistHistory(loaded);
  }, []);

  // Save map to history (supports overwrite or keep both copy)
  const saveToHistory = useCallback(
    (map: MindMapData, options?: SaveToHistoryOptions) => {
      setActiveHistoryId(map.id);
      let persistResult = { success: true, prunedCount: 0 };
      setSavedHistory((prev) => {
        const updated = insertOrUpdateHistoryItem(prev, map, options);
        persistResult = persistHistory(updated);
        return updated;
      });
      return persistResult;
    },
    []
  );

  // Save multiple maps to history (for backup imports)
  const saveMultipleToHistory = useCallback(
    (maps: MindMapData[], options?: SaveMultipleToHistoryOptions) => {
      if (maps.length === 0) return { success: true, prunedCount: 0 };
      let persistResult = { success: true, prunedCount: 0 };
      setSavedHistory((prev) => {
        const updated = insertOrUpdateMultipleHistoryItems(prev, maps, options);
        persistResult = persistHistory(updated);
        return updated;
      });
      if (!persistResult.success && showToast) {
        showToast("Peringatan: Sebagian peta tidak dapat disimpan karena batas memori browser.");
      }
      return persistResult;
    },
    [showToast]
  );

  // Move folder
  const handleMoveDocumentFolder = useCallback(
    (id: string, newFolder: DocumentFolder) => {
      setSavedHistory((prev) => {
        const updated = prev.map((m) => (m.id === id ? { ...m, folder: newFolder } : m));
        persistHistory(updated);
        return updated;
      });
      if (showToast) showToast(`Kategori dokumen diubah ke ${newFolder}`);
    },
    [showToast]
  );

  // Delete history item
  const handleDeleteHistoryMap = useCallback(
    (id: string) => {
      soundFx.play("delete");
      if (activeHistoryId === id) setActiveHistoryId(null);
      setSavedHistory((prev) => {
        const updated = prev.filter((m) => m.id !== id);
        persistHistory(updated);
        return updated;
      });
    },
    [activeHistoryId]
  );

  // Clear all history
  const handleClearAllHistory = useCallback(() => {
    soundFx.play("delete");
    setActiveHistoryId(null);
    setSavedHistory([]);
    safeStorage.removeItem(STORAGE_KEY);
  }, []);

  // Manual save triggered by user clicking "Simpan" button
  const handleSaveCurrentMap = useCallback(() => {
    const currentDeps = depsRef.current;
    if (!currentDeps.mindMapData) {
      if (showToast) {
        showToast("Belum ada mind map aktif di kanvas untuk disimpan ke Memory Card.", 2500);
      }
      return;
    }

    soundFx.play("success");
    const currentMap = currentDeps.mindMapData;
    // If saving a map currently viewed from a preset, give it a unique user save ID
    const isPresetId = PRESET_MAP_IDS.has(currentMap.id) || PRESET_IDS.has(currentMap.id);
    const saveId = isPresetId ? `user-map-${Date.now()}` : currentMap.id;

    const result = saveToHistory({
      ...currentMap,
      id: saveId,
      isUserSaved: true,
      rawNamesText: currentDeps.namesText,
      layout: currentDeps.layout,
      theme: currentDeps.theme,
      connectorStyle: currentDeps.connectorStyle,
      nodeShape: currentDeps.nodeShape,
      groupingStrategy: currentDeps.groupingStrategy,
      customConfig: currentDeps.customConfig,
      folder: currentDeps.currentFolder,
    });

    if (result.success) {
      setIsSavedRecently(true);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => {
        setIsSavedRecently(false);
      }, 2000);

      if (showToast) {
        if (result.prunedCount > 0) {
          showToast(
            `Mind Map "${currentMap.title}" disimpan! (${result.prunedCount} peta terlama dipangkas karena kapasitas browser)`,
            3500
          );
        } else {
          showToast(`Mind Map "${currentMap.title}" berhasil disimpan ke Memory Card!`, 2500);
        }
      }
    } else {
      if (showToast) {
        showToast(
          "Peringatan: Memori browser penuh. Silakan unduh backup file JSON peta Anda agar data tetap aman.",
          4000
        );
      }
    }
  }, [saveToHistory, showToast]);

  // Hook auto-save terpisah (debounced & silent)
  useAutoSavePersistence(deps, activeHistoryId, setSavedHistory);

  return {
    savedHistory,
    setSavedHistory,
    activeHistoryId,
    setActiveHistoryId,
    isSavedRecently,
    saveToHistory,
    saveMultipleToHistory,
    handleSaveCurrentMap,
    handleMoveDocumentFolder,
    handleDeleteHistoryMap,
    handleClearAllHistory,
  };
}
