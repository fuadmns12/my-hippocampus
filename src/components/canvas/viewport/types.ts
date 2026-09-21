import React from "react";
import { MindMapLayout } from "../../../types";
import { LayoutBounds } from "../../../utils/mindmapLayout";
import { PositionedNode } from "../../../utils/layout/types";

export interface UseCanvasViewportParams {
  svgRef: React.RefObject<SVGSVGElement | null>;
  gRef: React.RefObject<SVGGElement | null>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  bounds: LayoutBounds | undefined;
  nodesLength: number;
  layout: MindMapLayout;
  dataId: string;
  onUpdateNodeOffset: (nodeId: string, xOffset: number, yOffset: number) => void;
  onUpdateNodeScale?: (nodeId: string, scale: number) => void;
  onResetNodeOffsets?: () => void;
  nodes?: PositionedNode[];
  onReparentNode?: (nodeId: string, newParentId: string) => void;
}

export type InteractionMode =
  | "none"
  | "pan"
  | "drag-node"
  | "resize-node"
  | "pinch";

export type ResizingCorner = "se" | "sw" | "ne" | "nw";

export interface InteractionState {
  mode: InteractionMode;
  panStart: { x: number; y: number };
  draggingNodeId: string | null;
  nodeDragStart: { x: number; y: number };
  initialNodeOffset: { x: number; y: number };
  nodeBasePos: { x: number; y: number };
  nodeSize: { width: number; height: number; scale: number };
  startClientPos: { x: number; y: number };
  hasDragMoved: boolean;
  resizingNodeId: string | null;
  resizingCorner: ResizingCorner;
  resizeStartPos: { x: number; y: number };
  initialScale: number;
  pinchStartDistance: number;
  pinchStartZoom: number;
  pinchStartPan: { x: number; y: number };
  pinchStartMidpoint: { x: number; y: number };
  lastDragEndTime: number;
}

export function createInitialInteractionState(): InteractionState {
  return {
    mode: "none",
    panStart: { x: 0, y: 0 },
    draggingNodeId: null,
    nodeDragStart: { x: 0, y: 0 },
    initialNodeOffset: { x: 0, y: 0 },
    nodeBasePos: { x: 800, y: 600 },
    nodeSize: { width: 160, height: 60, scale: 1.0 },
    startClientPos: { x: 0, y: 0 },
    hasDragMoved: false,
    resizingNodeId: null,
    resizingCorner: "se",
    resizeStartPos: { x: 0, y: 0 },
    initialScale: 1.0,
    pinchStartDistance: 0,
    pinchStartZoom: 1,
    pinchStartPan: { x: 0, y: 0 },
    pinchStartMidpoint: { x: 0, y: 0 },
    lastDragEndTime: 0,
  };
}
