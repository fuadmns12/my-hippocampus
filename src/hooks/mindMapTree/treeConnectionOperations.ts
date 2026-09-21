import { MindMapData, MindMapNode, CustomConnection, AnchorSide } from "../../types";
import { findNodeInAnyTree } from "../../utils/nodeTreeOperations";

/**
 * Cek apakah dua node memiliki relasi parent-child langsung dalam hierarki pohon mind map
 */
export function isDirectParentChildInTree(root: MindMapNode, idA: string, idB: string): boolean {
  if (!root.children) return false;
  for (const child of root.children) {
    if ((root.id === idA && child.id === idB) || (root.id === idB && child.id === idA)) {
      return true;
    }
    if (isDirectParentChildInTree(child, idA, idB)) {
      return true;
    }
  }
  return false;
}

export function areNodesDirectParentChild(roots: MindMapNode[], idA: string, idB: string): boolean {
  return roots.some((r) => isDirectParentChildInTree(r, idA, idB));
}

export interface AddConnectionResult {
  nextData: MindMapData;
  toastMsg?: string;
}

const SIDE_NAMES: Record<AnchorSide, string> = {
  top: "Atas",
  bottom: "Bawah",
  left: "Kiri",
  right: "Kanan",
};

/**
 * Menambahkan atau memperbarui koneksi multi-anchor antar dua node
 */
export function addConnectionToData(
  prev: MindMapData,
  sourceNodeId: string,
  sourceAnchorSide: AnchorSide,
  targetNodeId: string,
  targetAnchorSide: AnchorSide,
  label?: string
): AddConnectionResult {
  if (sourceNodeId === targetNodeId) {
    return { nextData: prev };
  }

  const allRoots = [prev.root, ...(prev.additionalRoots || [])];
  const sNode = findNodeInAnyTree(allRoots, sourceNodeId);
  const tNode = findNodeInAnyTree(allRoots, targetNodeId);
  const sName = sNode?.label ? `"${sNode.label}"` : "Kartu";
  const tName = tNode?.label ? `"${tNode.label}"` : "Kartu";

  // 1. Cek apakah kedua kartu sudah terhubung langsung oleh cabang hierarki
  if (areNodesDirectParentChild(allRoots, sourceNodeId, targetNodeId)) {
    return {
      nextData: prev,
      toastMsg: `${sName} dan ${tName} sudah terhubung langsung dalam cabang hierarki`,
    };
  }

  const existing = prev.connections || [];

  // 2. Cek apakah sudah ada koneksi antara kedua node ini (baik searah maupun bolak-balik)
  const existingIndex = existing.findIndex(
    (c) =>
      (c.sourceNodeId === sourceNodeId && c.targetNodeId === targetNodeId) ||
      (c.sourceNodeId === targetNodeId && c.targetNodeId === sourceNodeId)
  );

  if (existingIndex >= 0) {
    // Jika sudah ada koneksi antara kedua node, perbarui anchor agar tidak terjadi duplikat garis
    const currentConn = existing[existingIndex];
    if (
      currentConn.sourceNodeId === sourceNodeId &&
      currentConn.sourceAnchorSide === sourceAnchorSide &&
      currentConn.targetNodeId === targetNodeId &&
      currentConn.targetAnchorSide === targetAnchorSide &&
      (label === undefined || currentConn.label === label)
    ) {
      // Sudah identik, tidak perlu ubah apa pun
      return { nextData: prev };
    }

    const updated = [...existing];
    updated[existingIndex] = {
      ...currentConn,
      sourceNodeId,
      sourceAnchorSide,
      targetNodeId,
      targetAnchorSide,
      label: label !== undefined ? label : currentConn.label,
    };

    return {
      nextData: {
        ...prev,
        connections: updated,
      },
      toastMsg: `Titik rute diperbarui: ${sName} [${SIDE_NAMES[sourceAnchorSide]}] ➔ ${tName} [${SIDE_NAMES[targetAnchorSide]}]`,
    };
  }

  const newConn: CustomConnection = {
    id: `conn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    sourceNodeId,
    sourceAnchorSide,
    targetNodeId,
    targetAnchorSide,
    label,
  };

  return {
    nextData: {
      ...prev,
      connections: [...existing, newConn],
    },
    toastMsg: `Terhubung: ${sName} [${SIDE_NAMES[sourceAnchorSide]}] ➔ ${tName} [${SIDE_NAMES[targetAnchorSide]}]`,
  };
}

/**
 * Menghapus koneksi multi-anchor berdasarkan ID
 */
export function removeConnectionFromData(
  prev: MindMapData,
  connectionId: string
): MindMapData {
  if (!prev.connections) return prev;
  return {
    ...prev,
    connections: prev.connections.filter((c) => c.id !== connectionId),
  };
}
