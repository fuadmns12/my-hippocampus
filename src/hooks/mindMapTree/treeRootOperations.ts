import { MindMapData, MindMapNode } from "../../types";

/**
 * Mengambil semua root node (main root dan additionalRoots) dari mindMapData
 */
export function getAllRootsFromData(mindMapData: MindMapData | null): MindMapNode[] {
  if (!mindMapData) return [];
  return [mindMapData.root, ...(mindMapData.additionalRoots || [])];
}

/**
 * Mengambil root node yang sedang aktif dipilih / diedit
 */
export function getActiveRootFromData(mindMapData: MindMapData | null): MindMapNode | null {
  if (!mindMapData) return null;
  const all = [mindMapData.root, ...(mindMapData.additionalRoots || [])];
  if (mindMapData.activeRootId) {
    const found = all.find((r) => r.id === mindMapData.activeRootId);
    if (found) return found;
  }
  return mindMapData.root;
}

/**
 * Menambahkan mind map baru ke kanvas (atau inisialisasi jika data kosong)
 */
export function addMindMapToData(
  prev: MindMapData | null,
  newRoot: MindMapNode
): MindMapData {
  if (!prev) {
    return {
      id: `map-${Date.now()}`,
      title: newRoot.label,
      subtitle: newRoot.subtitle,
      rawNamesText: newRoot.rawNamesText || "",
      root: newRoot,
      createdAt: new Date().toISOString(),
      layout: "radial",
      theme: "corporate",
      connectorStyle: "bezier",
      nodeShape: "rounded",
      activeRootId: newRoot.id,
    };
  }

  const existingAdditional = prev.additionalRoots || [];
  return {
    ...prev,
    additionalRoots: [...existingAdditional, newRoot],
    activeRootId: newRoot.id,
  };
}

export interface RemoveMindMapResult {
  nextData: MindMapData | null;
  toastMsg?: string;
}

/**
 * Menghapus mind map (baik root utama ataupun root tambahan) dari kanvas
 */
export function removeMindMapFromData(
  prev: MindMapData,
  rootId: string
): RemoveMindMapResult {
  const isMainRoot = prev.root.id === rootId;
  const additional = prev.additionalRoots || [];

  if (isMainRoot) {
    if (additional.length > 0) {
      const [newMain, ...remaining] = additional;
      return {
        nextData: {
          ...prev,
          title: newMain.label,
          subtitle: newMain.subtitle || "",
          rawNamesText: newMain.rawNamesText || "",
          root: newMain,
          additionalRoots: remaining,
          activeRootId: newMain.id,
        },
        toastMsg: `Mind Map "${prev.root.label}" dihapus dari kanvas.`,
      };
    } else {
      return {
        nextData: null,
        toastMsg: "Mind Map berhasil dihapus.",
      };
    }
  } else {
    const removed = additional.find((r) => r.id === rootId);
    const remaining = additional.filter((r) => r.id !== rootId);
    return {
      nextData: {
        ...prev,
        additionalRoots: remaining,
        activeRootId: prev.activeRootId === rootId ? prev.root.id : prev.activeRootId,
      },
      toastMsg: `Mind Map "${removed?.label || "Peta"}" dihapus dari kanvas.`,
    };
  }
}

/**
 * Mengubah activeRootId
 */
export function setActiveRootInData(
  prev: MindMapData,
  rootId: string
): MindMapData {
  return {
    ...prev,
    activeRootId: rootId,
  };
}
