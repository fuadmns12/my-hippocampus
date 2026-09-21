import { MindMapNode } from "../../types";
import { BASE_NODE_HEIGHT, BASE_NODE_WIDTH, PositionedNode } from "./types";

// Helper: Calculate subtree leaf weight (count of leaves or uncollapsed children)
export function getSubtreeWeight(node?: MindMapNode | null, visited = new Set<string>()): number {
  if (!node) return 1;
  if (node.id) {
    if (visited.has(node.id)) return 1;
    visited.add(node.id);
  }
  if (!node.children || !Array.isArray(node.children) || node.children.length === 0 || node.collapsed) {
    return 1;
  }
  return node.children.reduce((acc, c) => acc + (c ? getSubtreeWeight(c, visited) : 0), 0) || 1;
}

// Helper: Calculate total subtree height needed for tidy horizontal tree using stable base dimensions
export function getSubtreeHeight(node?: MindMapNode | null, rowGap = 32, visited = new Set<string>()): number {
  if (!node) return BASE_NODE_HEIGHT + rowGap;
  if (node.id) {
    if (visited.has(node.id)) return BASE_NODE_HEIGHT + rowGap;
    visited.add(node.id);
  }
  if (!node.children || !Array.isArray(node.children) || node.children.length === 0 || node.collapsed) {
    return BASE_NODE_HEIGHT + rowGap;
  }
  const childrenHeight = node.children.reduce(
    (acc, child) => acc + (child ? getSubtreeHeight(child, rowGap, visited) : 0),
    0
  );
  return Math.max(BASE_NODE_HEIGHT + rowGap, childrenHeight);
}

// Helper: Calculate total subtree width needed for tidy vertical tree using stable base dimensions
export function getSubtreeWidth(node?: MindMapNode | null, colGap = 40, visited = new Set<string>()): number {
  if (!node) return BASE_NODE_WIDTH + colGap;
  if (node.id) {
    if (visited.has(node.id)) return BASE_NODE_WIDTH + colGap;
    visited.add(node.id);
  }
  if (!node.children || !Array.isArray(node.children) || node.children.length === 0 || node.collapsed) {
    return BASE_NODE_WIDTH + colGap;
  }
  const childrenWidth = node.children.reduce(
    (acc, child) => acc + (child ? getSubtreeWidth(child, colGap, visited) : 0),
    0
  );
  return Math.max(BASE_NODE_WIDTH + colGap, childrenWidth);
}

// Helper to shift a node and its entire subtree with cycle prevention
export function shiftSubtree(pNode: PositionedNode, dx: number, dy: number, visited = new Set<PositionedNode>()) {
  if (!pNode || visited.has(pNode)) return;
  visited.add(pNode);
  pNode.x += dx;
  pNode.y += dy;
  if (pNode.children && Array.isArray(pNode.children) && pNode.children.length > 0) {
    pNode.children.forEach((child) => shiftSubtree(child, dx, dy, visited));
  }
}

// Helper to check if a and b are in a direct ancestor-descendant relationship along the tree with step limit
export function isAncestorDescendant(a: PositionedNode, b: PositionedNode): boolean {
  if (!a || !b) return false;
  let curr: PositionedNode | undefined = b.parent;
  let steps = 0;
  while (curr && steps < 500) {
    if (curr === a) return true;
    curr = curr.parent;
    steps++;
  }
  curr = a.parent;
  steps = 0;
  while (curr && steps < 500) {
    if (curr === b) return true;
    curr = curr.parent;
    steps++;
  }
  return false;
}
