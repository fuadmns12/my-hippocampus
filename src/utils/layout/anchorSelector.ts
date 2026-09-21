import { MindMapLayout, NodeShape } from "../../types";
import { PositionedNode } from "./types";
import { AnchorPoint, AnchorSide, getNode4Anchors } from "./anchorPoints";

/**
 * Menentukan pasangan titik anchor terbaik dari 4 titik pada source dan 4 titik pada target
 * sehingga jalur garis rute menyambung presisi ke salah satu dari 4 titik tersebut.
 */
export function selectOptimal4PointPair(
  source: PositionedNode,
  target: PositionedNode,
  layout: MindMapLayout,
  overrideShape?: NodeShape | string,
  isCustomConnection?: boolean,
  preferredSourceSide?: AnchorSide,
  preferredTargetSide?: AnchorSide
): { sourceAnchor: AnchorPoint; targetAnchor: AnchorPoint } {
  const sAnchors = getNode4Anchors(source, overrideShape);
  const tAnchors = getNode4Anchors(target, overrideShape);

  // 1. Prioritaskan anchor yang sudah ditentukan secara eksplisit
  // (dari parameter preferred, target.node.sourceAnchorSide / targetAnchorSide)
  const explicitSourceSide = preferredSourceSide || target.node?.sourceAnchorSide;
  const explicitTargetSide = preferredTargetSide || target.node?.targetAnchorSide;

  let sSide: AnchorSide | undefined = explicitSourceSide;
  let tSide: AnchorSide | undefined = explicitTargetSide;

  // Jika kedua sisi sudah ditentukan secara eksplisit, gunakan langsung tanpa diubah oleh geseran node
  if (sSide && tSide && sAnchors[sSide] && tAnchors[tSide]) {
    return {
      sourceAnchor: sAnchors[sSide],
      targetAnchor: tAnchors[tSide],
    };
  }

  const rawSx = source.x + (source.node.xOffset || 0);
  const rawSy = source.y + (source.node.yOffset || 0);
  const rawTx = target.x + (target.node.xOffset || 0);
  const rawTy = target.y + (target.node.yOffset || 0);

  const dx = rawTx - rawSx;
  const dy = rawTy - rawSy;

  // 2. Jika anchor belum eksplisit, tentukan orientasi stabil berdasarkan tipe layout.
  // Geseran node pada horizontal-tree atau bilateral-bracket TIDAK BOLEH membalik anchor ke atas/bawah,
  // dan geseran pada vertical-tree TIDAK BOLEH membalik anchor ke kiri/kanan.
  if (layout === "horizontal-tree" || layout === "fishbone") {
    // Jalur utama horizontal: Kanan induk ➔ Kiri anak
    if (!sSide) sSide = dx < -40 ? "left" : "right";
    if (!tSide) tSide = dx < -40 ? "right" : "left";
  } else if (layout === "vertical-tree") {
    // Jalur utama vertikal: Bawah induk ➔ Atas anak
    if (!sSide) sSide = dy < -40 ? "top" : "bottom";
    if (!tSide) tSide = dy < -40 ? "bottom" : "top";
  } else if (layout === "bilateral-bracket") {
    // Bilateral bracket: cabang kiri vs cabang kanan tetap menggunakan anchor horizontal
    const isLeft = target.isLeftBranch || dx < -20;
    if (!sSide) sSide = isLeft ? "left" : "right";
    if (!tSide) tSide = isLeft ? "right" : "left";
  } else {
    // Radial, bubble-cluster, grid-network, atau koneksi bebas
    const angle = Math.atan2(dy, dx);
    if (!sSide) {
      if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
        sSide = "right";
      } else if (angle >= Math.PI / 4 && angle < (3 * Math.PI) / 4) {
        sSide = "bottom";
      } else if (angle >= -(3 * Math.PI) / 4 && angle < -Math.PI / 4) {
        sSide = "top";
      } else {
        sSide = "left";
      }
    }
    if (!tSide) {
      if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
        tSide = "left";
      } else if (angle >= Math.PI / 4 && angle < (3 * Math.PI) / 4) {
        tSide = "top";
      } else if (angle >= -(3 * Math.PI) / 4 && angle < -Math.PI / 4) {
        tSide = "bottom";
      } else {
        tSide = "right";
      }
    }
  }

  return {
    sourceAnchor: sAnchors[sSide || "right"],
    targetAnchor: tAnchors[tSide || "left"],
  };
}
