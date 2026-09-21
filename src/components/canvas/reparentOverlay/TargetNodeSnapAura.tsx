import React from "react";
import { PositionedNode } from "../../../utils/mindmapLayout";

interface TargetNodeSnapAuraProps {
  hoveredTargetNode: PositionedNode;
  isValidTarget: boolean;
}

export const TargetNodeSnapAura: React.FC<TargetNodeSnapAuraProps> = ({
  hoveredTargetNode,
  isValidTarget,
}) => {
  const isCircle = hoveredTargetNode.shape === "circle";
  const cx = hoveredTargetNode.x + (hoveredTargetNode.node.xOffset || 0);
  const cy = hoveredTargetNode.y + (hoveredTargetNode.node.yOffset || 0);
  const strokeColor = isValidTarget ? "#10b981" : "#f43f5e";
  const fillColor = isValidTarget ? "rgba(16, 185, 129, 0.08)" : "rgba(244, 63, 94, 0.08)";

  if (isCircle) {
    const radius = Math.max(hoveredTargetNode.width / 2, hoveredTargetNode.height / 2) + 8;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeDasharray={isValidTarget ? "6 4" : "4 4"}
        className="animate-pulse"
        style={{ filter: `drop-shadow(0 0 10px ${strokeColor})` }}
      />
    );
  }

  const w = hoveredTargetNode.width + 16;
  const h = hoveredTargetNode.height + 16;
  const rx = 20;

  return (
    <rect
      x={cx - w / 2}
      y={cy - h / 2}
      width={w}
      height={h}
      rx={rx}
      ry={rx}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth="2.5"
      strokeDasharray={isValidTarget ? "6 4" : "4 4"}
      className="animate-pulse"
      style={{ filter: `drop-shadow(0 0 10px ${strokeColor})` }}
    />
  );
};
