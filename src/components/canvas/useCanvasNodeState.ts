import { useState } from "react";
import { checkNodeSearchMatch } from "../../utils/searchHelper";
import { computeNodeItemStyles } from "./nodeItemStyles";
import { PositionedNode } from "../../utils/mindmapLayout";
import { NodeShape } from "../../types";
import { ThemePalette } from "../../utils/colorThemes";
import { AnchorSide } from "./nodeItem";
import { useThemeMode } from "../../context/ThemeModeContext";

interface UseCanvasNodeStateParams {
  posNode: PositionedNode;
  nodeShape: NodeShape | string;
  palette: ThemePalette;
  searchQuery: string;
  hoveredNodeId: string | null;
  isOnSearchRoute?: boolean;
  isRelated?: boolean;
  getBranchStyle: (branchIndex: number) => { link?: string };
  spotlightNodeIds?: Set<string> | null;
}

export const useCanvasNodeState = ({
  posNode,
  nodeShape,
  palette,
  searchQuery,
  hoveredNodeId,
  isOnSearchRoute = false,
  isRelated,
  getBranchStyle,
  spotlightNodeIds,
}: UseCanvasNodeStateParams) => {
  const { node, x, y, width, height, depth, branchIndex } = posNode;
  const applyX = x + (node.xOffset || 0);
  const applyY = y + (node.yOffset || 0);

  const [hoveredAnchorSide, setHoveredAnchorSide] = useState<AnchorSide | null>(null);

  const isRoot = depth === 0;
  const isBranch = depth === 1;
  const bStyle = getBranchStyle(branchIndex);
  const branchRouteColor = bStyle.link || palette.defaultLink || "#38bdf8";
  const hasNotes = Boolean(node.notes && node.notes.length > 0);
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isHovered = hoveredNodeId === node.id;

  const searchResult = checkNodeSearchMatch(node, searchQuery);
  const isSearchActive = searchQuery.trim().length > 0;

  const themeModeCtx = useThemeMode();
  const isLightMode = themeModeCtx?.isLight ?? false;

  const computedStyles = computeNodeItemStyles({
    node,
    width,
    height,
    isRoot,
    isBranch,
    depth,
    palette,
    nodeShape,
    branchRouteColor,
    searchResult,
    isSearchActive,
    isOnSearchRoute,
    isHovered,
    isRelated,
    hoveredNodeId,
    hasChildren,
    spotlightNodeIds,
    isLightMode,
  });

  return {
    node,
    x,
    y,
    width,
    height,
    depth,
    branchIndex,
    applyX,
    applyY,
    hoveredAnchorSide,
    setHoveredAnchorSide,
    isRoot,
    isBranch,
    bStyle,
    branchRouteColor,
    hasNotes,
    hasChildren,
    isHovered,
    searchResult,
    ...computedStyles,
  };
};
