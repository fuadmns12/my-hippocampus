import { NodeLink, selectOptimal4PointPair, getPathMidpoint } from "../../../utils/mindmapLayout";
import { MindMapLayout } from "../../../types";
import { ThemePalette } from "../../../utils/colorThemes";
import { ComputedLinkStyle, SIDE_NAMES } from "./types";

export interface ComputeLinkStyleParams {
  link: NodeLink;
  layout: MindMapLayout;
  palette: ThemePalette;
  relatedNodeIds: Set<string>;
  hoveredNodeId: string | null;
  isSearchActive: boolean;
  searchRouteLinkIds: Set<string>;
  isMyVersion: boolean;
  getBranchStyle: (branchIndex: number) => {
    border: string;
    bg: string;
    text: string;
    link?: string;
  };
  hoveredCustomLinkId: string | null;
  hoveredRouteLinkId: string | null;
  draggingLinkId?: string | null;
  spotlightNodeIds?: Set<string> | null;
}

export function computeLinkStyle({
  link,
  layout,
  palette,
  relatedNodeIds,
  hoveredNodeId,
  isSearchActive,
  searchRouteLinkIds,
  isMyVersion,
  getBranchStyle,
  hoveredCustomLinkId,
  hoveredRouteLinkId,
  draggingLinkId,
  spotlightNodeIds,
}: ComputeLinkStyleParams): ComputedLinkStyle {
  const isCustom = Boolean(link.isCustomConnection);
  const bStyle = getBranchStyle(link.branchIndex);
  const defaultCustomColor = "#06b6d4"; // Vibrant cyan for multi-anchor connection
  const linkColor = isCustom
    ? link.color || defaultCustomColor
    : bStyle.link || palette.defaultLink || "#38bdf8";

  const isHighlight =
    relatedNodeIds.has(link.source.node.id) &&
    relatedNodeIds.has(link.target.node.id);

  const isSearchLink = isSearchActive && searchRouteLinkIds.has(link.id);

  const isHoveredCustom = hoveredCustomLinkId === link.id;
  const isHoveredRoute = hoveredRouteLinkId === link.id;
  const isTargetNodeHovered = hoveredNodeId === link.target.node.id;

  // Tony Buzan Hierarchical Weighting: Organic line tapering based on depth
  const targetDepth = link.target.depth ?? 1;
  const baseHierarchyStroke =
    targetDepth === 1
      ? 4.6 // Trunk: Root to Main Branch (Thickest, bold visual anchor)
      : targetDepth === 2
      ? 3.2 // Sub-branch (Medium weight)
      : targetDepth === 3
      ? 2.1 // Sub-sub branch (Tapered)
      : 1.5; // Leaf branch (Fine detail)

  const isEmphasized = isSearchLink || isHighlight || isHoveredCustom || isHoveredRoute;
  const linkStrokeWidth = isEmphasized
    ? baseHierarchyStroke + 1.2
    : isCustom
    ? 2.6
    : baseHierarchyStroke;

  const isDraggingThisLink = draggingLinkId === link.id;

  // Check if branch spotlight / isolation mode is active
  const isSpotlightActive = Boolean(spotlightNodeIds && spotlightNodeIds.size > 0);
  const isInSpotlight = isSpotlightActive
    ? spotlightNodeIds!.has(link.source.node.id) && spotlightNodeIds!.has(link.target.node.id)
    : true;

  const linkOpacity = isDraggingThisLink
    ? 0.2
    : isSpotlightActive
    ? isInSpotlight
      ? 1
      : 0.15 // Faded opacity 15-20% for isolated branches outside spotlight
    : isHighlight || isHoveredCustom || isHoveredRoute
    ? 1
    : isSearchActive
    ? isSearchLink
      ? 1
      : 0.15
    : hoveredNodeId
    ? isTargetNodeHovered
      ? 1
      : isMyVersion
      ? 0.3
      : 0.5
    : 0.88;

  const linkFilter = isSearchLink
    ? `drop-shadow(0 0 6px ${linkColor}) drop-shadow(0 0 14px ${linkColor})`
    : (isHighlight && isMyVersion) || isHoveredCustom || isHoveredRoute
    ? `drop-shadow(0 0 6px ${linkColor}) drop-shadow(0 0 14px ${linkColor})`
    : isHighlight
    ? "drop-shadow(0 0 6px rgba(99, 102, 241, 0.5))"
    : undefined;

  // Hitung titik ujung garis (source dan target anchor)
  const { sourceAnchor, targetAnchor } = selectOptimal4PointPair(
    link.source,
    link.target,
    layout,
    undefined,
    isCustom,
    link.sourceAnchorSide,
    link.targetAnchorSide
  );

  // Koordinat tepat di tengah lintasan garis (50% dari panjang lintasan kurva/garis SVG)
  const pathMid = getPathMidpoint(link.pathD);

  const sLabel = SIDE_NAMES[sourceAnchor.side] || "Anchor";
  const tLabel = SIDE_NAMES[targetAnchor.side] || "Anchor";

  return {
    isCustom,
    linkColor,
    linkStrokeWidth,
    linkOpacity,
    linkFilter,
    isHighlight,
    isSearchLink,
    sourceAnchor,
    targetAnchor,
    midX: pathMid.x,
    midY: pathMid.y,
    sLabel,
    tLabel,
  };
}
