import React, { useEffect } from "react";
import { PositionedNode } from "../../../utils/layout/types";
import { InteractionState } from "./types";
import { calculatePinchZoom } from "./viewportHelpers";
import { findDropTargetCandidate } from "./dropTargetHelper";

export interface UseGlobalInteractionListenersParams {
  svgRef: React.RefObject<SVGSVGElement | null>;
  dragStart: { x: number; y: number };
  getCoordinates: (clientX: number, clientY: number) => { x: number; y: number };
  interactionRef: React.MutableRefObject<InteractionState>;
  dropTargetCandidateRef: React.MutableRefObject<PositionedNode | null>;
  nodesRef: React.MutableRefObject<PositionedNode[] | undefined>;
  onReparentNodeRef: React.MutableRefObject<
    ((nodeId: string, newParentId: string) => void) | undefined
  >;
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setIsPanning: (isPanning: boolean) => void;
  setDraggingNodeId: (id: string | null) => void;
  setResizingNodeId: (id: string | null) => void;
  setDropTargetCandidate: (node: PositionedNode | null) => void;
  onUpdateNodeOffset: (nodeId: string, xOffset: number, yOffset: number) => void;
  onUpdateNodeScale?: (nodeId: string, scale: number) => void;
}

export function useGlobalInteractionListeners({
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
}: UseGlobalInteractionListenersParams) {
  useEffect(() => {
    let rafId: number | null = null;
    let latestClientX = 0;
    let latestClientY = 0;
    let isScheduled = false;

    const processMove = () => {
      isScheduled = false;
      const mode = interactionRef.current.mode;

      if (mode === "pan") {
        setPan({
          x: latestClientX - dragStart.x,
          y: latestClientY - dragStart.y,
        });
      } else if (mode === "drag-node" && interactionRef.current.draggingNodeId) {
        // Mark drag movement if displaced beyond threshold
        const moveDist = Math.hypot(
          latestClientX - interactionRef.current.startClientPos.x,
          latestClientY - interactionRef.current.startClientPos.y
        );
        if (moveDist > 5) {
          interactionRef.current.hasDragMoved = true;
        }

        const currentPos = getCoordinates(latestClientX, latestClientY);
        const dx = currentPos.x - interactionRef.current.nodeDragStart.x;
        const dy = currentPos.y - interactionRef.current.nodeDragStart.y;

        const rawX = interactionRef.current.initialNodeOffset.x + dx;
        const rawY = interactionRef.current.initialNodeOffset.y + dy;

        // Bebas tanpa batasan kaku: pengguna dapat menempatkan ide ke mana pun di kanvas
        onUpdateNodeOffset(
          interactionRef.current.draggingNodeId,
          Math.round(rawX),
          Math.round(rawY)
        );

        // Deteksi kandidat induk saat node digeser mendekati node lain
        if (interactionRef.current.hasDragMoved && nodesRef.current && onReparentNodeRef.current) {
          const bestTarget = findDropTargetCandidate(
            nodesRef.current,
            interactionRef.current.draggingNodeId,
            rawX,
            rawY
          );

          if (bestTarget !== dropTargetCandidateRef.current) {
            dropTargetCandidateRef.current = bestTarget;
            setDropTargetCandidate(bestTarget);
          }
        }
      } else if (mode === "resize-node" && interactionRef.current.resizingNodeId) {
        const dx = latestClientX - interactionRef.current.resizeStartPos.x;
        const dy = latestClientY - interactionRef.current.resizeStartPos.y;
        let factor = dx + dy;
        if (interactionRef.current.resizingCorner === "sw") factor = -dx + dy;
        else if (interactionRef.current.resizingCorner === "ne") factor = dx - dy;
        else if (interactionRef.current.resizingCorner === "nw") factor = -dx - dy;

        const delta = factor / 110;
        const newScale = Math.min(
          2.5,
          Math.max(0.5, Number((interactionRef.current.initialScale + delta).toFixed(2)))
        );
        if (onUpdateNodeScale) {
          onUpdateNodeScale(interactionRef.current.resizingNodeId, newScale);
        }
      }
    };

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (interactionRef.current.mode === "none") return;
      latestClientX = e.clientX;
      latestClientY = e.clientY;
      if (!isScheduled) {
        isScheduled = true;
        rafId = requestAnimationFrame(processMove);
      }
    };

    const handleWindowMouseUp = () => {
      if (rafId) cancelAnimationFrame(rafId);
      isScheduled = false;

      const candidate = dropTargetCandidateRef.current;
      const dragNodeId = interactionRef.current.draggingNodeId;
      const didMove = interactionRef.current.hasDragMoved;

      if (candidate && dragNodeId && didMove && onReparentNodeRef.current) {
        // Pindahkan hierarki node secara otomatis saat di-drop di atas node lain
        onReparentNodeRef.current(dragNodeId, candidate.node.id);
      }

      dropTargetCandidateRef.current = null;
      setDropTargetCandidate(null);

      if (interactionRef.current.hasDragMoved) {
        interactionRef.current.lastDragEndTime = Date.now();
      }
      interactionRef.current.mode = "none";
      interactionRef.current.draggingNodeId = null;
      interactionRef.current.resizingNodeId = null;
      setIsPanning(false);
      setDraggingNodeId(null);
      setResizingNodeId(null);
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      const mode = interactionRef.current.mode;
      if (mode === "none") return;

      if (mode === "pinch" && e.touches.length >= 2) {
        if (e.cancelable) e.preventDefault();
        const transform = calculatePinchZoom(
          svgRef.current,
          e.touches[0],
          e.touches[1],
          interactionRef.current
        );
        if (transform) {
          setZoom(transform.zoom);
          setPan(transform.pan);
        }
      } else if ((mode === "pan" || mode === "drag-node") && e.touches.length === 1) {
        if (e.cancelable) e.preventDefault();
        latestClientX = e.touches[0].clientX;
        latestClientY = e.touches[0].clientY;
        if (!isScheduled) {
          isScheduled = true;
          rafId = requestAnimationFrame(processMove);
        }
      }
    };

    const handleWindowTouchEnd = () => {
      if (rafId) cancelAnimationFrame(rafId);
      isScheduled = false;

      const candidate = dropTargetCandidateRef.current;
      const dragNodeId = interactionRef.current.draggingNodeId;
      const didMove = interactionRef.current.hasDragMoved;

      if (candidate && dragNodeId && didMove && onReparentNodeRef.current) {
        onReparentNodeRef.current(dragNodeId, candidate.node.id);
      }

      dropTargetCandidateRef.current = null;
      setDropTargetCandidate(null);

      if (interactionRef.current.hasDragMoved) {
        interactionRef.current.lastDragEndTime = Date.now();
      }
      interactionRef.current.mode = "none";
      interactionRef.current.draggingNodeId = null;
      interactionRef.current.resizingNodeId = null;
      setIsPanning(false);
      setDraggingNodeId(null);
      setResizingNodeId(null);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
    window.addEventListener("touchmove", handleWindowTouchMove, { passive: false });
    window.addEventListener("touchend", handleWindowTouchEnd);
    window.addEventListener("touchcancel", handleWindowTouchEnd);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
      window.removeEventListener("touchmove", handleWindowTouchMove);
      window.removeEventListener("touchend", handleWindowTouchEnd);
      window.removeEventListener("touchcancel", handleWindowTouchEnd);
    };
  }, [
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
    svgRef,
  ]);
}
