import { MindMapData } from "../../types";
import {
  toggleCollapseInTree,
  updateOffsetInTree,
  updateScaleInTree,
  clearOffsetsInTree,
} from "../../utils/nodeTreeOperations";

/**
 * Toggle status collapse/expand pada sub-cabang node
 */
export function toggleCollapseNodeInData(
  prev: MindMapData,
  nodeId: string
): MindMapData {
  return {
    ...prev,
    root: toggleCollapseInTree(prev.root, nodeId),
    additionalRoots: prev.additionalRoots?.map((r) =>
      toggleCollapseInTree(r, nodeId)
    ),
  };
}

/**
 * Update offset posisi kustom node (drag bebas di kanvas)
 */
export function updateNodeOffsetInData(
  prev: MindMapData,
  nodeId: string,
  xOffset: number,
  yOffset: number
): MindMapData {
  const roundedX = Math.round(xOffset);
  const roundedY = Math.round(yOffset);
  return {
    ...prev,
    root: updateOffsetInTree(prev.root, nodeId, roundedX, roundedY),
    additionalRoots: prev.additionalRoots?.map((r) =>
      updateOffsetInTree(r, nodeId, roundedX, roundedY)
    ),
  };
}

/**
 * Update skala ukuran node (zoom/resize node)
 */
export function updateNodeScaleInData(
  prev: MindMapData,
  nodeId: string,
  scale: number
): MindMapData {
  const clampedScale = Math.min(2.5, Math.max(0.5, Number(scale.toFixed(2))));
  return {
    ...prev,
    root: updateScaleInTree(prev.root, nodeId, clampedScale),
    additionalRoots: prev.additionalRoots?.map((r) =>
      updateScaleInTree(r, nodeId, clampedScale)
    ),
  };
}

/**
 * Reset seluruh offset node cabang, mempertahankan posisi root mandiri
 */
export function resetNodeOffsetsInData(prev: MindMapData): MindMapData {
  // For main root: reset children offsets, keep root offset if any
  const cleanedRoot = clearOffsetsInTree(prev.root);
  if (prev.root.xOffset !== undefined) cleanedRoot.xOffset = prev.root.xOffset;
  if (prev.root.yOffset !== undefined) cleanedRoot.yOffset = prev.root.yOffset;

  // For additional roots: reset children offsets, preserve each root's own xOffset/yOffset
  const cleanedAdditional = prev.additionalRoots?.map((r) => {
    const cleaned = clearOffsetsInTree(r);
    if (r.xOffset !== undefined) cleaned.xOffset = r.xOffset;
    if (r.yOffset !== undefined) cleaned.yOffset = r.yOffset;
    return cleaned;
  });

  return {
    ...prev,
    root: cleanedRoot,
    additionalRoots: cleanedAdditional,
  };
}
