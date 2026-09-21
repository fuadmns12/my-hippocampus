import { MindMapNode } from "../../types";
import {
  PositionedNode,
  BASE_NODE_WIDTH,
  BASE_NODE_HEIGHT,
  getNodeRenderSize,
} from "./types";

// --------------------------------------------------
// GRID NETWORK LAYOUT (Matrix Table Layout)
// --------------------------------------------------
export function getGridSubtreeHeight(node: MindMapNode): number {
  if (!node.children || node.children.length === 0 || node.collapsed) {
    return BASE_NODE_HEIGHT;
  }
  let childrenSum = 0;
  node.children.forEach((child) => {
    childrenSum += getGridSubtreeHeight(child) + 16;
  });
  return BASE_NODE_HEIGHT + 24 + childrenSum;
}

export function getGridSubtreeWidth(node: MindMapNode): number {
  if (!node.children || node.children.length === 0 || node.collapsed) {
    return BASE_NODE_WIDTH;
  }
  let maxChildWidth = BASE_NODE_WIDTH;
  node.children.forEach((child) => {
    maxChildWidth = Math.max(maxChildWidth, getGridSubtreeWidth(child));
  });
  return maxChildWidth;
}

// Helper function to calculate maximum cell width and height of the root's children for Grid coordinate assignment
export function getMaxGridCellDimensions(branches: MindMapNode[]): {
  maxCellWidth: number;
  maxCellHeight: number;
} {
  let maxCellWidth = 240;
  let maxCellHeight = 160;

  branches.forEach((branch) => {
    const w = getGridSubtreeWidth(branch);
    const h = getGridSubtreeHeight(branch);
    if (w > maxCellWidth) maxCellWidth = w;
    if (h > maxCellHeight) maxCellHeight = h;
  });

  return { maxCellWidth, maxCellHeight };
}

export function layoutGridNetwork(
  node: MindMapNode,
  centerX: number,
  centerY: number,
  nodes: PositionedNode[]
) {
  const rootSize = getNodeRenderSize(node, true);
  const rootPos: PositionedNode = {
    node,
    x: centerX,
    y: centerY - 120,
    width: rootSize.width,
    height: rootSize.height,
    depth: 0,
    branchIndex: 0,
    children: [],
  };
  nodes.push(rootPos);

  if (!node.children || node.children.length === 0 || node.collapsed) return;

  const branches = node.children;
  const cols = Math.min(3, Math.ceil(Math.sqrt(branches.length)));
  const rows = Math.ceil(branches.length / cols);

  const { maxCellWidth, maxCellHeight } = getMaxGridCellDimensions(branches);

  const colWidths: number[] = new Array(cols).fill(maxCellWidth);
  const rowHeights: number[] = new Array(rows).fill(maxCellHeight);

  branches.forEach((branch, bIdx) => {
    const c = bIdx % cols;
    const r = Math.floor(bIdx / cols);
    colWidths[c] = Math.max(colWidths[c], getGridSubtreeWidth(branch));
    rowHeights[r] = Math.max(rowHeights[r], getGridSubtreeHeight(branch));
  });

  const colGap = 70;
  let totalGridWidth = 0;
  for (let c = 0; c < cols; c++) {
    totalGridWidth += colWidths[c];
  }
  totalGridWidth += (cols - 1) * colGap;

  const startGridX = centerX - totalGridWidth / 2;
  const colCenterXs: number[] = [];
  let currX = startGridX;
  for (let c = 0; c < cols; c++) {
    colCenterXs[c] = currX + colWidths[c] / 2;
    currX += colWidths[c] + colGap;
  }

  const rowGap = 80;
  const startGridY = centerY + 80;
  const rowTopYs: number[] = [];
  let currY = startGridY;
  for (let r = 0; r < rows; r++) {
    rowTopYs[r] = currY;
    currY += rowHeights[r] + rowGap;
  }

  function layoutGridSubtreeBranch(
    pNode: PositionedNode,
    bCenterX: number,
    startY: number
  ) {
    if (!pNode.node.children || pNode.node.children.length === 0 || pNode.node.collapsed) return;

    let currentY = startY;
    pNode.node.children.forEach((child) => {
      const cSize = getNodeRenderSize(child, false);
      const childY = currentY + BASE_NODE_HEIGHT / 2;

      const childPos: PositionedNode = {
        node: child,
        x: bCenterX,
        y: childY,
        width: cSize.width,
        height: cSize.height,
        depth: pNode.depth + 1,
        branchIndex: pNode.branchIndex,
        parent: pNode,
        children: [],
      };

      pNode.children.push(childPos);
      nodes.push(childPos);

      currentY += BASE_NODE_HEIGHT + 20;

      if (child.children && child.children.length > 0 && !child.collapsed) {
        layoutGridSubtreeBranch(childPos, bCenterX, currentY);
        let subHeight = 0;
        child.children.forEach((sc) => {
          subHeight += getGridSubtreeHeight(sc) + 16;
        });
        currentY += subHeight;
      }
    });
  }

  branches.forEach((branch, bIdx) => {
    const c = bIdx % cols;
    const r = Math.floor(bIdx / cols);
    const bx = colCenterXs[c];
    const by = rowTopYs[r] + BASE_NODE_HEIGHT / 2;

    const bSize = getNodeRenderSize(branch, false);
    const branchPos: PositionedNode = {
      node: branch,
      x: bx,
      y: by,
      width: bSize.width,
      height: bSize.height,
      depth: 1,
      branchIndex: bIdx,
      parent: rootPos,
      children: [],
    };
    rootPos.children.push(branchPos);
    nodes.push(branchPos);

    layoutGridSubtreeBranch(branchPos, bx, by + BASE_NODE_HEIGHT / 2 + 24);
  });
}
