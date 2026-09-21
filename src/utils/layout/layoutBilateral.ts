import { MindMapNode } from "../../types";
import {
  PositionedNode,
  BASE_ROOT_WIDTH,
  BASE_NODE_WIDTH,
  getNodeRenderSize,
} from "./types";
import { getSubtreeHeight } from "./treeMetrics";

// --------------------------------------------------
// BILATERAL BRACKET LAYOUT (Tidy Left & Right Trees)
// --------------------------------------------------
export function layoutBilateralBracket(
  node: MindMapNode,
  centerX: number,
  centerY: number,
  nodes: PositionedNode[]
) {
  const rootSize = getNodeRenderSize(node, true);
  const rootPos: PositionedNode = {
    node,
    x: centerX,
    y: centerY,
    width: rootSize.width,
    height: rootSize.height,
    depth: 0,
    branchIndex: 0,
    children: [],
  };
  nodes.push(rootPos);

  if (!node.children || node.children.length === 0 || node.collapsed) return;

  const branches = node.children;
  const leftBranches: { branch: MindMapNode; bIdx: number }[] = [];
  const rightBranches: { branch: MindMapNode; bIdx: number }[] = [];

  branches.forEach((branch, bIdx) => {
    if (bIdx % 2 === 0) rightBranches.push({ branch, bIdx });
    else leftBranches.push({ branch, bIdx });
  });

  function layoutSideSubtree(
    pNode: PositionedNode,
    startY: number,
    isLeft: boolean
  ) {
    if (!pNode.node.children || pNode.node.children.length === 0 || pNode.node.collapsed) return;

    let yOffset = startY;
    const sideDir = isLeft ? -1 : 1;

    pNode.node.children.forEach((child) => {
      const childSubtreeHeight = getSubtreeHeight(child, 32);
      const childY = yOffset + childSubtreeHeight / 2;
      const childSize = getNodeRenderSize(child, false);

      // Stable base step distance between column centers
      const stepX = BASE_NODE_WIDTH + 55;
      const childX = pNode.x + sideDir * stepX;

      const childPos: PositionedNode = {
        node: child,
        x: childX,
        y: childY,
        width: childSize.width,
        height: childSize.height,
        depth: pNode.depth + 1,
        branchIndex: pNode.branchIndex,
        parent: pNode,
        isLeftBranch: isLeft,
        children: [],
      };

      pNode.children.push(childPos);
      nodes.push(childPos);

      layoutSideSubtree(childPos, yOffset, isLeft);

      yOffset += childSubtreeHeight;
    });
  }

  function layoutSide(
    sideItems: { branch: MindMapNode; bIdx: number }[],
    isLeft: boolean
  ) {
    let totalHeight = 0;
    sideItems.forEach(({ branch }) => {
      totalHeight += getSubtreeHeight(branch, 32);
    });

    let currentY = centerY - totalHeight / 2;
    const sideDirection = isLeft ? -1 : 1;

    sideItems.forEach(({ branch, bIdx }) => {
      const branchHeight = getSubtreeHeight(branch, 32);
      const branchMidY = currentY + branchHeight / 2;

      const bSize = getNodeRenderSize(branch, false);
      // Stable base step from root to branch
      const stepX = BASE_ROOT_WIDTH / 2 + 65 + BASE_NODE_WIDTH / 2;
      const bx = centerX + sideDirection * stepX;

      const branchPos: PositionedNode = {
        node: branch,
        x: bx,
        y: branchMidY,
        width: bSize.width,
        height: bSize.height,
        depth: 1,
        branchIndex: bIdx,
        parent: rootPos,
        isLeftBranch: isLeft,
        children: [],
      };
      rootPos.children.push(branchPos);
      nodes.push(branchPos);

      layoutSideSubtree(branchPos, currentY, isLeft);

      currentY += branchHeight;
    });
  }

  layoutSide(rightBranches, false);
  layoutSide(leftBranches, true);
}
