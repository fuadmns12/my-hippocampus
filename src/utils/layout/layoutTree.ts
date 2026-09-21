import { MindMapNode } from "../../types";
import {
  PositionedNode,
  BASE_ROOT_WIDTH,
  BASE_ROOT_HEIGHT,
  BASE_NODE_WIDTH,
  BASE_NODE_HEIGHT,
  getNodeRenderSize,
} from "./types";
import { getSubtreeHeight, getSubtreeWidth } from "./treeMetrics";

// --------------------------------------------------
// HORIZONTAL TREE LAYOUT (Tidy Recursive Height Layout)
// --------------------------------------------------
export function layoutHorizontalTree(
  node: MindMapNode,
  startX: number,
  centerY: number,
  nodes: PositionedNode[]
) {
  const rootSize = getNodeRenderSize(node, true);
  const rootPos: PositionedNode = {
    node,
    x: startX,
    y: centerY,
    width: rootSize.width,
    height: rootSize.height,
    depth: 0,
    branchIndex: 0,
    children: [],
  };
  nodes.push(rootPos);

  if (!node.children || node.children.length === 0 || node.collapsed) return;

  function layoutSubtree(pNode: PositionedNode, startY: number) {
    if (!pNode.node.children || pNode.node.children.length === 0 || pNode.node.collapsed) return;

    let yOffset = startY;

    pNode.node.children.forEach((child, cIdx) => {
      const childSubtreeHeight = getSubtreeHeight(child, 32);
      const childY = yOffset + childSubtreeHeight / 2;
      const childSize = getNodeRenderSize(child, false);

      // Stable base step distance between column centers so sub-nodes don't move when parent is resized
      const stepX =
        pNode.depth === 0
          ? BASE_ROOT_WIDTH / 2 + 55 + BASE_NODE_WIDTH / 2
          : BASE_NODE_WIDTH + 55;
      const childX = pNode.x + stepX;

      const childPos: PositionedNode = {
        node: child,
        x: childX,
        y: childY,
        width: childSize.width,
        height: childSize.height,
        depth: pNode.depth + 1,
        branchIndex: pNode.depth === 0 ? cIdx : pNode.branchIndex,
        parent: pNode,
        children: [],
      };

      pNode.children.push(childPos);
      nodes.push(childPos);

      // Recursive call for sub-children
      layoutSubtree(childPos, yOffset);

      yOffset += childSubtreeHeight;
    });
  }

  const totalHeight = getSubtreeHeight(node, 32);
  const startY = centerY - totalHeight / 2;
  layoutSubtree(rootPos, startY);
}

// --------------------------------------------------
// VERTICAL TREE LAYOUT (Tidy Top-Down Subtree Width)
// --------------------------------------------------
export function layoutVerticalTree(
  node: MindMapNode,
  centerX: number,
  startY: number,
  nodes: PositionedNode[]
) {
  const rootSize = getNodeRenderSize(node, true);
  const rootPos: PositionedNode = {
    node,
    x: centerX,
    y: startY,
    width: rootSize.width,
    height: rootSize.height,
    depth: 0,
    branchIndex: 0,
    children: [],
  };
  nodes.push(rootPos);

  if (!node.children || node.children.length === 0 || node.collapsed) return;

  function layoutSubtree(pNode: PositionedNode, startX: number) {
    if (!pNode.node.children || pNode.node.children.length === 0 || pNode.node.collapsed) return;

    let xOffset = startX;

    pNode.node.children.forEach((child, cIdx) => {
      const childSubtreeWidth = getSubtreeWidth(child, 40);
      const childX = xOffset + childSubtreeWidth / 2;
      const childSize = getNodeRenderSize(child, false);

      // Stable base step distance between row centers
      const stepY =
        pNode.depth === 0
          ? BASE_ROOT_HEIGHT / 2 + 50 + BASE_NODE_HEIGHT / 2
          : BASE_NODE_HEIGHT + 50;
      const childY = pNode.y + stepY;

      const childPos: PositionedNode = {
        node: child,
        x: childX,
        y: childY,
        width: childSize.width,
        height: childSize.height,
        depth: pNode.depth + 1,
        branchIndex: pNode.depth === 0 ? cIdx : pNode.branchIndex,
        parent: pNode,
        children: [],
      };

      pNode.children.push(childPos);
      nodes.push(childPos);

      // Recursive call
      layoutSubtree(childPos, xOffset);

      xOffset += childSubtreeWidth;
    });
  }

  const totalWidth = getSubtreeWidth(node, 40);
  const leftX = centerX - totalWidth / 2;
  layoutSubtree(rootPos, leftX);
}
