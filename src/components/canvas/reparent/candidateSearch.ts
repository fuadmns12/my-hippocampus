import { MindMapNode } from "../../../types";
import {
  PositionedNode,
  getNode4Anchors,
  AnchorPoint,
  AnchorSide,
} from "../../../utils/mindmapLayout";

/**
 * Cek apakah targetId adalah keturunan (descendant) dari node tertentu
 */
export function isDescendantNode(parent: MindMapNode, targetId: string): boolean {
  if (!parent.children) return false;
  for (const child of parent.children) {
    if (child.id === targetId || isDescendantNode(child, targetId)) {
      return true;
    }
  }
  return false;
}

/**
 * Cari candidate node terdekat di canvas dalam radius snap (mengabaikan origin node)
 */
export function findSnapCandidate(
  nodes: PositionedNode[],
  originNodeId: string,
  curX: number,
  curY: number,
  snapPadding = 48
): PositionedNode | null {
  let bestCandidate: PositionedNode | null = null;
  let minDistance = Infinity;

  for (const cand of nodes) {
    if (cand.node.id === originNodeId) continue;

    const isCircle = cand.shape === "circle";
    const cx = cand.x + (cand.node.xOffset || 0);
    const cy = cand.y + (cand.node.yOffset || 0);
    const hw = isCircle ? Math.max(cand.width / 2, cand.height / 2) : cand.width / 2;
    const hh = isCircle ? Math.max(cand.width / 2, cand.height / 2) : cand.height / 2;

    const dx = Math.abs(curX - cx);
    const dy = Math.abs(curY - cy);

    if (dx <= hw + snapPadding && dy <= hh + snapPadding) {
      const dist = Math.hypot(curX - cx, curY - cy);
      if (dist < minDistance) {
        minDistance = dist;
        bestCandidate = cand;
      }
    }
  }

  return bestCandidate;
}

/**
 * Pilih salah satu dari 4 anchor candidate (Atas, Bawah, Kiri, Kanan)
 * yang paling dekat dengan posisi kursor pengguna saat ini
 */
export function findClosestAnchor(
  candidate: PositionedNode,
  curX: number,
  curY: number
): { bestAnchor: AnchorPoint; minAnchorDist: number } {
  const candAnchors = getNode4Anchors(candidate);
  const candList = [
    candAnchors.top,
    candAnchors.bottom,
    candAnchors.left,
    candAnchors.right,
  ];

  let bestAnchor = candAnchors.left;
  let minAnchorDist = Infinity;

  for (const anchor of candList) {
    const distToCursor = Math.hypot(curX - anchor.x, curY - anchor.y);
    if (distToCursor < minAnchorDist) {
      minAnchorDist = distToCursor;
      bestAnchor = anchor;
    }
  }

  return { bestAnchor, minAnchorDist };
}

/**
 * Hitung titik anchor asal (origin) yang aktif:
 * - Pada connect mode: anchor asal tetap terpancang pada anchor yang dipilih
 * - Pada reparent mode: orientasikan anchor pada childNode ke arah target / pointer
 */
export function calculateOriginAnchor(
  isConnectMode: boolean,
  originNode: PositionedNode,
  sourceAnchorSide: AnchorSide,
  targetPoint: { x: number; y: number }
): AnchorPoint {
  if (isConnectMode) {
    const originAnchors = getNode4Anchors(originNode);
    return originAnchors[sourceAnchorSide] || originAnchors.right;
  }

  const childAnchors = getNode4Anchors(originNode);
  const childCx = originNode.x + (originNode.node.xOffset || 0);
  const childCy = originNode.y + (originNode.node.yOffset || 0);
  const vecX = targetPoint.x - childCx;
  const vecY = targetPoint.y - childCy;

  if (Math.abs(vecX) * originNode.height >= Math.abs(vecY) * originNode.width) {
    return vecX >= 0 ? childAnchors.right : childAnchors.left;
  } else {
    return vecY >= 0 ? childAnchors.bottom : childAnchors.top;
  }
}
