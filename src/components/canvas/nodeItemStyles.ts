import React from "react";
import { MindMapNode, NodeShape } from "../../types";
import { ThemePalette } from "../../utils/colorThemes";
import { getNodeShapeMetrics } from "./NodeShapeRenderer";
import {
  isColorDark,
  computeFittedLabelText,
  computeFittedSubText,
} from "./nodeItem/nodeTextFit";

export { isColorDark };

export interface NodeItemStylesParams {
  node: MindMapNode;
  width: number;
  height: number;
  isRoot: boolean;
  isBranch: boolean;
  depth?: number;
  palette: ThemePalette;
  nodeShape: NodeShape | string;
  branchRouteColor: string;
  searchResult: {
    isMatch: boolean;
    hasMatchingDescendants: boolean;
    matchedInSubtitle?: boolean;
    matchedInNotes?: boolean;
  };
  isSearchActive: boolean;
  isOnSearchRoute: boolean;
  isHovered: boolean;
  isRelated?: boolean;
  hoveredNodeId: string | null;
  hasChildren: boolean;
  spotlightNodeIds?: Set<string> | null;
  isLightMode?: boolean;
}

export function computeNodeItemStyles(params: NodeItemStylesParams) {
  const {
    node,
    width,
    isRoot,
    isBranch,
    depth = isRoot ? 0 : isBranch ? 1 : 2,
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
    isLightMode = false,
  } = params;

  const scaleFactor = node.scale || 1;

  // Tony Buzan Hierarchical Typography Scaling based on depth
  const baseLabelFontSize =
    depth === 0 ? 14.5 : depth === 1 ? 12.8 : depth === 2 ? 11.4 : 10.2;
  const initialLabelFontSize = Math.min(
    32,
    Math.max(7, Math.round(baseLabelFontSize * scaleFactor))
  );

  const baseSubFontSize = depth === 0 ? 10.5 : depth === 1 ? 9.2 : 8.2;
  const initialSubFontSize = Math.min(
    24,
    Math.max(6, Math.round(baseSubFontSize * scaleFactor))
  );

  const shapeMetrics = getNodeShapeMetrics(nodeShape, isRoot, isBranch, scaleFactor);
  const isCollapsedBadgePresent = Boolean(hasChildren && !isRoot && node.collapsed);
  const availableTextWidth = Math.max(
    20,
    width -
      shapeMetrics.paddingLeft -
      shapeMetrics.paddingRight -
      (isCollapsedBadgePresent ? 18 * scaleFactor : 0)
  );

  const { dynamicFontSize: dynamicLabelFontSize, displayLabelText } =
    computeFittedLabelText(
      node.label || "",
      node.emoji,
      initialLabelFontSize,
      availableTextWidth,
      scaleFactor
    );

  const {
    dynamicSubFontSize,
    displaySubText,
    maxFitSubChars,
  } = computeFittedSubText(
    node.subtitle || "",
    initialSubFontSize,
    availableTextWidth,
    scaleFactor
  );

  const isMyVersion = Boolean(
    palette.useRouteColorForBorder ||
      palette.name?.toLowerCase().includes("my version")
  );

  // If node has custom bgColor explicitly set by user to a non-default color, preserve it
  const isCustomColored = Boolean(
    node.bgColor &&
      node.bgColor !== "#000000" &&
      node.bgColor !== "#09090b" &&
      node.bgColor !== "#0a0a0a" &&
      node.bgColor !== "black"
  );

  const cardFill = isCustomColored
    ? node.bgColor!
    : isLightMode
    ? "#ffffff" // Light mode: card background becomes clean white
    : isMyVersion
    ? "#000000"
    : isRoot
    ? palette.rootCardBg || (palette.isDark ? "#000000" : "#4f46e5")
    : isBranch
    ? palette.branchCardBg || (palette.isDark ? "#000000" : "#f8fafc")
    : palette.leafCardBg || (palette.isDark ? "#000000" : "#ffffff");

  const isSearchMatch = searchResult.isMatch;
  const hasMatchingDescendants = searchResult.hasMatchingDescendants;
  const isGlowActive =
    isSearchMatch || (hasMatchingDescendants && Boolean(node.collapsed));

  // In light mode, preserve the vibrant theme route/border colors while ensuring contrast
  const naturalCardStroke =
    node.borderColor ||
    node.color ||
    (isMyVersion
      ? isRoot
        ? palette.rootCardBorder || (isLightMode ? "#0284c7" : "#38bdf8")
        : branchRouteColor
      : isRoot
      ? palette.rootCardBorder || (isLightMode ? "#6366f1" : "#818cf8")
      : isBranch
      ? branchRouteColor
      : branchRouteColor || (isLightMode ? "#cbd5e1" : (palette.isDark ? "#334155" : "#cbd5e1")));

  const cardStroke = naturalCardStroke;

  // Hierarchical border stroke width
  const depthStroke =
    depth === 0 ? 2.8 : depth === 1 ? 2.2 : depth === 2 ? 1.6 : 1.2;

  const cardStrokeWidth =
    (isSearchMatch ? 3.0 : depthStroke) *
      Math.min(1.8, Math.max(0.8, scaleFactor)) +
    (isHovered || isSearchMatch ? (isMyVersion ? 1.0 : 0.8) : 0);

  const cardStyle: React.CSSProperties = {};
  if (isSearchMatch) {
    cardStyle.filter = `drop-shadow(0 0 6px ${cardStroke}) drop-shadow(0 0 16px ${cardStroke}) drop-shadow(0 0 26px ${cardStroke})`;
  } else if (hasMatchingDescendants && node.collapsed) {
    cardStyle.filter = `drop-shadow(0 0 4px ${cardStroke}) drop-shadow(0 0 12px ${cardStroke})`;
  } else if (isHovered) {
    cardStyle.filter = isMyVersion
      ? `drop-shadow(0 0 6px ${cardStroke}) drop-shadow(0 0 16px ${cardStroke})`
      : `drop-shadow(0 0 8px ${cardStroke})`;
  } else if (isRelated && hoveredNodeId && isMyVersion) {
    cardStyle.filter = `drop-shadow(0 0 4px ${cardStroke})`;
  } else if (isLightMode) {
    cardStyle.filter = "drop-shadow(0 2px 5px rgba(15, 23, 42, 0.08))";
  }

  const isCardDark = isColorDark(cardFill);
  const labelTextColor = isCardDark ? "#ffffff" : "#0f172a";
  const subTextColor = isCardDark ? "rgba(255, 255, 255, 0.85)" : "#334155";
  const rightMargin = width / 2 - shapeMetrics.paddingRight;
  const textXOffset = isCollapsedBadgePresent ? -6 * scaleFactor : 0;

  // Branch Spotlight (Isolation Mode): 20% opacity for non-spotlighted branches
  const isSpotlightActive = Boolean(spotlightNodeIds && spotlightNodeIds.size > 0);
  const isInSpotlight = isSpotlightActive ? spotlightNodeIds!.has(node.id) : true;

  const nodeOpacity = isSpotlightActive
    ? isInSpotlight
      ? 1
      : 0.2 // Reduced cognitive load: 20% opacity
    : isSearchActive
    ? isGlowActive || isOnSearchRoute
      ? 1
      : 0.55
    : 1;

  return {
    scaleFactor,
    dynamicLabelFontSize,
    dynamicSubFontSize,
    availableTextWidth,
    displayLabelText,
    displaySubText,
    maxFitSubChars,
    isMyVersion,
    cardFill,
    cardStroke,
    cardStrokeWidth,
    cardStyle,
    isCardDark,
    labelTextColor,
    subTextColor,
    rightMargin,
    textXOffset,
    isCollapsedBadgePresent,
    nodeOpacity,
    isGlowActive,
    isInSpotlight,
    isSpotlightActive,
  };
}
