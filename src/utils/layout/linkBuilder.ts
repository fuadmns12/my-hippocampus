import { MindMapNode, MindMapLayout, ConnectorStyle, CustomConnection, NodeShape } from "../../types";
import { PositionedNode, NodeLink, LayoutBounds } from "./types";
import { selectOptimal4PointPair } from "./anchorSelector";
import { buildPathBetweenAnchors } from "./pathGenerators";

/**
 * Creates parent-child hierarchical links and multi-anchor custom connection links
 */
export function buildLayoutLinks(
  nodes: PositionedNode[],
  layout: MindMapLayout,
  connectorStyle: ConnectorStyle,
  nodeShape: NodeShape | string,
  customConnections?: CustomConnection[]
): NodeLink[] {
  const links: NodeLink[] = [];
  const renderedNodePairs = new Set<string>();

  // 1. Create links between parents and children
  function createLinks(pNode: PositionedNode) {
    if (pNode.node.collapsed) return;
    pNode.children.forEach((child) => {
      const pairKey = [pNode.node.id, child.node.id].sort().join("::");
      if (!renderedNodePairs.has(pairKey) && pNode.node.id !== child.node.id) {
        renderedNodePairs.add(pairKey);
        const { sourceAnchor, targetAnchor } = selectOptimal4PointPair(
          pNode,
          child,
          layout,
          nodeShape,
          false,
          child.node.sourceAnchorSide,
          child.node.targetAnchorSide
        );
        const pathD = buildPathBetweenAnchors(sourceAnchor, targetAnchor, connectorStyle);
        links.push({
          id: `${pNode.node.id}->${child.node.id}`,
          source: pNode,
          target: child,
          branchIndex: child.branchIndex,
          pathD,
          sourceAnchorSide: sourceAnchor.side,
          targetAnchorSide: targetAnchor.side,
        });
      }
      createLinks(child);
    });
  }

  nodes.forEach((n) => {
    // Only call createLinks on root nodes to traverse each tree
    if (n.depth === 0) {
      createLinks(n);
    }
  });

  // 2. Create links for multi-anchor custom connections (strictly prevent duplicate lines)
  if (customConnections && customConnections.length > 0) {
    const nodeMap = new Map<string, PositionedNode>();
    nodes.forEach((n) => nodeMap.set(n.node.id, n));

    customConnections.forEach((conn) => {
      if (conn.sourceNodeId === conn.targetNodeId) return;
      const pairKey = [conn.sourceNodeId, conn.targetNodeId].sort().join("::");
      if (renderedNodePairs.has(pairKey)) {
        return;
      }

      const sourceNode = nodeMap.get(conn.sourceNodeId);
      const targetNode = nodeMap.get(conn.targetNodeId);
      if (sourceNode && targetNode) {
        renderedNodePairs.add(pairKey);

        const { sourceAnchor: sAnchor, targetAnchor: tAnchor } = selectOptimal4PointPair(
          sourceNode,
          targetNode,
          layout,
          nodeShape,
          true,
          conn.sourceAnchorSide,
          conn.targetAnchorSide
        );
        const pathD = buildPathBetweenAnchors(sAnchor, tAnchor, conn.style || connectorStyle);

        links.push({
          id: conn.id,
          source: sourceNode,
          target: targetNode,
          branchIndex: targetNode.branchIndex ?? sourceNode.branchIndex ?? 0,
          pathD,
          sourceAnchorSide: sAnchor.side,
          targetAnchorSide: tAnchor.side,
          isCustomConnection: true,
          connectionId: conn.id,
          color: conn.color,
          label: conn.label,
        });
      }
    });
  }

  return links;
}

/**
 * Computes bounding box for layout positioning with padding
 */
export function computeLayoutBounds(nodes: PositionedNode[]): LayoutBounds {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  nodes.forEach((n) => {
    const applyX = n.x + (n.node.xOffset || 0);
    const applyY = n.y + (n.node.yOffset || 0);
    const effectiveW = (n.width || 160) * (n.node.scale || 1.0);
    const effectiveH = (n.height || 46) * (n.node.scale || 1.0);
    minX = Math.min(minX, applyX - effectiveW / 2 - 40);
    maxX = Math.max(maxX, applyX + effectiveW / 2 + 40);
    minY = Math.min(minY, applyY - effectiveH / 2 - 40);
    maxY = Math.max(maxY, applyY + effectiveH / 2 + 40);
  });

  if (minX === Infinity) {
    minX = 0;
    maxX = 1600;
    minY = 0;
    maxY = 1200;
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: Math.max(1000, maxX - minX),
    height: Math.max(800, maxY - minY),
  };
}
