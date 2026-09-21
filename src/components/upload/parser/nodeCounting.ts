import { MindMapNode, MindMapData } from "../../../types";

/**
 * Hitung jumlah total node pada sebuah cabang pohon MindMapNode secara rekursif
 */
export const countNodes = (node: MindMapNode): number => {
  let count = 1;
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  return count;
};

/**
 * Hitung total seluruh node di dalam sebuah dokumen MindMapData (termasuk additionalRoots jika ada)
 */
export const countTotalMapNodes = (map: MindMapData): number => {
  let total = map.root ? countNodes(map.root) : 0;
  if (map.additionalRoots && map.additionalRoots.length > 0) {
    for (const r of map.additionalRoots) {
      total += countNodes(r);
    }
  }
  return total;
};
