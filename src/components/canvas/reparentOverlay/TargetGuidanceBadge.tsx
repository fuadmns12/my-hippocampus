import React from "react";
import { PositionedNode } from "../../../utils/mindmapLayout";
import { ReparentDragState } from "../reparent";
import { SIDE_NAMES } from "./constants";

interface TargetGuidanceBadgeProps {
  dragState: ReparentDragState;
  hoveredTargetNode: PositionedNode;
  isValidTarget: boolean;
  activeAnchorLabel: string;
}

export const TargetGuidanceBadge: React.FC<TargetGuidanceBadgeProps> = ({
  dragState,
  hoveredTargetNode,
  isValidTarget,
  activeAnchorLabel,
}) => {
  const isCircle = hoveredTargetNode.shape === "circle";
  const topOffset = isCircle
    ? Math.max(hoveredTargetNode.width / 2, hoveredTargetNode.height / 2)
    : hoveredTargetNode.height / 2;
  const cx = hoveredTargetNode.x + (hoveredTargetNode.node.xOffset || 0);
  const cy = hoveredTargetNode.y + (hoveredTargetNode.node.yOffset || 0) - topOffset - 26;

  const isConnectMode = dragState.mode === "connect";
  const isMerge = dragState.isMergeAction || dragState.mode === "reparent";
  const originLabel = (
    dragState.sourceNode?.node.label ||
    dragState.childNode?.node.label ||
    "Kartu"
  ).slice(0, 16);
  const originSideLabel = SIDE_NAMES[dragState.sourceAnchorSide] || "Anchor";
  const targetSideLabel = activeAnchorLabel || "Anchor";
  const targetLabel = (hoveredTargetNode.node.label || "Kartu").slice(0, 16);

  const textMsg = isValidTarget
    ? isMerge
      ? `🌿 Gabungkan "${originLabel}" ke "${targetLabel}" (Semua cabang ikut)`
      : `🔗 Hubungkan Relasi [${originSideLabel}] "${originLabel}" ➔ [${targetSideLabel}] "${targetLabel}"`
    : dragState.invalidReason === "already_connected_hierarchy"
    ? `⚠️ Sudah terhubung oleh garis rute hierarki`
    : dragState.invalidReason === "descendant"
    ? `⚠️ Tidak dapat memindahkan ke sub-cabang turunan`
    : `⚠️ Tidak dapat menghubungkan ke bagian ini`;

  const badgeWidth = isValidTarget ? (isMerge ? 460 : 420) : 340;

  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <rect
        x={-badgeWidth / 2}
        y="-14"
        width={badgeWidth}
        height="28"
        rx="14"
        fill="#020617"
        stroke={isValidTarget ? "#10b981" : "#f43f5e"}
        strokeWidth="1.5"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.8))" }}
      />
      <text
        x="0"
        y="4.5"
        textAnchor="middle"
        fill={isValidTarget ? "#34d399" : "#fda4af"}
        fontSize="11"
        fontWeight="bold"
      >
        {textMsg}
      </text>
    </g>
  );
};
