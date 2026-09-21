import React from "react";
import { MindMapNode } from "../../../types";
import { useThemeMode } from "../../../context/ThemeModeContext";

interface NodeDragHandleBadgeProps {
  node: MindMapNode;
  width?: number;
  height: number;
  isDragging: boolean;
  handleStartDragNode: (
    e: React.MouseEvent | React.TouchEvent,
    node: MindMapNode
  ) => void;
}

export const NodeDragHandleBadge: React.FC<NodeDragHandleBadgeProps> = ({
  node,
  width = 120,
  height,
  isDragging,
  handleStartDragNode,
}) => {
  const themeModeCtx = useThemeMode();
  const isLight = themeModeCtx?.isLight ?? false;

  // Position between top anchor (cx = 0, cy = -height/2) and top-right corner resize handle (width/2, -height/2)
  const dragX = width / 4;

  return (
    <g
      transform={`translate(${dragX}, ${-height / 2})`}
      data-export-ignore="true"
      onMouseDown={(e) => {
        if (e.button === 0) {
          handleStartDragNode(e, node);
        }
      }}
      onTouchStart={(e) => {
        handleStartDragNode(e, node);
      }}
      className={`cursor-grab active:cursor-grabbing hover:scale-125 transition-transform ${
        isDragging
          ? "opacity-100 scale-125"
          : "opacity-70 sm:opacity-0 sm:group-hover:opacity-100"
      }`}
    >
      <title>Geser Kartu Ini</title>
      <circle
        r={9}
        fill={isDragging ? "#4f46e5" : (isLight ? "#ffffff" : "#0f172a")}
        stroke={isDragging ? "#818cf8" : (isLight ? "#6366f1" : "#6366f1")}
        strokeWidth={isDragging ? 2 : 1.5}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill={isLight ? "#4f46e5" : "#ffffff"}
        fontSize={9}
        fontWeight="bold"
      >
        ✥
      </text>
    </g>
  );
};
