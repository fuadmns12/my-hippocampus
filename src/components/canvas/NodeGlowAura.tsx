import React from "react";
import { NodeShape } from "../../types";
import { renderNodeCardShape } from "./NodeShapeRenderer";

interface NodeGlowAuraProps {
  nodeId: string;
  nodeShape: NodeShape | string;
  width: number;
  height: number;
  isRoot: boolean;
  scaleFactor: number;
  glowColor?: string;
}

export const NodeGlowAura: React.FC<NodeGlowAuraProps> = ({
  nodeId,
  nodeShape,
  width,
  height,
  isRoot,
  scaleFactor,
  glowColor = "#38bdf8",
}) => {
  return (
    <g
      className="pointer-events-none"
      id={`node-glow-aura-${nodeId}`}
      data-export-ignore="true"
    >
      {/* Outer expansive pulsing ambient halo with the node's own color */}
      {renderNodeCardShape(
        nodeShape,
        width + 16 * scaleFactor,
        height + 16 * scaleFactor,
        isRoot,
        glowColor,
        glowColor,
        1.8 * scaleFactor,
        "animate-pulse pointer-events-none opacity-20",
        {
          filter: `drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 24px ${glowColor}) blur(2px)`,
        }
      )}

      {/* Inner sharp neon halo contour with the node's own color */}
      {renderNodeCardShape(
        nodeShape,
        width + 6 * scaleFactor,
        height + 6 * scaleFactor,
        isRoot,
        glowColor,
        glowColor,
        2.2 * scaleFactor,
        "pointer-events-none opacity-30",
        {
          filter: `drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 14px ${glowColor})`,
        }
      )}
    </g>
  );
};
