import { ConnectorStyle, MindMapLayout, NodeShape } from "../../types";
import { PositionedNode } from "./types";
import { AnchorPoint, AnchorSide, getAnchorNormal } from "./anchorPoints";
import { selectOptimal4PointPair } from "./anchorSelector";

/**
 * Membangun jalur SVG kurva presisi antara dua AnchorPoint 4-sisi.
 * Menggunakan vektor normal sehingga jalur keluar dan masuk tegak lurus terhadap batas node.
 */
export function buildPathBetweenAnchors(
  sourceAnchor: AnchorPoint,
  targetAnchor: AnchorPoint,
  style: ConnectorStyle = "bezier"
): string {
  const { x: sx, y: sy, side: sSide } = sourceAnchor;
  const { x: tx, y: ty, side: tSide } = targetAnchor;

  if (style === "straight") {
    return `M ${sx} ${sy} L ${tx} ${ty}`;
  }

  if (style === "angled") {
    const isSHoriz = sSide === "left" || sSide === "right";
    const isTHoriz = tSide === "left" || tSide === "right";

    if (isSHoriz && isTHoriz) {
      const midX = (sx + tx) / 2;
      return `M ${sx} ${sy} H ${midX} V ${ty} H ${tx}`;
    } else if (!isSHoriz && !isTHoriz) {
      const midY = (sy + ty) / 2;
      return `M ${sx} ${sy} V ${midY} H ${tx} V ${ty}`;
    } else if (isSHoriz && !isTHoriz) {
      return `M ${sx} ${sy} H ${tx} V ${ty}`;
    } else {
      return `M ${sx} ${sy} V ${ty} H ${tx}`;
    }
  }

  // Smooth Bezier Curve:
  // Titik kontrol mengikuti arah normal masing-masing anchor agar kurva mulus tanpa melengkung terbalik
  const sn = getAnchorNormal(sSide);
  const tn = getAnchorNormal(tSide);

  const dist = Math.hypot(tx - sx, ty - sy);
  const curvature = Math.max(28, Math.min(dist * 0.48, 160));

  const cp1x = sx + sn.nx * curvature;
  const cp1y = sy + sn.ny * curvature;
  const cp2x = tx + tn.nx * curvature;
  const cp2y = ty + tn.ny * curvature;

  return `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tx} ${ty}`;
}

/**
 * Membangun jalur SVG dari AnchorPoint ke posisi pointer bebas (saat drag bebas di kanvas).
 */
export function buildPathToFreePointer(
  sourceAnchor: AnchorPoint,
  pointer: { x: number; y: number }
): string {
  const { x: sx, y: sy, side: sSide } = sourceAnchor;
  const tx = pointer.x;
  const ty = pointer.y;

  const sn = getAnchorNormal(sSide);
  const dist = Math.hypot(tx - sx, ty - sy);
  const curvature = Math.max(24, Math.min(dist * 0.4, 120));

  const cp1x = sx + sn.nx * curvature;
  const cp1y = sy + sn.ny * curvature;
  const cp2x = tx - sn.nx * (curvature * 0.25);
  const cp2y = ty - sn.ny * (curvature * 0.25);

  return `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tx} ${ty}`;
}

// SVG Path Generator for link connectors connecting strictly to one of the 4 anchor points
export function buildSvgPath(
  source: PositionedNode,
  target: PositionedNode,
  style: ConnectorStyle,
  layout: MindMapLayout,
  overrideShape?: NodeShape | string,
  isCustomConnection?: boolean,
  preferredSourceSide?: AnchorSide,
  preferredTargetSide?: AnchorSide
): string {
  const { sourceAnchor, targetAnchor } = selectOptimal4PointPair(
    source,
    target,
    layout,
    overrideShape,
    isCustomConnection,
    preferredSourceSide,
    preferredTargetSide
  );
  return buildPathBetweenAnchors(sourceAnchor, targetAnchor, style);
}
