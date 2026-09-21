import React from "react";
import { MindMapNode, NodeShape } from "../../../types";
import { PositionedNode, NodeLink } from "../../../utils/mindmapLayout";
import { ThemePalette } from "../../../utils/colorThemes";

export type AnchorSide = "top" | "bottom" | "left" | "right";

export interface CanvasNodeItemProps {
  posNode: PositionedNode;
  nodeShape: NodeShape | string;
  palette: ThemePalette;
  searchQuery: string;
  hoveredNodeId: string | null;
  pinnedNodeId: string | null;
  activeScaleMenuId: string | null;
  isOnSearchRoute?: boolean;
  isDragging?: boolean;
  isRelated?: boolean;
  incomingLink?: NodeLink;
  onStartReparentDrag?: (
    link: NodeLink,
    e: React.PointerEvent | React.MouseEvent,
    side?: AnchorSide
  ) => void;
  onStartAnchorDrag?: (
    sourceNode: PositionedNode,
    side: AnchorSide,
    e: React.PointerEvent | React.MouseEvent
  ) => void;
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
  wasJustDragged?: () => boolean;
  setResizingNodeId: (id: string | null) => void;
  setResizingCorner: (corner: "nw" | "ne" | "sw" | "se") => void;
  setResizeStartPos: (pos: { x: number; y: number }) => void;
  setInitialScale: (scale: number) => void;
  onUpdateNodeScale?: (id: string, scale: number) => void;
  getBranchStyle: (branchIndex: number) => { link?: string };
  spotlightNodeIds?: Set<string> | null;
  onToggleSpotlight?: (nodeId: string) => void;
  onDrillDownSubtree?: (nodeId: string) => void;
}
