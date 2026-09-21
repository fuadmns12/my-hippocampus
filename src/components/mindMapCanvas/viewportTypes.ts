import React from "react";
import {
  MindMapNode,
  MindMapLayout,
  ConnectorStyle,
  NodeShape,
  AnchorSide,
  BoundaryGroup,
} from "../../types";
import { PositionedNode, NodeLink } from "../../utils/mindmapLayout";
import { ThemePalette } from "../../utils/colorThemes";
import { ReparentDragState } from "../canvas/useRouteReparentDrag";

export interface CanvasSvgViewportProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  gRef: React.RefObject<SVGGElement | null>;
  pan: { x: number; y: number };
  zoom: number;
  // Boundary Hulls
  boundaries?: BoundaryGroup[];
  showBranchBoundaries?: boolean;
  onSelectBoundary?: (boundaryId: string, nodeIds: string[]) => void;
  // Spotlight
  spotlightNodeIds?: Set<string> | null;
  onToggleSpotlight?: (nodeId: string) => void;
  onDrillDownSubtree?: (nodeId: string) => void;
  // Links layer
  links: NodeLink[];
  connectorStyle: ConnectorStyle;
  layout: MindMapLayout;
  palette: ThemePalette;
  relatedNodeIds: Set<string>;
  hoveredNodeId: string | null;
  isSearchActive: boolean;
  searchRouteLinkIds: Set<string>;
  isMyVersion: boolean;
  getBranchStyle: (branchIndex: number) => any;
  onReparentNode?: (
    nodeId: string,
    newParentId: string,
    sourceAnchorSide?: AnchorSide,
    targetAnchorSide?: AnchorSide
  ) => void;
  onAddConnection?: (
    sourceNodeId: string,
    sourceAnchorSide: AnchorSide,
    targetNodeId: string,
    targetAnchorSide: AnchorSide
  ) => void;
  onRemoveConnection?: (connectionId: string) => void;
  onDetachNodeAsRoot?: (nodeId: string, currentPos?: { x: number; y: number }) => void;
  hoveredEndpointLinkId: string | null;
  setHoveredEndpointLinkId: (id: string | null) => void;
  reparentDragState: ReparentDragState | null;
  handleStartReparentDrag: (
    link: NodeLink,
    e: React.PointerEvent | React.MouseEvent,
    side?: AnchorSide
  ) => void;
  handleStartAnchorDrag: (
    sourceNode: PositionedNode,
    side: AnchorSide,
    e: React.PointerEvent | React.MouseEvent
  ) => void;
  // Nodes layer
  nodes: PositionedNode[];
  nodeShape?: NodeShape;
  searchQuery: string;
  pinnedNodeId: string | null;
  activeScaleMenuId: string | null;
  searchRouteNodeIds: Set<string>;
  draggingNodeId: string | null;
  incomingLinksMap: Map<string, NodeLink>;
  setHoveredNodeId: (id: string | null) => void;
  setPinnedNodeId: (id: string | null) => void;
  setActiveScaleMenuId: (id: string | null) => void;
  onSelectNode: (node: MindMapNode) => void;
  onOpenNotes?: (node: MindMapNode) => void;
  onToggleCollapseNode: (nodeId: string) => void;
  handleStartDragNode: (
    e: React.MouseEvent | React.TouchEvent,
    node: MindMapNode,
    baseX?: number,
    baseY?: number,
    width?: number,
    height?: number
  ) => void;
  wasJustDragged: () => boolean;
  setResizingNodeId: (id: string | null) => void;
  setResizingCorner: (corner: any) => void;
  setResizeStartPos: (pos: { x: number; y: number }) => void;
  setInitialScale: (scale: number) => void;
  onUpdateNodeScale?: (nodeId: string, scale: number) => void;
  // Drop target candidate
  dropTargetCandidate: PositionedNode | null;
}
