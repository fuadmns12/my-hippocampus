import { PositionedNode, NodeLink } from "../../../utils/mindmapLayout";
import { isDescendantNode } from "./candidateSearch";
import { ReparentDragState } from "./types";

export interface TargetValidationResult {
  isMergeAction: boolean;
  isValid: boolean;
  invalidReason?: ReparentDragState["invalidReason"];
}

/**
 * Menentukan apakah interaksi ini adalah penggabungan cabang hierarki (reparent/merge)
 * atau pembuatan garis relasi kustom (connect), serta memvalidasi keabsahan node target.
 */
export function evaluateTargetCandidate({
  isConnectMode,
  originNode,
  candidate,
  curX,
  curY,
  minAnchorDist,
  links,
}: {
  isConnectMode: boolean;
  originNode: PositionedNode;
  candidate: PositionedNode;
  curX: number;
  curY: number;
  minAnchorDist: number;
  links: NodeLink[];
}): TargetValidationResult {
  const candCenterX = candidate.x + (candidate.node.xOffset || 0);
  const candCenterY = candidate.y + (candidate.node.yOffset || 0);
  const distToCenter = Math.hypot(curX - candCenterX, curY - candCenterY);
  const candMinDim = Math.min(candidate.width, candidate.height);

  // Kasus 1: Mode reparent bawaan
  // Kasus 2: Origin node adalah root dari hierarki independen (depth === 0).
  //          Menghubungkannya ke node lain selalu bertujuan menggabungkan hierarki tersebut sebagai cabang!
  // Kasus 3: Kursor dilepaskan di atas badan card node (bukan tepat di titik anchor terluar)
  const isDraggingIndependentRoot = originNode.depth === 0;
  const isHoveringCardBody = distToCenter < candMinDim * 0.85 && minAnchorDist > 22;
  const isMergeAction =
    !isConnectMode || isDraggingIndependentRoot || isHoveringCardBody;

  if (isMergeAction) {
    // Validasi reparent/merge hierarki:
    // 1. Tidak boleh ke diri sendiri
    // 2. Tidak boleh ke anak/keturunan sendiri
    const isSelf = candidate.node.id === originNode.node.id;
    const isDescendant = isDescendantNode(originNode.node, candidate.node.id);

    if (isSelf) {
      return { isMergeAction, isValid: false, invalidReason: "self" };
    }
    if (isDescendant) {
      return { isMergeAction, isValid: false, invalidReason: "descendant" };
    }
    return { isMergeAction, isValid: true };
  }

  // Dalam mode multi-anchor connect:
  // 1. Tidak boleh ke diri sendiri
  // 2. Tidak boleh ke node yang sudah terhubung langsung dalam hierarki (mencegah duplikat garis rute)
  const isSelf = candidate.node.id === originNode.node.id;
  const isAlreadyHierarchy = links.some(
    (l) =>
      !l.isCustomConnection &&
      ((l.source.node.id === originNode.node.id && l.target.node.id === candidate.node.id) ||
        (l.source.node.id === candidate.node.id && l.target.node.id === originNode.node.id))
  );

  if (isSelf) {
    return { isMergeAction, isValid: false, invalidReason: "self" };
  }
  if (isAlreadyHierarchy) {
    return { isMergeAction, isValid: false, invalidReason: "already_connected_hierarchy" };
  }

  return { isMergeAction, isValid: true };
}
