import { PositionedNode } from "../../../utils/layout/types";
import { isDescendantOf } from "./viewportHelpers";

/**
 * Deteksi kandidat node induk saat sebuah node digeser dan ditumpuk di atas node lain
 */
export function findDropTargetCandidate(
  nodes: PositionedNode[] | undefined,
  draggingNodeId: string,
  rawX: number,
  rawY: number
): PositionedNode | null {
  if (!nodes || nodes.length === 0) return null;

  const draggedPos = nodes.find((n) => n.node.id === draggingNodeId);
  if (!draggedPos) return null;

  // Root node tidak dapat di-reparent ke node lain
  if (
    draggedPos.depth === 0 &&
    nodes.length > 0 &&
    draggedPos.node.id === nodes[0]?.node.id
  ) {
    return null;
  }

  const currCenterX = draggedPos.x + rawX;
  const currCenterY = draggedPos.y + rawY;

  let bestTarget: PositionedNode | null = null;
  let minDistance = Infinity;

  for (const candidate of nodes) {
    if (candidate.node.id === draggedPos.node.id) continue;
    if (isDescendantOf(draggedPos.node, candidate.node.id)) continue;
    if (draggedPos.parent && candidate.node.id === draggedPos.parent.node.id) continue;

    const candCx = candidate.x + (candidate.node.xOffset || 0);
    const candCy = candidate.y + (candidate.node.yOffset || 0);

    const cdx = Math.abs(currCenterX - candCx);
    const cdy = Math.abs(currCenterY - candCy);

    // Hanya picu kandidat jika node benar-benar ditumpuk/di-drop langsung di atas badan node lain
    const hitW = Math.min(candidate.width, draggedPos.width) * 0.45;
    const hitH = Math.min(candidate.height, draggedPos.height) * 0.45;

    if (cdx < hitW && cdy < hitH) {
      const dist = Math.hypot(cdx, cdy);
      if (dist < minDistance) {
        minDistance = dist;
        bestTarget = candidate;
      }
    }
  }

  return bestTarget;
}
