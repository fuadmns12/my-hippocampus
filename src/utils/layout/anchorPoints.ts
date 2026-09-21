import { NodeShape } from "../../types";
import { PositionedNode } from "./types";

export type AnchorSide = "top" | "bottom" | "left" | "right";

export interface AnchorPoint {
  x: number;
  y: number;
  side: AnchorSide;
}

/**
 * Menghitung 4 titik koneksi presisi pada node:
 * - Tengah Atas (Top Center)
 * - Tengah Bawah (Bottom Center)
 * - Tengah Kiri (Left Center)
 * - Tengah Kanan (Right Center)
 * 
 * Mendukung bentuk lingkaran (circle), oval, maupun persegi/rounded secara akurat.
 */
export function getNode4Anchors(
  node: PositionedNode,
  overrideShape?: NodeShape | string
): Record<AnchorSide, AnchorPoint> {
  const shape = overrideShape || node?.shape;
  const cx = (node?.x ?? 0) + (node?.node?.xOffset || 0);
  const cy = (node?.y ?? 0) + (node?.node?.yOffset || 0);
  const hw = Math.max(20, (node?.width || 175) / 2);
  const hh = Math.max(15, (node?.height || 46) / 2);

  let topY = cy - hh;
  let bottomY = cy + hh;
  let leftX = cx - hw;
  let rightX = cx + hw;

  if (shape === "circle") {
    // Pada bentuk lingkaran (circle), radius adalah Math.max(hw, hh)
    // Titik anchor atas, bawah, kiri, kanan harus menempel tepat di keliling lingkaran luar
    const radius = Math.max(hw, hh);
    topY = cy - radius;
    bottomY = cy + radius;
    leftX = cx - radius;
    rightX = cx + radius;
  } else if (shape === "oval") {
    leftX = cx - (hw + 4);
    rightX = cx + (hw + 4);
  }

  return {
    top: { x: cx, y: topY, side: "top" },
    bottom: { x: cx, y: bottomY, side: "bottom" },
    left: { x: leftX, y: cy, side: "left" },
    right: { x: rightX, y: cy, side: "right" },
  };
}

/**
 * Mendapatkan vektor normal (arah keluar) dari masing-masing sisi anchor
 */
export function getAnchorNormal(side: AnchorSide): { nx: number; ny: number } {
  switch (side) {
    case "top":
      return { nx: 0, ny: -1 };
    case "bottom":
      return { nx: 0, ny: 1 };
    case "left":
      return { nx: -1, ny: 0 };
    case "right":
      return { nx: 1, ny: 0 };
  }
}
