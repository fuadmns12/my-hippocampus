import React from "react";
import { MindMapNode } from "../../../types";
import { soundFx } from "../../../utils/soundEffects";

interface NodeCollapseBadgeProps {
  node: MindMapNode;
  rightMargin: number;
  isRoot: boolean;
  isBranch: boolean;
  hasChildren: boolean;
  hasMatchingDescendants: boolean;
  branchLinkColor?: string;
  onToggleCollapseNode: (nodeId: string) => void;
  wasJustDragged?: () => boolean;
}

export const NodeCollapseBadge: React.FC<NodeCollapseBadgeProps> = ({
  node,
  rightMargin,
  isRoot,
  isBranch,
  hasChildren,
  hasMatchingDescendants,
  branchLinkColor,
  onToggleCollapseNode,
  wasJustDragged,
}) => {
  if (!hasChildren || isRoot || !node.collapsed) {
    return null;
  }

  return (
    <g
      transform={`translate(${rightMargin}, 0)`}
      onClick={(e) => {
        e.stopPropagation();
        if (wasJustDragged && wasJustDragged()) return;
        soundFx.play("toggle");
        onToggleCollapseNode(node.id);
      }}
      className={`cursor-pointer hover:scale-125 transition-transform ${
        hasMatchingDescendants ? "scale-110" : ""
      }`}
    >
      <title>
        {hasMatchingDescendants
          ? "Cabang tertutup ini memiliki sub-item yang cocok! Klik untuk membuka"
          : "Buka Cabang"}
      </title>
      {hasMatchingDescendants && (
        <circle
          r={13}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={2}
          className="animate-ping"
        />
      )}
      <circle
        r={9}
        fill={
          hasMatchingDescendants
            ? "#0891b2"
            : isBranch
            ? branchLinkColor || "#6366f1"
            : "#475569"
        }
        stroke={hasMatchingDescendants ? "#22d3ee" : undefined}
        strokeWidth={hasMatchingDescendants ? 1.5 : 0}
        style={
          hasMatchingDescendants
            ? { filter: "drop-shadow(0 0 6px #22d3ee)" }
            : undefined
        }
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        fontSize={9}
        fontWeight="bold"
      >
        {`+${node.children?.length}`}
      </text>
    </g>
  );
};
