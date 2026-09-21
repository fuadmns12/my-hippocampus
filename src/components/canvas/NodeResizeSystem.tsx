import React from "react";
import { MindMapNode } from "../../types";
import { NodeScaleCard } from "./NodeScaleCard";

export interface NodeResizeSystemProps {
  node: MindMapNode;
  width: number;
  height: number;
  isHovered: boolean;
  isScaleMenuOpen: boolean;
  toggleScaleMenu: (id: string) => void;
  startResize: (
    id: string,
    corner: "nw" | "ne" | "sw" | "se",
    x: number,
    y: number,
    scale: number
  ) => void;
  onUpdateNodeScale?: (id: string, scale: number) => void;
}

export const NodeResizeSystem: React.FC<NodeResizeSystemProps> = ({
  node,
  width,
  height,
  isHovered,
  isScaleMenuOpen,
  toggleScaleMenu,
  startResize,
  onUpdateNodeScale,
}) => {
  const currentScale = node.scale || 1.0;
  const scalePercent = Math.round(currentScale * 100);
  const isHandlesVisible = isHovered || isScaleMenuOpen || currentScale !== 1.0;

  const resizeCorners: Array<{
    key: "nw" | "ne" | "sw" | "se";
    x: number;
    y: number;
    cursorClass: string;
    cursorStyle: "nwse-resize" | "nesw-resize";
  }> = [
    { key: "nw", x: -width / 2, y: -height / 2, cursorClass: "cursor-nwse-resize", cursorStyle: "nwse-resize" },
    { key: "ne", x: width / 2, y: -height / 2, cursorClass: "cursor-nesw-resize", cursorStyle: "nesw-resize" },
    { key: "sw", x: -width / 2, y: height / 2, cursorClass: "cursor-nesw-resize", cursorStyle: "nesw-resize" },
    { key: "se", x: width / 2, y: height / 2, cursorClass: "cursor-nwse-resize", cursorStyle: "nwse-resize" },
  ];

  return (
    <g className="node-resize-system" data-export-ignore="true">
      {/* Invisible & subtle corner hit targets with automatic resize cursors */}
      <g
        className={`transition-opacity duration-200 ease-in-out ${
          isHandlesVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {resizeCorners.map((c) => (
          <g
            key={c.key}
            transform={`translate(${c.x}, ${c.y})`}
            onClick={(e) => {
              e.stopPropagation();
              toggleScaleMenu(node.id);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              startResize(node.id, c.key, e.clientX, e.clientY, node.scale || 1.0);
            }}
            style={{ cursor: c.cursorStyle }}
            className={`${c.cursorClass} group/corner`}
          >
            <title>Tarik ujung ini untuk mengubah ukuran kartu (Resize), atau klik untuk opsi preset</title>
            {/* Invisible expanded hit area for smooth hover & drag detection */}
            <rect
              x={-10}
              y={-10}
              width={20}
              height={20}
              fill="transparent"
            />
            {/* Minimal subtle corner dot indicator */}
            <circle
              r={3.5}
              fill={isScaleMenuOpen || currentScale !== 1.0 ? "#6366f1" : "#475569"}
              stroke="#ffffff"
              strokeWidth={1}
              className="transition-transform group-hover/corner:scale-150 group-hover/corner:fill-indigo-500 shadow-sm"
            />
          </g>
        ))}
      </g>

      {/* Interactive Sizing Card at Bottom-Right Corner */}
      {isScaleMenuOpen && (
        <NodeScaleCard
          node={node}
          width={width}
          height={height}
          currentScale={currentScale}
          scalePercent={scalePercent}
          toggleScaleMenu={toggleScaleMenu}
          onUpdateNodeScale={onUpdateNodeScale}
        />
      )}
    </g>
  );
};
