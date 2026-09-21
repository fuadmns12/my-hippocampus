import React from "react";
import { MindMapLayout, ConnectorStyle } from "../../../types";
import {
  PositionedNode,
  NodeLink,
  AnchorPoint,
  AnchorSide,
} from "../../../utils/mindmapLayout";

export interface ReparentDragState {
  mode: "connect" | "reparent";
  linkId: string;
  sourceNode: PositionedNode;
  sourceAnchorSide: AnchorSide;
  childNode: PositionedNode; // For backwards compatibility
  oldParentNode: PositionedNode; // For backwards compatibility
  childAnchor: AnchorPoint;
  currentPointer: { x: number; y: number };
  hoveredTargetNode: PositionedNode | null;
  targetAnchor: AnchorPoint | null;
  isValidTarget: boolean;
  invalidReason?: "self" | "descendant" | "same_parent" | "already_connected_hierarchy";
  isSnapped: boolean;
  connectorStyle: ConnectorStyle;
  layout: MindMapLayout;
  existingCustomConnectionId?: string;
  isMergeAction?: boolean;
}

export interface UseRouteReparentDragParams {
  nodes: PositionedNode[];
  links: NodeLink[];
  layout: MindMapLayout;
  connectorStyle: ConnectorStyle;
  svgRef: React.RefObject<SVGSVGElement | null>;
  gRef: React.RefObject<SVGGElement | null>;
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
}

export interface UseRouteReparentDragReturn {
  reparentDragState: ReparentDragState | null;
  hoveredEndpointLinkId: string | null;
  setHoveredEndpointLinkId: (id: string | null) => void;
  handleStartReparentDrag: (
    link: NodeLink,
    e: React.PointerEvent | React.MouseEvent,
    forcedChildSide?: AnchorSide
  ) => void;
  handleStartAnchorDrag: (
    sourceNode: PositionedNode,
    side: AnchorSide,
    e: React.PointerEvent | React.MouseEvent
  ) => void;
  isDraggingReparent: boolean;
}
