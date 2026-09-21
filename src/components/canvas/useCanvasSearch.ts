import { useState, useMemo } from "react";
import {
  MindMapNode,
  MindMapLayout,
  ConnectorStyle,
  CustomConnection,
  NodeShape,
} from "../../types";
import {
  computeMindMapPositions,
  PositionedNode,
  NodeLink,
  LayoutBounds,
} from "../../utils/mindmapLayout";
import { checkNodeSearchMatch } from "../../utils/searchHelper";

interface CanvasSearchAndLayout {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hoveredNodeId: string | null;
  setHoveredNodeId: (id: string | null) => void;
  pinnedNodeId: string | null;
  setPinnedNodeId: (id: string | null) => void;
  nodes: PositionedNode[];
  links: NodeLink[];
  bounds: LayoutBounds;
  matchingNodeIds: Set<string>;
  searchRouteLinkIds: Set<string>;
  searchRouteNodeIds: Set<string>;
  relatedNodeIds: Set<string>;
  isSearchActive: boolean;
  matchCount: number;
}

export function useCanvasSearch(
  rootNode: MindMapNode,
  layout: MindMapLayout,
  connectorStyle: ConnectorStyle,
  additionalRoots?: MindMapNode[],
  connections?: CustomConnection[],
  nodeShape: NodeShape | string = "rounded"
): CanvasSearchAndLayout {
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [pinnedNodeId, setPinnedNodeId] = useState<string | null>(null);

  // Auto-expand any collapsed ancestors if they have matching descendants during active search
  const effectiveRoot = useMemo(() => {
    const clean = searchQuery.trim().toLowerCase();
    if (!clean) return rootNode;

    function expandMatchingPath(n: MindMapNode): MindMapNode {
      const res = checkNodeSearchMatch(n, clean);
      const shouldUncollapse = res.hasMatchingDescendants;

      const children = n.children
        ? n.children.map(expandMatchingPath)
        : undefined;

      return {
        ...n,
        collapsed: shouldUncollapse ? false : n.collapsed,
        children,
      };
    }

    return expandMatchingPath(rootNode);
  }, [rootNode, searchQuery]);

  const effectiveAdditionalRoots = useMemo(() => {
    const clean = searchQuery.trim().toLowerCase();
    if (!clean || !additionalRoots) return additionalRoots;

    function expandMatchingPath(n: MindMapNode): MindMapNode {
      const res = checkNodeSearchMatch(n, clean);
      const shouldUncollapse = res.hasMatchingDescendants;

      const children = n.children
        ? n.children.map(expandMatchingPath)
        : undefined;

      return {
        ...n,
        collapsed: shouldUncollapse ? false : n.collapsed,
        children,
      };
    }

    return additionalRoots.map(expandMatchingPath);
  }, [additionalRoots, searchQuery]);

  // Compute Layout Positions based on effective roots and layout settings
  const { nodes, links, bounds } = useMemo(() => {
    return computeMindMapPositions(
      effectiveRoot,
      layout,
      connectorStyle,
      effectiveAdditionalRoots,
      connections,
      nodeShape
    );
  }, [effectiveRoot, layout, connectorStyle, effectiveAdditionalRoots, connections, nodeShape]);

  // Set of matching node IDs for search query
  const matchingNodeIds = useMemo(() => {
    const ids = new Set<string>();
    const clean = searchQuery.trim().toLowerCase();
    if (!clean) return ids;

    nodes.forEach((pn) => {
      const res = checkNodeSearchMatch(pn.node, clean);
      if (res.isMatch || (res.hasMatchingDescendants && pn.node.collapsed)) {
        ids.add(pn.node.id);
      }
    });

    return ids;
  }, [nodes, searchQuery]);

  // Fast O(1) lookup Map for positioned nodes
  const nodesMap = useMemo(() => {
    const map = new Map<string, PositionedNode>();
    nodes.forEach((n) => map.set(n.node.id, n));
    return map;
  }, [nodes]);

  // Find all link IDs and node IDs on route hierarchy down to matching nodes
  const { searchRouteLinkIds, searchRouteNodeIds } = useMemo(() => {
    const linkIds = new Set<string>();
    const nodeIds = new Set<string>();
    const clean = searchQuery.trim().toLowerCase();
    if (!clean || matchingNodeIds.size === 0) {
      return { searchRouteLinkIds: linkIds, searchRouteNodeIds: nodeIds };
    }

    matchingNodeIds.forEach((targetId) => {
      let current = nodesMap.get(targetId);
      while (current) {
        nodeIds.add(current.node.id);
        if (current.parent) {
          const parentId = current.parent.node.id;
          const childId = current.node.id;
          linkIds.add(`${parentId}->${childId}`);
        }
        current = current.parent;
      }
    });

    return { searchRouteLinkIds: linkIds, searchRouteNodeIds: nodeIds };
  }, [nodesMap, matchingNodeIds, searchQuery]);

  // Find ancestors and descendants of currently hovered node
  const relatedNodeIds = useMemo(() => {
    const ids = new Set<string>();
    if (!hoveredNodeId) return ids;

    ids.add(hoveredNodeId);

    let current: PositionedNode | undefined = nodesMap.get(hoveredNodeId);
    const targetNode = current;
    while (current) {
      ids.add(current.node.id);
      current = current.parent;
    }

    if (targetNode) {
      const addDescendants = (pn: PositionedNode) => {
        ids.add(pn.node.id);
        if (pn.children) {
          pn.children.forEach(addDescendants);
        }
      };
      addDescendants(targetNode);
    }

    return ids;
  }, [nodesMap, hoveredNodeId]);

  const isSearchActive = searchQuery.trim().length > 0;
  const matchCount = matchingNodeIds.size;

  return {
    searchQuery,
    setSearchQuery,
    hoveredNodeId,
    setHoveredNodeId,
    pinnedNodeId,
    setPinnedNodeId,
    nodes,
    links,
    bounds,
    matchingNodeIds,
    searchRouteLinkIds,
    searchRouteNodeIds,
    relatedNodeIds,
    isSearchActive,
    matchCount,
  };
}
