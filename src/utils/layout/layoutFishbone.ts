import { MindMapNode } from "../../types";
import { PositionedNode, getNodeRenderSize } from "./types";

// --------------------------------------------------
// FISHBONE (ISHIKAWA) LAYOUT
// --------------------------------------------------
export function layoutFishbone(
  node: MindMapNode,
  startX: number,
  centerY: number,
  nodes: PositionedNode[]
) {
  const rootSize = getNodeRenderSize(node, true);
  const branches = node.children || [];
  const totalPairs = Math.ceil(branches.length / 2);

  const maxLeaves = Math.max(
    0,
    ...branches.map((b) => (b.children ? b.children.length : 0))
  );

  const spineSpacing = Math.max(300, 220 + maxLeaves * 45);

  const rootPos: PositionedNode = {
    node,
    x: startX + Math.max(450, totalPairs * spineSpacing + 120), // Fish head on right
    y: centerY,
    width: rootSize.width,
    height: rootSize.height,
    depth: 0,
    branchIndex: 0,
    children: [],
  };
  nodes.push(rootPos);

  if (!branches || branches.length === 0 || node.collapsed) return;

  const spineStart = startX;

  function layoutFishSubtree(
    pNode: PositionedNode,
    isTop: boolean,
    directionX: number
  ) {
    if (!pNode.node.children || pNode.node.children.length === 0 || pNode.node.collapsed) return;

    pNode.node.children.forEach((child, cIdx) => {
      const cSize = getNodeRenderSize(child, false);
      const cx = pNode.x + directionX * (cIdx + 1) * 42;
      const cy = isTop
        ? pNode.y - (cIdx + 1) * 48
        : pNode.y + (cIdx + 1) * 48;

      const childPos: PositionedNode = {
        node: child,
        x: cx,
        y: cy,
        width: cSize.width,
        height: cSize.height,
        depth: pNode.depth + 1,
        branchIndex: pNode.branchIndex,
        parent: pNode,
        children: [],
      };

      pNode.children.push(childPos);
      nodes.push(childPos);

      layoutFishSubtree(childPos, isTop, directionX);
    });
  }

  branches.forEach((branch, bIdx) => {
    const isTop = bIdx % 2 === 0;
    const pairIndex = Math.floor(bIdx / 2);
    const bx = spineStart + pairIndex * spineSpacing;
    const by = isTop ? centerY - 190 : centerY + 190;

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

    layoutFishSubtree(branchPos, isTop, 1);
  });
}
