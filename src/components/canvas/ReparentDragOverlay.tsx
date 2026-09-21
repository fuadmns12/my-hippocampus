import React from "react";
import { ReparentDragState } from "./useRouteReparentDrag";
import {
  buildPathBetweenAnchors,
  buildPathToFreePointer,
} from "../../utils/mindmapLayout";
import { ConnectorStyle } from "../../types";
import {
  SIDE_NAMES,
  TargetNodeSnapAura,
  TargetNodeAnchorPoints,
  TargetGuidanceBadge,
  OriginAnchorPoint,
  DragPinHandle,
} from "./reparentOverlay";

export { SIDE_NAMES };

export interface ReparentDragOverlayProps {
  dragState: ReparentDragState | null;
  connectorStyle?: ConnectorStyle;
}

export const ReparentDragOverlay: React.FC<ReparentDragOverlayProps> = ({
  dragState,
  connectorStyle: propConnectorStyle,
}) => {
  if (!dragState) return null;

  const {
    childAnchor,
    currentPointer,
    hoveredTargetNode,
    targetAnchor,
    isValidTarget,
    isSnapped,
    connectorStyle: stateConnectorStyle,
  } = dragState;

  const activeConnectorStyle: ConnectorStyle = propConnectorStyle || stateConnectorStyle || "bezier";

  // Koordinat ujung garis rute yang ditarik:
  // Ketika tersnap ke targetAnchor, ujung garis mengunci tepat di titik koordinat anchor tersebut
  const endX = isSnapped && targetAnchor ? targetAnchor.x : currentPointer.x;
  const endY = isSnapped && targetAnchor ? targetAnchor.y : currentPointer.y;

  // Bangun jalur kurva SVG presisi berdasarkan 4 anchor
  let pathD = "";
  if (isSnapped && targetAnchor) {
    pathD = buildPathBetweenAnchors(childAnchor, targetAnchor, activeConnectorStyle);
  } else {
    pathD = buildPathToFreePointer(childAnchor, { x: endX, y: endY });
  }

  const sx = childAnchor.x;
  const sy = childAnchor.y;
  const tx = endX;
  const ty = endY;

  const lineColor = hoveredTargetNode
    ? isValidTarget
      ? "#10b981" // Emerald valid snap
      : "#f43f5e" // Rose / Invalid target
    : "#06b6d4"; // Cyan active drag

  const activeAnchorSide = targetAnchor?.side;
  const activeAnchorLabel = activeAnchorSide ? SIDE_NAMES[activeAnchorSide] : "";

  return (
    <g className="reparent-drag-overlay pointer-events-none select-none z-50">
      {/* 1. Jalur Garis Rute Dinamis yang menyambung tepat dari childAnchor ke targetAnchor */}
      {/* Background glow path */}
      <path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth="6"
        strokeLinecap="round"
        opacity={0.35}
        className="animate-pulse"
        style={{ filter: `drop-shadow(0 0 8px ${lineColor})` }}
      />
      {/* Foreground dashed dynamic path */}
      <path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth="3.2"
        strokeDasharray="6 4"
        strokeLinecap="round"
      />

      {/* 2. Titik Asal pada Child Node (Anchor yang aktif) */}
      <OriginAnchorPoint x={sx} y={sy} />

      {/* 3. Visual Feedback pada Target Node saat kursor mendekati node lain */}
      {hoveredTargetNode && (
        <g>
          {/* Snap Aura di sekeliling node target */}
          <TargetNodeSnapAura
            hoveredTargetNode={hoveredTargetNode}
            isValidTarget={isValidTarget}
          />

          {/* 4 Titik Anchor pada Node Target: Atas, Bawah, Kiri, Kanan */}
          <TargetNodeAnchorPoints
            hoveredTargetNode={hoveredTargetNode}
            isValidTarget={isValidTarget}
            isSnapped={isSnapped}
            targetAnchor={targetAnchor}
          />

          {/* Floating Guidance Badge di atas target node */}
          <TargetGuidanceBadge
            dragState={dragState}
            hoveredTargetNode={hoveredTargetNode}
            isValidTarget={isValidTarget}
            activeAnchorLabel={activeAnchorLabel}
          />
        </g>
      )}

      {/* 4. Ujung Garis Rute (Pin Handle) yang sedang ditarik */}
      <DragPinHandle x={tx} y={ty} isSnapped={isSnapped} lineColor={lineColor} />
    </g>
  );
};
