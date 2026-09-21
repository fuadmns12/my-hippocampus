import React from "react";
import { PositionedNode } from "../../utils/mindmapLayout";

interface DropTargetIndicatorProps {
  dropTargetCandidate: PositionedNode | null;
  draggingNodeId: string | null;
}

export const DropTargetIndicator: React.FC<DropTargetIndicatorProps> = ({
  dropTargetCandidate,
  draggingNodeId,
}) => {
  if (!dropTargetCandidate || !draggingNodeId) return null;

  const candX = dropTargetCandidate.x + (dropTargetCandidate.node.xOffset || 0);
  const candY = dropTargetCandidate.y + (dropTargetCandidate.node.yOffset || 0);

  return (
    <g id="drop-target-candidate-indicator" className="pointer-events-none">
      {/* Pulsing highlight around candidate target */}
      <rect
        x={candX - dropTargetCandidate.width / 2 - 8}
        y={candY - dropTargetCandidate.height / 2 - 8}
        width={dropTargetCandidate.width + 16}
        height={dropTargetCandidate.height + 16}
        rx={16}
        fill="rgba(16, 185, 129, 0.15)"
        stroke="#10b981"
        strokeWidth={2.5}
        strokeDasharray="6 4"
        style={{ filter: "drop-shadow(0 0 12px rgba(16, 185, 129, 0.7))" }}
      />
      {/* Floating Reparent Badge */}
      <g transform={`translate(${candX}, ${candY - dropTargetCandidate.height / 2 - 24})`}>
        <rect
          x="-130"
          y="-13"
          width="260"
          height="26"
          rx="13"
          fill="#09090b"
          stroke="#10b981"
          strokeWidth="1.5"
          style={{ filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.8))" }}
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fill="#34d399"
          fontSize="11"
          fontWeight="600"
        >
          {`✓ Lepas untuk gabung ke "${dropTargetCandidate.node.label.slice(0, 16)}${
            dropTargetCandidate.node.label.length > 16 ? "..." : ""
          }"`}
        </text>
      </g>
    </g>
  );
};
