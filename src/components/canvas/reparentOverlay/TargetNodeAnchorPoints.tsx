import React from "react";
import {
  PositionedNode,
  AnchorSide,
  AnchorPoint,
  getNode4Anchors,
} from "../../../utils/mindmapLayout";
import { SIDE_NAMES } from "./constants";

interface TargetNodeAnchorPointsProps {
  hoveredTargetNode: PositionedNode;
  isValidTarget: boolean;
  isSnapped: boolean;
  targetAnchor: AnchorPoint | null;
}

export const TargetNodeAnchorPoints: React.FC<TargetNodeAnchorPointsProps> = ({
  hoveredTargetNode,
  isValidTarget,
  isSnapped,
  targetAnchor,
}) => {
  const candAnchors = getNode4Anchors(hoveredTargetNode);
  const anchorList: { side: AnchorSide; label: string; pt: { x: number; y: number } }[] = [
    { side: "top", label: SIDE_NAMES.top, pt: candAnchors.top },
    { side: "bottom", label: SIDE_NAMES.bottom, pt: candAnchors.bottom },
    { side: "left", label: SIDE_NAMES.left, pt: candAnchors.left },
    { side: "right", label: SIDE_NAMES.right, pt: candAnchors.right },
  ];

  return (
    <g className="target-4-anchors">
      {anchorList.map(({ side, label, pt }) => {
        const isThisAnchorSnapped = isSnapped && targetAnchor?.side === side;

        return (
          <g key={side} transform={`translate(${pt.x}, ${pt.y})`}>
            {/* Animasi Radar / Ping saat tersambung ke anchor ini */}
            {isThisAnchorSnapped && (
              <>
                <circle
                  cx="0"
                  cy="0"
                  r="16"
                  fill="rgba(16, 185, 129, 0.25)"
                  stroke={isValidTarget ? "#10b981" : "#f43f5e"}
                  strokeWidth="2"
                  className="animate-ping"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="10"
                  fill={isValidTarget ? "rgba(16, 185, 129, 0.4)" : "rgba(244, 63, 94, 0.4)"}
                  stroke={isValidTarget ? "#10b981" : "#f43f5e"}
                  strokeWidth="1.5"
                />
              </>
            )}

            {/* Lingkaran Titik Anchor (4 Titik Terlihat Jelas) */}
            <circle
              cx="0"
              cy="0"
              r={isThisAnchorSnapped ? 6 : 4.5}
              fill={
                isThisAnchorSnapped
                  ? "#ffffff"
                  : isValidTarget
                  ? "#10b981"
                  : "#f43f5e"
              }
              stroke="#09090b"
              strokeWidth={isThisAnchorSnapped ? 2.5 : 1.5}
              style={{
                filter: isThisAnchorSnapped
                  ? `drop-shadow(0 0 6px ${isValidTarget ? "#10b981" : "#f43f5e"})`
                  : "none",
              }}
            />

            {/* Label Sisi Anchor yang aktif */}
            {isThisAnchorSnapped && (
              <g
                transform={`translate(${
                  side === "left" ? -28 : side === "right" ? 28 : 0
                }, ${
                  side === "top" ? -18 : side === "bottom" ? 18 : 0
                })`}
              >
                <rect
                  x="-22"
                  y="-9"
                  width="44"
                  height="18"
                  rx="9"
                  fill="#09090b"
                  stroke={isValidTarget ? "#10b981" : "#f43f5e"}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="3.5"
                  textAnchor="middle"
                  fill={isValidTarget ? "#34d399" : "#fda4af"}
                  fontSize="9.5"
                  fontWeight="bold"
                >
                  {label}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
