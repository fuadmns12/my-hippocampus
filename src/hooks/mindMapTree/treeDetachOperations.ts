import { MindMapData, MindMapNode } from "../../types";
import { detachNodeFromTree } from "../../utils/nodeTreeOperations";

export interface DetachNodeResult {
  nextData: MindMapData;
  detachedNode: MindMapNode | null;
}

/**
 * Memutuskan cabang child node dan mempromosikannya menjadi Topik/Root Mandiri (floating root) di kanvas.
 */
export function detachNodeAsRootFromData(
  prev: MindMapData,
  nodeId: string,
  currentPos?: { x: number; y: number }
): DetachNodeResult {
  if (prev.root.id === nodeId || prev.additionalRoots?.some((r) => r.id === nodeId)) {
    return { nextData: prev, detachedNode: null };
  }

  let updatedRoot = prev.root;
  let detachedNode: MindMapNode | null = null;

  // 1. Coba detach dari main root
  const rootRes = detachNodeFromTree(prev.root, nodeId);
  if (rootRes.detachedNode) {
    updatedRoot = rootRes.updatedRoot;
    detachedNode = rootRes.detachedNode;
  }

  // 2. Jika bukan dari main root, cari di additionalRoots
  let updatedAdditional = prev.additionalRoots ? [...prev.additionalRoots] : [];
  if (!detachedNode && prev.additionalRoots) {
    updatedAdditional = prev.additionalRoots.map((r) => {
      const res = detachNodeFromTree(r, nodeId);
      if (res.detachedNode) {
        detachedNode = res.detachedNode;
      }
      return res.updatedRoot;
    });
  }

  if (!detachedNode) {
    return { nextData: prev, detachedNode: null };
  }

  let finalDetachedNode: MindMapNode = detachedNode;
  if (currentPos) {
    let baseCenterX = 800;
    let baseCenterY = 600;
    if (prev.layout === "horizontal-tree" || prev.layout === "fishbone") {
      baseCenterX = 150;
      baseCenterY = 600;
    } else if (prev.layout === "vertical-tree") {
      baseCenterX = 800;
      baseCenterY = 100;
    }
    finalDetachedNode = {
      ...detachedNode,
      xOffset: Math.round(currentPos.x - baseCenterX),
      yOffset: Math.round(currentPos.y - baseCenterY),
    };
  }

  // Bersihkan koneksi kustom jika ada relasi langsung yang sudah tidak relevan
  const cleanedConnections = prev.connections?.filter(
    (c) => !(c.sourceNodeId === nodeId && c.targetNodeId === updatedRoot.id)
  );

  return {
    nextData: {
      ...prev,
      root: updatedRoot,
      additionalRoots: [...updatedAdditional, finalDetachedNode],
      activeRootId: finalDetachedNode.id,
      connections: cleanedConnections,
    },
    detachedNode: finalDetachedNode,
  };
}
