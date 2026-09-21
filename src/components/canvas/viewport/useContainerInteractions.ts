import React, { useEffect, useCallback } from "react";
import { InteractionState } from "./types";
import {
  isTargetInteractive,
  calculateWheelZoom,
} from "./viewportHelpers";

export interface UseContainerInteractionsParams {
  containerRef?: React.RefObject<HTMLDivElement | null>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setIsPanning: (isPanning: boolean) => void;
  setDragStart: (pos: { x: number; y: number }) => void;
  setDraggingNodeId: (id: string | null) => void;
  interactionRef: React.MutableRefObject<InteractionState>;
}

export function useContainerInteractions({
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
}: UseContainerInteractionsParams) {
  const handleWheelZoom = useCallback(
    (clientX: number, clientY: number, deltaY: number) => {
      const transform = calculateWheelZoom(
        svgRef.current,
        clientX,
        clientY,
        deltaY,
        zoom,
        pan
      );
      if (transform) {
        setZoom(transform.zoom);
        setPan(transform.pan);
      }
    },
    [zoom, pan, svgRef, setZoom, setPan]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      handleWheelZoom(e.clientX, e.clientY, e.deltaY);
    },
    [handleWheelZoom]
  );

  // Attach non-passive wheel listener on container to prevent outer scroll and allow smooth cursor-centered zoom
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const onWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      handleWheelZoom(e.clientX, e.clientY, e.deltaY);
    };

    container.addEventListener("wheel", onWheelNative, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheelNative);
    };
  }, [containerRef, handleWheelZoom]);

  // Attach touchstart listener on container for single-finger canvas pan and two-finger pinch-to-zoom
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      // If user has already initiated a node drag or resize, NEVER initiate canvas panning
      if (
        interactionRef.current.mode === "drag-node" ||
        interactionRef.current.mode === "resize-node"
      ) {
        return;
      }

      if (e.touches.length === 1) {
        const target = e.target as (HTMLElement | SVGElement) | null;
        if (isTargetInteractive(target, container)) {
          return; // Interactive node or button touched, do not pan canvas
        }

        interactionRef.current.mode = "pan";
        interactionRef.current.panStart = {
          x: e.touches[0].clientX - pan.x,
          y: e.touches[0].clientY - pan.y,
        };
        setIsPanning(true);
        setDragStart({
          x: e.touches[0].clientX - pan.x,
          y: e.touches[0].clientY - pan.y,
        });
      } else if (e.touches.length === 2) {
        // Two fingers -> Pinch-to-zoom / two-finger pan
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;

        setDraggingNodeId(null);
        setIsPanning(false);

        interactionRef.current.mode = "pinch";
        interactionRef.current.pinchStartDistance = dist;
        interactionRef.current.pinchStartZoom = zoom;
        interactionRef.current.pinchStartPan = { ...pan };
        interactionRef.current.pinchStartMidpoint = { x: midX, y: midY };
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
    };
  }, [
    containerRef,
    pan,
    zoom,
    interactionRef,
    setIsPanning,
    setDragStart,
    setDraggingNodeId,
  ]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only handle primary mouse click (left button)
      if (e.button !== 0) return;

      // If node dragging is already active, ignore canvas mousedown
      if (
        interactionRef.current.mode === "drag-node" ||
        interactionRef.current.mode === "resize-node"
      ) {
        return;
      }

      const container = containerRef?.current;
      if (!container) return;
      const target = e.target as (HTMLElement | SVGElement) | null;
      if (isTargetInteractive(target, container)) {
        return;
      }

      interactionRef.current.mode = "pan";
      interactionRef.current.panStart = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    },
    [containerRef, pan, interactionRef, setIsPanning, setDragStart]
  );

  return {
    handleWheelZoom,
    handleWheel,
    handleMouseDown,
  };
}
