import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  PositionedNode,
  NodeLink,
  AnchorSide,
} from "../../utils/mindmapLayout";
import { soundFx } from "../../utils/soundEffects";
import {
  ReparentDragState,
  UseRouteReparentDragParams,
  UseRouteReparentDragReturn,
  dispatchConnectionAction,
  getSvgGroupCoordinates,
  createAnchorDragState,
  createReparentOrRouteDragState,
  computeNextDragStateOnMove,
} from "./reparent";

// Re-export types for backward compatibility
export type { ReparentDragState, UseRouteReparentDragParams, UseRouteReparentDragReturn };

export function useRouteReparentDrag({
  nodes,
  links,
  layout,
  connectorStyle,
  svgRef,
  gRef,
  onReparentNode,
  onAddConnection,
  onRemoveConnection,
}: UseRouteReparentDragParams): UseRouteReparentDragReturn {
  const [reparentDragState, setReparentDragState] = useState<ReparentDragState | null>(null);
  const [hoveredEndpointLinkId, setHoveredEndpointLinkId] = useState<string | null>(null);

  const dragRef = useRef<ReparentDragState | null>(null);
  dragRef.current = reparentDragState;

  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  const linksRef = useRef(links);
  linksRef.current = links;

  const onReparentNodeRef = useRef(onReparentNode);
  onReparentNodeRef.current = onReparentNode;

  const onAddConnectionRef = useRef(onAddConnection);
  onAddConnectionRef.current = onAddConnection;

  const onRemoveConnectionRef = useRef(onRemoveConnection);
  onRemoveConnectionRef.current = onRemoveConnection;

  const getGroupCoordinates = useCallback(
    (clientX: number, clientY: number) => {
      return getSvgGroupCoordinates(svgRef, gRef, clientX, clientY);
    },
    [svgRef, gRef]
  );

  /**
   * Tarik dari salah satu dari 4 Anchor Point (Atas, Bawah, Kiri, Kanan)
   * untuk menghubungkan ke anchor node lain di kanvas
   */
  const handleStartAnchorDrag = useCallback(
    (
      sourceNode: PositionedNode,
      side: AnchorSide,
      e: React.PointerEvent | React.MouseEvent
    ) => {
      e.stopPropagation();
      e.preventDefault();
      soundFx.play("pop");

      const clientX = "clientX" in e ? e.clientX : 0;
      const clientY = "clientY" in e ? e.clientY : 0;
      const pointerPos = getGroupCoordinates(clientX, clientY);

      const initialState = createAnchorDragState({
        sourceNode,
        side,
        pointerPos,
        connectorStyle,
        layout,
      });

      setReparentDragState(initialState);
      dragRef.current = initialState;
    },
    [getGroupCoordinates, layout, connectorStyle]
  );

  /**
   * Tarik ujung garis rute yang sudah ada (bisa reparent tree atau re-route custom connection)
   */
  const handleStartReparentDrag = useCallback(
    (
      link: NodeLink,
      e: React.PointerEvent | React.MouseEvent,
      forcedChildSide?: AnchorSide
    ) => {
      e.stopPropagation();
      e.preventDefault();
      soundFx.play("pop");

      if (!link.isCustomConnection && !onReparentNodeRef.current) return;

      const clientX = "clientX" in e ? e.clientX : 0;
      const clientY = "clientY" in e ? e.clientY : 0;
      const pointerPos = getGroupCoordinates(clientX, clientY);

      const initialState = createReparentOrRouteDragState({
        link,
        pointerPos,
        connectorStyle,
        layout,
        forcedChildSide,
      });

      setReparentDragState(initialState);
      dragRef.current = initialState;
    },
    [getGroupCoordinates, layout, connectorStyle]
  );

  const isDragging = Boolean(reparentDragState);

  // Global PointerMove, PointerUp, and KeyDown handlers while dragging
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const { x: curX, y: curY } = getGroupCoordinates(e.clientX, e.clientY);

      const nextState = computeNextDragStateOnMove({
        currentDrag: dragRef.current,
        nodes: nodesRef.current,
        links: linksRef.current,
        curX,
        curY,
      });

      dragRef.current = nextState;
      setReparentDragState(nextState);
    };

    const handlePointerUp = () => {
      const current = dragRef.current;
      if (current) {
        dispatchConnectionAction({
          current,
          onReparentNode: onReparentNodeRef.current,
          onAddConnection: onAddConnectionRef.current,
          onRemoveConnection: onRemoveConnectionRef.current,
        });
      }

      setReparentDragState(null);
      dragRef.current = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setReparentDragState(null);
        dragRef.current = null;
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDragging, getGroupCoordinates]);

  return {
    reparentDragState,
    hoveredEndpointLinkId,
    setHoveredEndpointLinkId,
    handleStartReparentDrag,
    handleStartAnchorDrag,
    isDraggingReparent: Boolean(reparentDragState),
  };
}
