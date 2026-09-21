import { MindMapNode } from "../../types";
import {
  PositionedNode,
  BASE_ROOT_WIDTH,
  BASE_NODE_WIDTH,
  getNodeRenderSize,
} from "./types";

// --------------------------------------------------
// BUBBLE CLUSTER LAYOUT (Gravitational Orbit & Satellite Clusters)
// --------------------------------------------------
export function layoutBubbleCluster(
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

  function getClusterFootprintRadius(n: MindMapNode): number {
    if (!n.children || n.children.length === 0 || n.collapsed) {
      return BASE_NODE_WIDTH / 2 + 35;
    }
    const childCount = n.children.length;
    let maxChildRadius = 0;
    n.children.forEach((c) => {
      maxChildRadius = Math.max(maxChildRadius, getClusterFootprintRadius(c));
    });
    // Arc length needed for children to prevent lateral overlap
    const neededCircumference = childCount * (BASE_NODE_WIDTH + 45);
    const orbitR = Math.max(200, neededCircumference / (1.5 * Math.PI));
    return orbitR + maxChildRadius + 40;
  }

  function layoutClusterSubtree(
    pNode: PositionedNode,
    parentAngle: number,
    depthRadius: number
  ) {
    if (!pNode.node.children || pNode.node.children.length === 0 || pNode.node.collapsed) return;

    const children = pNode.node.children;
    const count = children.length;

    // Minimum angular span to guarantee chord distance >= node width + margin
    const minAngleStep = 2 * Math.asin(Math.min(0.85, 115 / depthRadius));
    const neededSpan = Math.max(0.65, (count - 1) * minAngleStep);
    // Angular fan opening away from parent center
    const arcSpan = Math.min(Math.PI * 1.75, Math.max(0.8, neededSpan));
    const startAngle = count > 1 ? parentAngle - arcSpan / 2 : parentAngle;
    const angleStep = count > 1 ? arcSpan / (count - 1) : 0;

    children.forEach((child, cIdx) => {
      const childAngle = count > 1 ? startAngle + cIdx * angleStep : parentAngle;
      const cSize = getNodeRenderSize(child, false);

      // Stagger radius slightly if crowded to give breathing room
      const radialOffset = count > 4 ? (cIdx % 2 === 1 ? 40 : 0) : 0;
      const currentRadius = depthRadius + radialOffset;

      const cx = pNode.x + Math.cos(childAngle) * currentRadius;
      const cy = pNode.y + Math.sin(childAngle) * currentRadius;

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

      // Recursive step for deeper sub-nodes
      const childFootprint = getClusterFootprintRadius(child);
      const childChildrenCount = child.children?.length || 0;
      const nextNeededCircumference = childChildrenCount * (BASE_NODE_WIDTH + 45);
      const nextDepthRadius = Math.max(
        BASE_NODE_WIDTH + 70,
        nextNeededCircumference / (1.5 * Math.PI) + 40,
        childFootprint * 0.45 + 50
      );
      layoutClusterSubtree(childPos, childAngle, nextDepthRadius);
    });
  }

  const branches = node.children;
  const branchFootprints = branches.map((b) => getClusterFootprintRadius(b));
  const totalCircumference = branchFootprints.reduce((sum, r) => sum + r * 2 + 80, 0);
  const maxBranchFootprint = Math.max(0, ...branchFootprints);

  // Main orbital ring radius from central root to Level 1 satellite clusters
  const mainOrbitRadius = Math.max(
    360,
    maxBranchFootprint + BASE_ROOT_WIDTH / 2 + 80,
    totalCircumference / (2 * Math.PI)
  );

  let currentAngle = -Math.PI / 2;
  branches.forEach((branch, bIdx) => {
    const footprint = branchFootprints[bIdx];
    const angleSpan = ((footprint * 2 + 80) / totalCircumference) * (2 * Math.PI);
    const branchAngle = currentAngle + angleSpan / 2;
    currentAngle += angleSpan;

    const bx = centerX + Math.cos(branchAngle) * mainOrbitRadius;
    const by = centerY + Math.sin(branchAngle) * mainOrbitRadius;

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

    const childCount = branch.children?.length || 0;
    const neededCircumference = childCount * (BASE_NODE_WIDTH + 45);
    const subRadius = Math.max(
      BASE_NODE_WIDTH + 70,
      neededCircumference / (1.5 * Math.PI) + 50
    );
    layoutClusterSubtree(branchPos, branchAngle, subRadius);
  });
}
