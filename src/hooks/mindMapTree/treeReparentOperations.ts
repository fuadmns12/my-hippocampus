import { MindMapData, MindMapNode, AnchorSide } from "../../types";
import { reparentNodeInTree } from "../../utils/nodeTreeOperations";
import {
  handleRootReparent,
  handleCrossTreeDetachAndAttach,
} from "./treeReparentHelpers";

export interface ReparentNodeResult {
  nextData: MindMapData;
  movedNode: MindMapNode | null;
  isSameParentChange: boolean;
}

/**
 * Memindahkan node ke induk baru (dalam satu pohon maupun lintas pohon/root)
 * atau memperbarui posisi sisi anchor pada induk yang sama.
 */
export function reparentNodeAcrossTrees(
  prev: MindMapData,
  nodeId: string,
  newParentId: string,
  sourceAnchorSide?: AnchorSide,
  targetAnchorSide?: AnchorSide
): ReparentNodeResult {
  if (nodeId === newParentId) {
    return { nextData: prev, movedNode: null, isSameParentChange: false };
  }

  let isSameParentChange = false;

  // 1. Coba reparent di dalam main root
  const { updatedRoot: mainUpdatedRoot, movedNode, sameParent } = reparentNodeInTree(
    prev.root,
    nodeId,
    newParentId,
    sourceAnchorSide,
    targetAnchorSide
  );

  let updatedRoot = mainUpdatedRoot;
  let updatedAdditional = prev.additionalRoots;
  let finalMovedNode = movedNode;
  if (sameParent) isSameParentChange = true;

  // 2. Jika tidak ditemukan di main root, coba di each additionalRoot
  if (!finalMovedNode && prev.additionalRoots) {
    updatedAdditional = prev.additionalRoots.map((r) => {
      const res = reparentNodeInTree(r, nodeId, newParentId, sourceAnchorSide, targetAnchorSide);
      if (res.movedNode) {
        finalMovedNode = res.movedNode;
        if (res.sameParent) isSameParentChange = true;
      }
      return res.updatedRoot;
    });
  }

  // 3. Kasus khusus: memindahkan antar root atau mempromosikan/menempelkan root
  if (!finalMovedNode && prev.additionalRoots && prev.additionalRoots.length > 0) {
    // 3a & 3b. Cek jika nodeId adalah floating root atau main root yang dipindahkan
    const rootReparentRes = handleRootReparent(
      prev.root,
      prev.additionalRoots,
      nodeId,
      newParentId,
      sourceAnchorSide,
      targetAnchorSide
    );

    if (rootReparentRes) {
      updatedRoot = rootReparentRes.updatedRoot;
      updatedAdditional = rootReparentRes.updatedAdditional;
      finalMovedNode = rootReparentRes.movedNode;
    } else {
      // 3c. Detach dan pasang antar-pohon (cross-tree child node reparenting)
      const crossRes = handleCrossTreeDetachAndAttach(
        prev.root,
        prev.additionalRoots,
        nodeId,
        newParentId,
        sourceAnchorSide,
        targetAnchorSide
      );

      if (crossRes) {
        updatedRoot = crossRes.updatedRoot;
        updatedAdditional = crossRes.updatedAdditional;
        finalMovedNode = crossRes.movedNode;
      }
    }
  }

  if (!finalMovedNode) {
    return { nextData: prev, movedNode: null, isSameParentChange: false };
  }

  // Bersihkan koneksi kustom lama jika node dipindahkan ke parent tersebut
  // agar tidak ada duplikasi garis antara relasi hierarki langsung dan koneksi kustom
  const cleanedConnections = prev.connections?.filter(
    (c) =>
      !(
        (c.sourceNodeId === nodeId && c.targetNodeId === newParentId) ||
        (c.sourceNodeId === newParentId && c.targetNodeId === nodeId)
      )
  );

  const survivingRootIds = [updatedRoot.id, ...(updatedAdditional || []).map((r) => r.id)];
  const nextActiveRootId = survivingRootIds.includes(prev.activeRootId || "")
    ? prev.activeRootId
    : updatedRoot.id;

  return {
    nextData: {
      ...prev,
      root: updatedRoot,
      additionalRoots: updatedAdditional,
      connections: cleanedConnections,
      activeRootId: nextActiveRootId,
    },
    movedNode: finalMovedNode,
    isSameParentChange,
  };
}

export {
  detachNodeAsRootFromData,
  type DetachNodeResult,
} from "./treeDetachOperations";
