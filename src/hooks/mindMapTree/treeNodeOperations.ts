import { MindMapData, MindMapNode, NodeNote } from "../../types";
import {
  updateNodeInTree,
  updateNotesInTree,
  addChildInTree,
  deleteNodeFromTree,
} from "../../utils/nodeTreeOperations";

export interface SaveNodeResult {
  nextData: MindMapData;
  isMainRoot: boolean;
}

/**
 * Memperbarui konten node pada seluruh pohon (root utama maupun additionalRoots)
 */
export function saveNodeToData(
  prev: MindMapData,
  updatedNode: MindMapNode
): SaveNodeResult {
  const isMainRoot = prev.root.id === updatedNode.id;
  const updatedRoot = updateNodeInTree(prev.root, updatedNode);
  const updatedAdditional = prev.additionalRoots?.map((r) =>
    updateNodeInTree(r, updatedNode)
  );

  const newTitle = isMainRoot ? updatedNode.label : prev.title;
  const newSubtitle = isMainRoot
    ? updatedNode.subtitle || ""
    : prev.subtitle;

  return {
    nextData: {
      ...prev,
      title: newTitle,
      subtitle: newSubtitle,
      root: updatedRoot,
      additionalRoots: updatedAdditional,
    },
    isMainRoot,
  };
}

/**
 * Menyimpan catatan (notes) untuk sebuah node
 */
export function saveNotesToData(
  prev: MindMapData,
  nodeId: string,
  notes: NodeNote[]
): MindMapData {
  return {
    ...prev,
    root: updateNotesInTree(prev.root, nodeId, notes),
    additionalRoots: prev.additionalRoots?.map((r) =>
      updateNotesInTree(r, nodeId, notes)
    ),
  };
}

export interface AddChildResult {
  nextData: MindMapData;
  newChild: MindMapNode;
}

/**
 * Menambahkan single child node ke parentId
 */
export function addChildNodeToData(
  prev: MindMapData,
  parentId: string,
  childLabel: string
): AddChildResult {
  const uniqueId = `node-child-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newChild: MindMapNode = {
    id: uniqueId,
    label: childLabel,
  };
  const updatedRoot = addChildInTree(prev.root, parentId, newChild);
  const updatedAdditional = prev.additionalRoots?.map((r) =>
    addChildInTree(r, parentId, newChild)
  );

  return {
    nextData: {
      ...prev,
      root: updatedRoot,
      additionalRoots: updatedAdditional,
    },
    newChild,
  };
}

/**
 * Menambahkan multiple child nodes sekaligus
 */
export function addMultipleChildrenToData(
  prev: MindMapData,
  parentId: string,
  childLabels: string[]
): MindMapData {
  const validLabels = childLabels.map((l) => l.trim()).filter((l) => l.length > 0);
  if (validLabels.length === 0) return prev;

  let updatedRoot = prev.root;
  let updatedAdditional = prev.additionalRoots ? [...prev.additionalRoots] : undefined;

  validLabels.forEach((lbl, idx) => {
    const uniqueId = `node-child-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`;
    const newChild: MindMapNode = {
      id: uniqueId,
      label: lbl,
    };
    updatedRoot = addChildInTree(updatedRoot, parentId, newChild);
    if (updatedAdditional) {
      updatedAdditional = updatedAdditional.map((r) => addChildInTree(r, parentId, newChild));
    }
  });

  return {
    ...prev,
    root: updatedRoot,
    additionalRoots: updatedAdditional,
  };
}

/**
 * Menambahkan multiple child nodes lengkap (dengan subtitle, emoji, dan catatan)
 */
export function addRichChildrenToData(
  prev: MindMapData,
  parentId: string,
  children: Array<{
    label: string;
    subtitle?: string;
    emoji?: string;
    notes?: Array<{ title: string; content: string }>;
  }>
): MindMapData {
  if (!children || children.length === 0) return prev;

  let updatedRoot = prev.root;
  let updatedAdditional = prev.additionalRoots ? [...prev.additionalRoots] : undefined;

  children.forEach((item, idx) => {
    const uniqueId = `node-child-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`;
    const newChild: MindMapNode = {
      id: uniqueId,
      label: item.label,
      subtitle: item.subtitle,
      emoji: item.emoji || "📌",
      notes: item.notes?.map((n, nIdx) => ({
        id: `note-${uniqueId}-${nIdx}-${Date.now()}`,
        title: n.title || "Catatan",
        content: n.content || "",
        createdAt: new Date().toISOString(),
      })),
    };
    updatedRoot = addChildInTree(updatedRoot, parentId, newChild);
    if (updatedAdditional) {
      updatedAdditional = updatedAdditional.map((r) => addChildInTree(r, parentId, newChild));
    }
  });

  return {
    ...prev,
    root: updatedRoot,
    additionalRoots: updatedAdditional,
  };
}

export interface DeleteNodeResult {
  nextData: MindMapData | null;
  toastMsg?: string;
  isDeletedNodeRoot: boolean;
}

/**
 * Menghapus node (root map atau node cabang) beserta pembersihan relasi koneksinya
 */
export function deleteNodeFromData(
  prev: MindMapData,
  nodeId: string
): DeleteNodeResult {
  // 1. Jika node yang dihapus adalah root utama
  if (prev.root.id === nodeId) {
    if (prev.additionalRoots && prev.additionalRoots.length > 0) {
      const [newMain, ...remaining] = prev.additionalRoots;
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
        isDeletedNodeRoot: true,
      };
    } else {
      return {
        nextData: null,
        toastMsg: "Mind Map berhasil dihapus.",
        isDeletedNodeRoot: true,
      };
    }
  }

  // 2. Jika node yang dihapus adalah salah satu additionalRoots
  if (prev.additionalRoots?.some((r) => r.id === nodeId)) {
    const removed = prev.additionalRoots.find((r) => r.id === nodeId);
    const remaining = prev.additionalRoots.filter((r) => r.id !== nodeId);
    return {
      nextData: {
        ...prev,
        additionalRoots: remaining,
        activeRootId: prev.activeRootId === nodeId ? prev.root.id : prev.activeRootId,
      },
      toastMsg: `Mind Map "${removed?.label || "Peta"}" dihapus dari kanvas.`,
      isDeletedNodeRoot: true,
    };
  }

  // 3. Menghapus node cabang dalam pohon
  const updatedRoot = deleteNodeFromTree(prev.root, nodeId);
  const updatedAdditional = prev.additionalRoots?.map((r) =>
    deleteNodeFromTree(r, nodeId)
  );

  return {
    nextData: {
      ...prev,
      root: updatedRoot,
      additionalRoots: updatedAdditional,
      connections: prev.connections?.filter(
        (c) => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId
      ),
    },
    isDeletedNodeRoot: false,
  };
}
