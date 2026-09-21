import React from "react";
import { MindMapNode, NodeShape } from "../../../types";
import { PositionedNode, NodeLink } from "../../../utils/mindmapLayout";
import { AnchorSide } from "./types";
import { useThemeMode } from "../../../context/ThemeModeContext";

interface NodeAnchorPointsProps {
  node: MindMapNode;
  posNode: PositionedNode;
  nodeShape: NodeShape | string;
  width: number;
  height: number;
  branchRouteColor: string;
  isHovered: boolean;
  isDragging: boolean;
  incomingLink?: NodeLink;
  hoveredAnchorSide: AnchorSide | null;
  setHoveredAnchorSide: (side: AnchorSide | null) => void;
  onStartAnchorDrag?: (
    sourceNode: PositionedNode,
    side: AnchorSide,
    e: React.PointerEvent | React.MouseEvent
  ) => void;
  onStartReparentDrag?: (
    link: NodeLink,
    e: React.PointerEvent | React.MouseEvent,
    side?: AnchorSide
  ) => void;
}

export const NodeAnchorPoints: React.FC<NodeAnchorPointsProps> = ({
  node,
  posNode,
  nodeShape,
  width,
  height,
  branchRouteColor,
  isHovered,
  isDragging,
  incomingLink,
  hoveredAnchorSide,
  setHoveredAnchorSide,
  onStartAnchorDrag,
  onStartReparentDrag,
}) => {
  const themeModeCtx = useThemeMode();
  const isLight = themeModeCtx?.isLight ?? false;
  const hw = width / 2;
  const hh = height / 2;
  let topOffset = hh;
  let bottomOffset = hh;
  let leftOffset = hw;
  let rightOffset = hw;

  if (nodeShape === "circle") {
    const radius = Math.max(hw, hh);
    topOffset = radius;
    bottomOffset = radius;
    leftOffset = radius;
    rightOffset = radius;
  } else if (nodeShape === "oval") {
    leftOffset = hw + 4;
    rightOffset = hw + 4;
  }

  const anchors: Array<{ side: AnchorSide; label: string; cx: number; cy: number }> = [
    { side: "top", label: "Atas", cx: 0, cy: -topOffset },
    { side: "bottom", label: "Bawah", cx: 0, cy: bottomOffset },
    { side: "left", label: "Kiri", cx: -leftOffset, cy: 0 },
    { side: "right", label: "Kanan", cx: rightOffset, cy: 0 },
  ];

  return (
    <g
      className="node-anchor-points"
      id={`node-anchors-${node.id}`}
      data-export-ignore="true"
    >
      {anchors.map(({ side, label, cx, cy }) => {
        const isThisAnchorHovered = hoveredAnchorSide === side;
        const showDetailed = isHovered || isThisAnchorHovered;

        return (
          <g
            key={side}
            id={`anchor-${side}-${node.id}`}
            className={`anchor-point ${
              isDragging ? "pointer-events-none" : "cursor-crosshair active:cursor-grabbing"
            }`}
            onPointerEnter={(e) => {
              e.stopPropagation();
              setHoveredAnchorSide(side);
            }}
            onPointerLeave={(e) => {
              e.stopPropagation();
              setHoveredAnchorSide(null);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              if (onStartAnchorDrag) {
                onStartAnchorDrag(posNode, side, e);
              } else if (incomingLink && onStartReparentDrag) {
                onStartReparentDrag(incomingLink, e, side);
              }
            }}
          >
            <title>{`Titik Anchor ${label} (Tarik untuk menghubungkan ke kartu lain atau memindahkan cabang)`}</title>

            {/* Area klik/hover interaktif yang nyaman */}
            <circle
              cx={cx}
              cy={cy}
              r={14}
              fill="transparent"
              className="pointer-events-auto"
            />

            {/* Halo cincin luar saat hover node atau anchor */}
            {showDetailed && (
              <circle
                cx={cx}
                cy={cy}
                r={isThisAnchorHovered ? 8.5 : 6}
                fill={
                  isThisAnchorHovered
                    ? "rgba(56, 189, 248, 0.3)"
                    : "rgba(255, 255, 255, 0.18)"
                }
                stroke={isThisAnchorHovered ? "#38bdf8" : branchRouteColor}
                strokeWidth={isThisAnchorHovered ? 1.8 : 1.2}
                className={
                  isDragging
                    ? "pointer-events-none"
                    : "transition-colors duration-150 pointer-events-none"
                }
                style={{
                  filter: isThisAnchorHovered ? "drop-shadow(0 0 6px #38bdf8)" : "none",
                }}
              />
            )}

            {/* Titik Anchor Inti */}
            <circle
              cx={cx}
              cy={cy}
              r={isThisAnchorHovered ? 5 : showDetailed ? 4 : 2.8}
              fill={
                isThisAnchorHovered
                  ? "#ffffff"
                  : showDetailed
                  ? "#38bdf8"
                  : branchRouteColor
              }
              stroke={isLight ? "#ffffff" : "#09090b"}
              strokeWidth={isThisAnchorHovered ? 2 : 1.5}
              className={
                isDragging
                  ? "pointer-events-none"
                  : "transition-colors duration-150 pointer-events-none"
              }
            />
          </g>
        );
      })}
    </g>
  );
};
