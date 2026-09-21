import { MindMapNode } from "../../types";
import { PositionedNode, BASE_NODE_WIDTH, getNodeRenderSize } from "./types";

// --------------------------------------------------
// RADIAL LAYOUT ALGORITHM (360° Concentric Polar Layout)
// --------------------------------------------------
export function layoutRadial(
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

  function getLeafCount(n: MindMapNode): number {
    if (!n.children || n.children.length === 0 || n.collapsed) return 1;
    return n.children.reduce((sum, child) => sum + getLeafCount(child), 0);
  }

  const rootChildren = node.children;
  const totalLeaves = Math.max(1, getLeafCount(node));

  // Determine initial radius based on base geometry and child count
  const rootRadius = Math.max(
    320,
    Math.min(650, (rootChildren.length * 180 + totalLeaves * 24) / (2 * Math.PI))
  );

  function layoutRadialSubtree(
    pNode: PositionedNode,
    angleStart: number,
    angleEnd: number,
    depthRadius: number
  ) {
    if (!pNode.node.children || pNode.node.children.length === 0 || pNode.node.collapsed) return;

    const children = pNode.node.children;
    const weights = children.map((c) => getLeafCount(c));
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    let currentAngle = angleStart;
    const totalAngleSpan = angleEnd - angleStart;

    children.forEach((child, cIdx) => {
      const weight = weights[cIdx];
      const angleSpan = (weight / totalWeight) * totalAngleSpan;
      const childAngle = currentAngle + angleSpan / 2;
      currentAngle += angleSpan;

      const cSize = getNodeRenderSize(child, false);
      // Concentric position strictly relative to ROOT center (centerX, centerY)
      const cx = centerX + Math.cos(childAngle) * depthRadius;
      const cy = centerY + Math.sin(childAngle) * depthRadius;

      const childPos: PositionedNode = {
        node: child,
        x: cx,
        y: cy,
        width: cSize.width,
        height: cSize.height,
        depth: pNode.depth + 1,
        branchIndex: pNode.depth === 0 ? cIdx : pNode.branchIndex,
        parent: pNode,
        children: [],
      };

      pNode.children.push(childPos);
      nodes.push(childPos);

      // Recursive step for deeper children on next concentric ring with stable base spacing
      const nextDepthRadius = depthRadius + BASE_NODE_WIDTH + 65;
      const childAngleStart = childAngle - angleSpan / 2;
      const childAngleEnd = childAngle + angleSpan / 2;

      layoutRadialSubtree(childPos, childAngleStart, childAngleEnd, nextDepthRadius);
    });
  }

  layoutRadialSubtree(rootPos, -Math.PI / 2, (3 * Math.PI) / 2, rootRadius);
}
