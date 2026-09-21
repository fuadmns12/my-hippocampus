import { useState, useEffect, useCallback, useRef } from "react";
import {
  UseCanvasViewportParams,
  createInitialInteractionState,
  getGroupCoordinates,
  calculateFitToScreen,
  useContainerInteractions,
  useNodeDragResize,
  useGlobalInteractionListeners,
} from "./viewport";

export type { UseCanvasViewportParams };

export function useCanvasViewport({
  svgRef,
  gRef,
  containerRef,
  bounds,
  nodesLength,
  layout,
  dataId,
  onUpdateNodeOffset,
  onUpdateNodeScale,
  onResetNodeOffsets,
  nodes,
  onReparentNode,
  preferPageScrollOnSingleFingerTouch = true,
}: UseCanvasViewportParams) {
  // Viewport Pan & Zoom state
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Single Source of Truth for Realtime Interaction State (Zero-lag closure safety)
  const interactionRef = useRef(createInitialInteractionState());

  const getCoordinates = useCallback(
    (clientX: number, clientY: number) => {
      return getGroupCoordinates(svgRef.current, gRef.current, clientX, clientY);
    },
    [svgRef, gRef]
  );

  const handleFitToScreen = useCallback(() => {
    const transform = calculateFitToScreen(bounds, nodesLength);
    setZoom(transform.zoom);
    setPan(transform.pan);
  }, [bounds, nodesLength]);

  const handleFitToScreenRef = useRef(handleFitToScreen);
  handleFitToScreenRef.current = handleFitToScreen;

  // Auto Recenter on layout change or map change
  useEffect(() => {
    handleFitToScreenRef.current();
  }, [layout, dataId]);

  const handleResetNodeOffsets = useCallback(() => {
    if (onResetNodeOffsets) {
      onResetNodeOffsets();
    }
    setTimeout(() => {
      handleFitToScreen();
    }, 50);
  }, [onResetNodeOffsets, handleFitToScreen]);

  // Hook for node dragging and resizing state & handlers
  const {
    draggingNodeId,
    setDraggingNodeId,
    activeScaleMenuId,
    setActiveScaleMenuId,
    setResizingNodeId,
    setResizingCorner,
    setResizeStartPos,
    setInitialScale,
    handleStartDragNode,
    wasJustDragged,
    dropTargetCandidate,
    setDropTargetCandidate,
    dropTargetCandidateRef,
    nodesRef,
    onReparentNodeRef,
  } = useNodeDragResize({
    nodes,
    onReparentNode,
    getCoordinates,
    interactionRef,
    setIsPanning,
  });

  // Hook for container listeners (native wheel zoom, single/two-finger touch, pan mousedown)
  const { handleWheel, handleMouseDown } = useContainerInteractions({
    containerRef,
    svgRef,
    pan,
    setPan,
    zoom,
    setZoom,
    setIsPanning,
    setDragStart,
    setDraggingNodeId,
    interactionRef,
  });

  // Hook for global window movement and drag/resize/pinch RAF listener
  useGlobalInteractionListeners({
    svgRef,
    dragStart,
    getCoordinates,
    interactionRef,
    dropTargetCandidateRef,
    nodesRef,
    onReparentNodeRef,
    setPan,
    setZoom,
    setIsPanning,
    setDraggingNodeId,
    setResizingNodeId,
    setDropTargetCandidate,
    onUpdateNodeOffset,
    onUpdateNodeScale,
    preferPageScrollOnSingleFingerTouch,
  });

  return {
    zoom,
    setZoom,
    pan,
    setPan,
    handleWheel,
    handleMouseDown,
    handleFitToScreen,
    handleResetNodeOffsets,
    handleStartDragNode,
    draggingNodeId,
    activeScaleMenuId,
    setActiveScaleMenuId,
    setResizingNodeId,
    setResizingCorner,
    setResizeStartPos,
    setInitialScale,
    wasJustDragged,
    dropTargetCandidate,
  };
}
