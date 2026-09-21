import React from "react";
import { MindMapNode } from "../../../types";
import { soundFx } from "../../../utils/soundEffects";

interface NodeFocusBadgesProps {
  node: MindMapNode;
  width?: number;
  height: number;
  isRoot: boolean;
  hasChildren: boolean;
  isSpotlighted?: boolean;
  onToggleSpotlight?: (nodeId: string) => void;
  onDrillDownSubtree?: (nodeId: string) => void;
  wasJustDragged?: () => boolean;
}

export const NodeFocusBadges: React.FC<NodeFocusBadgesProps> = ({
  node,
  width = 120,
  height,
  isRoot,
  hasChildren,
  isSpotlighted = false,
  onToggleSpotlight,
  onDrillDownSubtree,
  wasJustDragged,
}) => {
  // If neither spotlight nor drilldown handlers are provided, skip
  if (!onToggleSpotlight && !onDrillDownSubtree) return null;

  // Position at top edge of node
  const spotlightX = -width / 4;
  const drillDownX = width / 4;
  const badgeY = -height / 2;

  return (
    <>
      {/* Spotlight / Isolation Mode Button */}
      {onToggleSpotlight && !isRoot && (
        <g
          transform={`translate(${spotlightX}, ${badgeY})`}
          data-export-ignore="true"
          onClick={(e) => {
            e.stopPropagation();
            if (wasJustDragged && wasJustDragged()) return;
            soundFx.play("click");
            onToggleSpotlight(node.id);
          }}
          className={`${
            isSpotlighted ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100"
          } cursor-pointer hover:scale-115 transition-all select-none`}
          id={`btn-spotlight-node-${node.id}`}
        >
          <title>
            {isSpotlighted
              ? "Keluar dari Mode Fokus Cabang Ini"
              : "Mode Fokus: Sorot cabang ini dan redupkan cabang lain (20% Opasitas)"}
          </title>
          <circle
            r={8.5}
            fill={isSpotlighted ? "#f59e0b" : "#18181b"}
            stroke={isSpotlighted ? "#fbbf24" : "#f59e0b"}
            strokeWidth={1.2}
            style={
              isSpotlighted
                ? { filter: "drop-shadow(0 0 6px rgba(245, 158, 11, 0.8))" }
                : undefined
            }
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill={isSpotlighted ? "#000000" : "#fbbf24"}
            fontSize={8}
            fontWeight="bold"
          >
            🔦
          </text>
        </g>
      )}

      {/* Drill-down Mode ("Masuk ke Cabang Ini") */}
      {onDrillDownSubtree && hasChildren && !isRoot && (
        <g
          transform={`translate(${drillDownX}, ${badgeY})`}
          data-export-ignore="true"
          onClick={(e) => {
            e.stopPropagation();
            if (wasJustDragged && wasJustDragged()) return;
            soundFx.play("spawn");
            onDrillDownSubtree(node.id);
          }}
          className="opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-115 transition-all select-none"
          id={`btn-drilldown-node-${node.id}`}
        >
          <title>Masuk ke Cabang Ini: Jadikan cabang ini sebagai fokus utama kanvas (Drill-Down)</title>
          <circle
            r={8.5}
            fill="#0891b2"
            stroke="#22d3ee"
            strokeWidth={1.2}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill="#ffffff"
            fontSize={8}
            fontWeight="bold"
          >
            🔍
          </text>
        </g>
      )}
    </>
  );
};
