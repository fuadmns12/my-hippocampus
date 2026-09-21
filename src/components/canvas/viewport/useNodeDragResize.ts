import React, { useState, useCallback, useRef } from "react";
import { MindMapNode } from "../../../types";
import { PositionedNode } from "../../../utils/layout/types";
import { InteractionState, ResizingCorner } from "./types";

export interface UseNodeDragResizeParams {
  nodes?: PositionedNode[];
  onReparentNode?: (nodeId: string, newParentId: string) => void;
  getCoordinates: (clientX: number, clientY: number) => { x: number; y: number };
  interactionRef: React.MutableRefObject<InteractionState>;
  setIsPanning: (isPanning: boolean) => void;
}

export function useNodeDragResize({
  nodes,
  onReparentNode,
  getCoordinates,
  interactionRef,
  setIsPanning,
}: UseNodeDragResizeParams) {
  // Node Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [, setNodeDragStart] = useState({ x: 0, y: 0 });
  const [, setInitialNodeOffset] = useState({ x: 0, y: 0 });
  const [dropTargetCandidate, setDropTargetCandidate] = useState<PositionedNode | null>(null);
  const dropTargetCandidateRef = useRef<PositionedNode | null>(null);

  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const onReparentNodeRef = useRef(onReparentNode);
  onReparentNodeRef.current = onReparentNode;

  // Node Scale / Resizing state
  const [activeScaleMenuId, setActiveScaleMenuId] = useState<string | null>(null);
  const [, setResizingNodeId] = useState<string | null>(null);
  const [, setResizingCorner] = useState<ResizingCorner>("se");
  const [, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [, setInitialScale] = useState(1.0);

  const customSetResizingNodeId = useCallback(
    (id: string | null) => {
      if (!id) {
        if (interactionRef.current.mode === "resize-node") {
          interactionRef.current.mode = "none";
          interactionRef.current.resizingNodeId = null;
        }
      } else {
        interactionRef.current.mode = "resize-node";
        interactionRef.current.resizingNodeId = id;
      }
      setResizingNodeId(id);
    },
    [interactionRef]
  );

  const customSetResizingCorner = useCallback(
    (corner: ResizingCorner) => {
      interactionRef.current.resizingCorner = corner;
      setResizingCorner(corner);
    },
    [interactionRef]
  );

  const customSetResizeStartPos = useCallback(
    (pos: { x: number; y: number }) => {
      interactionRef.current.resizeStartPos = pos;
      setResizeStartPos(pos);
    },
    [interactionRef]
  );

  const customSetInitialScale = useCallback(
    (scale: number) => {
      interactionRef.current.initialScale = scale;
      setInitialScale(scale);
    },
    [interactionRef]
  );

  const handleStartDragNode = useCallback(
    (
      e: React.MouseEvent | React.TouchEvent,
      node: MindMapNode,
      baseX?: number,
      baseY?: number,
      width?: number,
      height?: number
    ) => {
      e.stopPropagation();

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const groupPos = getCoordinates(clientX, clientY);

      interactionRef.current.mode = "drag-node";
      interactionRef.current.draggingNodeId = node.id;
      interactionRef.current.nodeDragStart = groupPos;
      interactionRef.current.initialNodeOffset = {
        x: node.xOffset || 0,
        y: node.yOffset || 0,
      };
      interactionRef.current.nodeBasePos = {
        x: baseX !== undefined ? baseX : 800,
        y: baseY !== undefined ? baseY : 600,
      };
      interactionRef.current.nodeSize = {
        width: width || 160,
        height: height || 60,
        scale: node.scale || 1.0,
      };
      interactionRef.current.startClientPos = { x: clientX, y: clientY };
      interactionRef.current.hasDragMoved = false;

      setIsPanning(false);
      setDraggingNodeId(node.id);
      setNodeDragStart(groupPos);
      setInitialNodeOffset({
        x: node.xOffset || 0,
        y: node.yOffset || 0,
      });
    },
    [getCoordinates, interactionRef, setIsPanning]
  );

  const wasJustDragged = useCallback(() => {
    return Date.now() - interactionRef.current.lastDragEndTime < 280;
  }, [interactionRef]);

  return {
    draggingNodeId,
    setDraggingNodeId,
    activeScaleMenuId,
    setActiveScaleMenuId,
    setResizingNodeId: customSetResizingNodeId,
    setResizingCorner: customSetResizingCorner,
    setResizeStartPos: customSetResizeStartPos,
    setInitialScale: customSetInitialScale,
    handleStartDragNode,
    wasJustDragged,
    dropTargetCandidate,
    setDropTargetCandidate,
    dropTargetCandidateRef,
    nodesRef,
    onReparentNodeRef,
  };
}
