import { MindMapNode, NodeShape } from "../../types";

export interface PositionedNode {
  node: MindMapNode;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  branchIndex: number;
  parent?: PositionedNode;
  children: PositionedNode[];
  isLeftBranch?: boolean;
  shape?: NodeShape | string;
  rootId?: string;
  treeIndex?: number;
}

export interface NodeLink {
  id: string;
  source: PositionedNode;
  target: PositionedNode;
  branchIndex: number;
  pathD: string;
  sourceAnchorSide?: "top" | "bottom" | "left" | "right";
  targetAnchorSide?: "top" | "bottom" | "left" | "right";
  isCustomConnection?: boolean;
  connectionId?: string;
  color?: string;
  label?: string;
}

export interface LayoutBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
}

export const BASE_ROOT_WIDTH = 210;
export const BASE_ROOT_HEIGHT = 54;
export const BASE_NODE_WIDTH = 175;
export const BASE_NODE_HEIGHT = 46;

export const MIN_NODE_SEPARATION_PADDING_X = 36;
export const MIN_NODE_SEPARATION_PADDING_Y = 28;
export const MIN_NODE_SEPARATION = 32;

// Base structural node dimensions for consistent, stable tree layout grid
export function getBaseNodeSize(node?: MindMapNode | null, isRoot?: boolean, depth: number = isRoot ? 0 : 1) {
  if (isRoot || depth === 0) {
    return {
      width: BASE_ROOT_WIDTH,
      height: BASE_ROOT_HEIGHT,
    };
  }
  // Hierarchical optical weighting based on Tony Buzan Visual Cognition
  const baseWidth = depth === 1 ? 180 : depth === 2 ? 165 : 152;
  const baseHeight = depth === 1 ? 48 : depth === 2 ? 43 : 39;
  return {
    width: baseWidth,
    height: baseHeight,
  };
}

// Rendered node dimensions with custom scale applied for visual box and border connections
export function getNodeRenderSize(node?: MindMapNode | null, isRoot?: boolean, depth: number = isRoot ? 0 : 1) {
  const scale = (node && typeof node.scale === "number" && !isNaN(node.scale) && node.scale > 0)
    ? node.scale
    : 1.0;
  const base = getBaseNodeSize(node, isRoot, depth);
  return {
    width: Math.round(base.width * scale),
    height: Math.round(base.height * scale),
  };
}

// Alias for backwards compatibility
export function getNodeSize(node?: MindMapNode | null, isRoot?: boolean, depth?: number) {
  return getNodeRenderSize(node, isRoot, depth);
}
