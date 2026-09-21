import { MindMapNode, MindMapLayout, ConnectorStyle, CustomConnection, NodeShape } from "../types";
import {
  PositionedNode,
  NodeLink,
  LayoutBounds,
  BASE_ROOT_WIDTH,
  BASE_ROOT_HEIGHT,
  BASE_NODE_WIDTH,
  BASE_NODE_HEIGHT,
  MIN_NODE_SEPARATION_PADDING_X,
  MIN_NODE_SEPARATION_PADDING_Y,
  MIN_NODE_SEPARATION,
  getBaseNodeSize,
  getNodeRenderSize,
  getNodeSize,
} from "./layout/types";
import {
  resolveNodeOverlaps,
  resolveSiblingOverlaps,
} from "./layout/overlapResolver";
import {
  buildSvgPath,
  selectOptimal4PointPair,
  getNode4Anchors,
  getAnchorNormal,
  buildPathBetweenAnchors,
  buildPathToFreePointer,
  getPathMidpoint,
  AnchorSide,
  AnchorPoint,
} from "./layout/pathBuilder";
import { layoutRadial } from "./layout/layoutRadial";
import { layoutHorizontalTree, layoutVerticalTree } from "./layout/layoutTree";
import { layoutFishbone } from "./layout/layoutFishbone";
import { layoutBubbleCluster } from "./layout/layoutBubble";
import { layoutBilateralBracket } from "./layout/layoutBilateral";
import { layoutGridNetwork } from "./layout/layoutGrid";
import { buildLayoutLinks, computeLayoutBounds } from "./layout/linkBuilder";

// Re-export all types, constants, and helpers for backward compatibility
export type { PositionedNode, NodeLink, LayoutBounds, AnchorSide, AnchorPoint };
export {
  BASE_ROOT_WIDTH,
  BASE_ROOT_HEIGHT,
  BASE_NODE_WIDTH,
  BASE_NODE_HEIGHT,
  MIN_NODE_SEPARATION_PADDING_X,
  MIN_NODE_SEPARATION_PADDING_Y,
  MIN_NODE_SEPARATION,
  getBaseNodeSize,
  getNodeRenderSize,
  getNodeSize,
  resolveNodeOverlaps,
  resolveSiblingOverlaps,
  buildSvgPath,
  selectOptimal4PointPair,
  getNode4Anchors,
  getAnchorNormal,
  buildPathBetweenAnchors,
  buildPathToFreePointer,
  getPathMidpoint,
};

export function computeMindMapPositions(
  root: MindMapNode,
  layout: MindMapLayout,
  connectorStyle: ConnectorStyle = "bezier",
  additionalRoots?: MindMapNode[],
  customConnections?: CustomConnection[],
  nodeShape: NodeShape | string = "rounded"
): { nodes: PositionedNode[]; links: NodeLink[]; bounds: LayoutBounds } {
  const nodes: PositionedNode[] = [];

  // Fallback fallback if root is missing or null
  const safeRoot: MindMapNode = root && typeof root === "object" ? root : {
    id: "fallback-root",
    label: "Root Node",
    children: [],
  };

  // Ensure root has an id and children array
  if (!safeRoot.id) safeRoot.id = "root";
  if (!Array.isArray(safeRoot.children)) safeRoot.children = [];

  const validAdditionalRoots = Array.isArray(additionalRoots)
    ? additionalRoots.filter((r): r is MindMapNode => Boolean(r && typeof r === "object"))
    : [];

  const allRoots = [safeRoot, ...validAdditionalRoots];

  allRoots.forEach((currentRoot, rootIndex) => {
    // Ensure currentRoot has an id and array of children
    if (!currentRoot.id) currentRoot.id = `root-${rootIndex}`;
    if (!Array.isArray(currentRoot.children)) currentRoot.children = [];

    const treeNodes: PositionedNode[] = [];

    let baseCenterX = 800;
    let baseCenterY = 600;

    if (layout === "horizontal-tree" || layout === "fishbone") {
      baseCenterX = 150;
      baseCenterY = 600;
    } else if (layout === "vertical-tree") {
      baseCenterX = 800;
      baseCenterY = 100;
    }

    // Default spacing if root has never been dragged yet
    let defaultOffsetX = 0;
    let defaultOffsetY = 0;
    if (rootIndex > 0 && currentRoot.xOffset === undefined && currentRoot.yOffset === undefined) {
      if (layout === "vertical-tree") {
        defaultOffsetX = rootIndex * 850;
        defaultOffsetY = 0;
      } else if (layout === "horizontal-tree" || layout === "fishbone") {
        defaultOffsetX = 0;
        defaultOffsetY = rootIndex * 700;
      } else {
        defaultOffsetX = rootIndex * 950;
        defaultOffsetY = 0;
      }
    }

    const rootOffsetX = currentRoot.xOffset !== undefined ? currentRoot.xOffset : defaultOffsetX;
    const rootOffsetY = currentRoot.yOffset !== undefined ? currentRoot.yOffset : defaultOffsetY;

    const centerX = baseCenterX + rootOffsetX;
    const centerY = baseCenterY + rootOffsetY;

    // Normalize currentRoot structure defensively
    if (!currentRoot.label && currentRoot.label !== "") currentRoot.label = "Topik";
    if (currentRoot.collapsed === undefined) currentRoot.collapsed = false;

    // 1. Recursive positioning helpers depending on layout strategy (wrapped defensively)
    try {
      switch (layout) {
        case "radial":
          layoutRadial(currentRoot, centerX, centerY, treeNodes);
          break;
        case "horizontal-tree":
          layoutHorizontalTree(currentRoot, centerX, centerY, treeNodes);
          break;
        case "vertical-tree":
          layoutVerticalTree(currentRoot, centerX, centerY, treeNodes);
          break;
        case "fishbone":
          layoutFishbone(currentRoot, centerX, centerY, treeNodes);
          break;
        case "bubble-cluster":
          layoutBubbleCluster(currentRoot, centerX, centerY, treeNodes);
          break;
        case "bilateral-bracket":
          layoutBilateralBracket(currentRoot, centerX, centerY, treeNodes);
          break;
        case "grid-network":
          layoutGridNetwork(currentRoot, centerX, centerY, treeNodes);
          break;
        default:
          layoutRadial(currentRoot, centerX, centerY, treeNodes);
          break;
      }
    } catch (err) {
      console.warn("Layout computation encountered unexpected node structure, applying fallback:", err);
      if (treeNodes.length === 0) {
        // Fallback root positioned node if layout algorithm threw
        const rootSize = getNodeRenderSize(currentRoot, true);
        treeNodes.push({
          node: currentRoot,
          x: centerX,
          y: centerY,
          width: rootSize.width,
          height: rootSize.height,
          depth: 0,
          branchIndex: 0,
          children: [],
        });
      }
    }

    // Assign shape, root ID, and tree index to each positioned node
    treeNodes.forEach((n) => {
      n.shape = nodeShape;
      n.rootId = currentRoot.id;
      n.treeIndex = rootIndex;
    });

    // 2. Resolve dynamic sibling padding & spacing for this tree (defensively guarded)
    try {
      const rootPosNode = treeNodes.find((n) => n.node && n.node.id === currentRoot.id);
      if (rootPosNode) {
        resolveSiblingOverlaps(rootPosNode, layout);
        // Anchor rootPosNode.x to baseCenterX so that applyX (rootPosNode.x + root.xOffset) equals centerX
        rootPosNode.x = baseCenterX;
        rootPosNode.y = baseCenterY;
        if (currentRoot.xOffset === undefined && defaultOffsetX !== 0) {
          currentRoot.xOffset = defaultOffsetX;
        }
        if (currentRoot.yOffset === undefined && defaultOffsetY !== 0) {
          currentRoot.yOffset = defaultOffsetY;
        }
      }

      // 3. Resolve spatial overlaps within this tree
      resolveNodeOverlaps(treeNodes, layout);
    } catch (overlapErr) {
      console.warn("Warning resolving overlaps:", overlapErr);
    }

    nodes.push(...treeNodes);
  });

  // 4. Create links between parents and children + multi-anchor custom connections
  let links: NodeLink[] = [];
  try {
    links = buildLayoutLinks(nodes, layout, connectorStyle, nodeShape, customConnections);
  } catch (linkErr) {
    console.warn("Warning building layout links:", linkErr);
  }

  // 5. Compute layout bounding box with padding
  let bounds: LayoutBounds = { minX: 0, maxX: 1600, minY: 0, maxY: 1200, width: 1600, height: 1200 };
  try {
    bounds = computeLayoutBounds(nodes);
  } catch (boundsErr) {
    console.warn("Warning computing layout bounds:", boundsErr);
  }

  return { nodes, links, bounds };
}
