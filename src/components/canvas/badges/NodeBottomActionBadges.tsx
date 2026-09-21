import React from "react";
import { MindMapNode } from "../../../types";
import { soundFx } from "../../../utils/soundEffects";
import { useThemeMode } from "../../../context/ThemeModeContext";

interface NodeBottomActionBadgesProps {
  node: MindMapNode;
  width?: number;
  height: number;
  hasNotes: boolean;
  matchedInNotes: boolean;
  wasJustDragged?: () => boolean;
  onSelectNode: (node: MindMapNode) => void;
  onOpenNotes?: (node: MindMapNode) => void;
}

export const NodeBottomActionBadges: React.FC<NodeBottomActionBadgesProps> = ({
  node,
  width = 120,
  height,
  hasNotes,
  matchedInNotes,
  wasJustDragged,
  onSelectNode,
  onOpenNotes,
}) => {
  const themeModeCtx = useThemeMode();
  const isLight = themeModeCtx?.isLight ?? false;

  const hasWebLinks =
    node.notes?.some(
      (n) => /https?:\/\//i.test(n.content) || /https?:\/\//i.test(n.title)
    ) || (node.subtitle && /https?:\/\//i.test(node.subtitle));

  // Position edit icon (✎) exactly halfway between bottom anchor (0, height/2)
  // and bottom-left corner resize handle (-width/2, height/2)
  const editX = -width / 4;
  const notesX = width / 4;

  return (
    <>
      {/* Edit Button */}
      <g
        transform={`translate(${editX}, ${height / 2})`}
        data-export-ignore="true"
        onClick={(e) => {
          e.stopPropagation();
          if (wasJustDragged && wasJustDragged()) return;
          soundFx.play("click");
          onSelectNode(node);
        }}
        className="opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-110 transition-all"
        id={`btn-edit-node-${node.id}`}
      >
        <circle
          r={9}
          fill={isLight ? "#ffffff" : "#0a0a0a"}
          stroke="#06b6d4"
          strokeWidth={1.25}
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fill={isLight ? "#0891b2" : "#ffffff"}
          fontSize={9}
          fontWeight="bold"
        >
          ✎
        </text>
      </g>

      {/* Note Button (Glowing if match is found in notes) */}
      <g
        transform={`translate(${notesX}, ${height / 2})`}
        data-export-ignore="true"
        onClick={(e) => {
          e.stopPropagation();
          if (wasJustDragged && wasJustDragged()) return;
          soundFx.play("click");
          if (onOpenNotes) {
            onOpenNotes(node);
          } else {
            onSelectNode(node);
          }
        }}
        className={`${
          hasNotes || matchedInNotes
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        } cursor-pointer hover:scale-110 transition-all ${
          matchedInNotes ? "scale-110" : ""
        }`}
        id={`btn-notes-node-${node.id}`}
      >
        <title>
          {matchedInNotes
            ? "Catatan di kartu ini cocok dengan pencarian! Klik untuk melihat"
            : "Buka Catatan (Notes)"}
        </title>
        {matchedInNotes && (
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
          fill={isLight ? "#ffffff" : "#0a0a0a"}
          stroke="#06b6d4"
          strokeWidth={matchedInNotes ? 2 : 1.25}
          style={
            matchedInNotes
              ? { filter: "drop-shadow(0 0 6px #22d3ee)" }
              : undefined
          }
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fill={isLight ? "#0891b2" : "#ffffff"}
          fontSize={9}
        >
          📝
        </text>
        {hasNotes && (
          <g transform="translate(6, -6)">
            <circle
              r={4.5}
              fill={matchedInNotes ? "#22d3ee" : "#f59e0b"}
              stroke="#0f172a"
              strokeWidth={1}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fill={matchedInNotes ? "#000000" : "#ffffff"}
              fontSize={6}
              fontWeight="bold"
            >
              {node.notes!.length > 9 ? "9+" : node.notes!.length}
            </text>
          </g>
        )}
      </g>

      {/* Link Indicator Badge if node has web links */}
      {hasWebLinks && (
        <g
          transform={`translate(${hasNotes ? notesX + 18 : notesX}, ${height / 2})`}
          data-export-ignore="true"
          onClick={(e) => {
            e.stopPropagation();
            if (wasJustDragged && wasJustDragged()) return;
            soundFx.play("click");
            if (onOpenNotes) {
              onOpenNotes(node);
            } else {
              onSelectNode(node);
            }
          }}
          className="opacity-90 hover:opacity-100 cursor-pointer hover:scale-110 transition-all"
          id={`btn-links-node-${node.id}`}
        >
          <title>
            Node ini memiliki tautan web/dokumen. Klik untuk membuka catatan
          </title>
          <circle
            r={8}
            fill="#083344"
            stroke="#06b6d4"
            strokeWidth={1}
            style={{ filter: "drop-shadow(0 0 4px rgba(6,182,212,0.5))" }}
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill="#22d3ee"
            fontSize={8}
          >
            🔗
          </text>
        </g>
      )}
    </>
  );
};
