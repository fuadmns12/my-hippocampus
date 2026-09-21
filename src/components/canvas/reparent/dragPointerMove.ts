import { PositionedNode, NodeLink } from "../../../utils/mindmapLayout";
import { ReparentDragState } from "./types";
import {
  findSnapCandidate,
  findClosestAnchor,
  calculateOriginAnchor,
} from "./candidateSearch";
import { evaluateTargetCandidate } from "./targetValidation";

export interface ComputeDragMoveParams {
  currentDrag: ReparentDragState;
  nodes: PositionedNode[];
  links: NodeLink[];
  curX: number;
  curY: number;
}

export function computeNextDragStateOnMove({
  currentDrag,
  nodes,
  links,
  curX,
  curY,
}: ComputeDragMoveParams): ReparentDragState {
  const isConnectMode = currentDrag.mode === "connect";
  const originNode = isConnectMode ? currentDrag.sourceNode : currentDrag.childNode;

  // 1. Cari candidate node di canvas dalam radius snap
  const bestCandidate = findSnapCandidate(
    nodes,
    originNode.node.id,
    curX,
    curY,
    48
  );

  if (bestCandidate) {
    // 2. Cari anchor terdekat pada candidate node
    const { bestAnchor, minAnchorDist } = findClosestAnchor(bestCandidate, curX, curY);

    // 3. Evaluasi apakah aksi merge/reparent atau connect, serta keabsahan target
    const { isMergeAction, isValid, invalidReason } = evaluateTargetCandidate({
      isConnectMode,
      originNode,
      candidate: bestCandidate,
      curX,
      curY,
      minAnchorDist,
      links,
    });

    // 4. Hitung titik anchor asal yang aktif
    const activeOriginAnchor = calculateOriginAnchor(
      isConnectMode,
      originNode,
      currentDrag.sourceAnchorSide,
      bestAnchor
    );

    return {
      ...currentDrag,
      currentPointer: { x: curX, y: curY },
      childAnchor: activeOriginAnchor,
      hoveredTargetNode: bestCandidate,
      targetAnchor: bestAnchor,
      isValidTarget: isValid,
      invalidReason,
      isSnapped: true,
      isMergeAction,
    };
  }

  // Free dragging: Kursor belum snap ke target node manapun
  const activeOriginAnchor = calculateOriginAnchor(
    isConnectMode,
    originNode,
    currentDrag.sourceAnchorSide,
    { x: curX, y: curY }
  );

  return {
    ...currentDrag,
    currentPointer: { x: curX, y: curY },
    childAnchor: activeOriginAnchor,
    hoveredTargetNode: null,
    targetAnchor: null,
    isValidTarget: false,
    isSnapped: false,
    isMergeAction: false,
  };
}
