import React, { useCallback } from "react";
import { MindMapData, MindMapNode } from "../../types";
import { soundFx } from "../../utils/soundEffects";
import {
  getAllRootsFromData,
  getActiveRootFromData,
  addMindMapToData,
  removeMindMapFromData,
  setActiveRootInData,
} from "./index";

export interface UseTreeRootOperationsParams {
  mindMapData: MindMapData | null;
  setMindMapData: React.Dispatch<React.SetStateAction<MindMapData | null>>;
  showToast?: (msg: string) => void;
}

export function useTreeRootOperations({
  mindMapData,
  setMindMapData,
  showToast,
}: UseTreeRootOperationsParams) {
  // Helper: Ambil semua root yang saat ini ada di kanvas
  const getAllRoots = useCallback((): MindMapNode[] => {
    return getAllRootsFromData(mindMapData);
  }, [mindMapData]);

  // Helper: Ambil root yang sedang aktif dipilih / diedit
  const getActiveRoot = useCallback((): MindMapNode | null => {
    return getActiveRootFromData(mindMapData);
  }, [mindMapData]);

  // Menambahkan mind map mandiri baru ke kanvas
  const handleAddMindMap = useCallback(
    (newRoot: MindMapNode) => {
      soundFx.play("spawn");
      setMindMapData((prev) => addMindMapToData(prev, newRoot));
    },
    [setMindMapData]
  );

  // Menghapus mind map tertentu dari kanvas
  const handleRemoveMindMap = useCallback(
    (rootId: string) => {
      soundFx.play("delete");
      setMindMapData((prev) => {
        if (!prev) return prev;
        const { nextData, toastMsg } = removeMindMapFromData(prev, rootId);
        if (toastMsg && showToast) {
          showToast(toastMsg);
        }
        return nextData;
      });
    },
    [setMindMapData, showToast]
  );

  // Menentukan active root untuk pengeditan di panel input
  const handleSetActiveRoot = useCallback(
    (rootId: string) => {
      soundFx.play("click");
      setMindMapData((prev) => (prev ? setActiveRootInData(prev, rootId) : prev));
    },
    [setMindMapData]
  );

  return {
    getAllRoots,
    getActiveRoot,
    handleAddMindMap,
    handleRemoveMindMap,
    handleSetActiveRoot,
  };
}
