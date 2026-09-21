import React from "react";
import { NodeLink } from "../../../utils/mindmapLayout";
import { AnchorSide } from "../../../types";

interface CustomConnectionBadgeProps {
  link: NodeLink;
  midX: number;
  midY: number;
  isHoveredCustom: boolean;
  sLabel: string;
  tLabel: string;
  onReparentNode?: (
    nodeId: string,
    newParentId: string,
    sourceAnchorSide?: AnchorSide,
    targetAnchorSide?: AnchorSide
  ) => void;
  onRemoveConnection?: (connectionId: string) => void;
}

export const CustomConnectionBadge: React.FC<CustomConnectionBadgeProps> = ({
  link,
  midX,
  midY,
  isHoveredCustom,
  sLabel,
  tLabel,
  onReparentNode,
  onRemoveConnection,
}) => {
  const handleJoinBranch = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onReparentNode) return;

    const sourceIsRoot = link.source.depth === 0;
    const targetIsRoot = link.target.depth === 0;

    if (sourceIsRoot && !targetIsRoot) {
      onReparentNode(
        link.source.node.id,
        link.target.node.id,
        link.sourceAnchorSide,
        link.targetAnchorSide
      );
    } else if (targetIsRoot && !sourceIsRoot) {
      onReparentNode(
        link.target.node.id,
        link.source.node.id,
        link.targetAnchorSide,
        link.sourceAnchorSide
      );
    } else {
      onReparentNode(
        link.source.node.id,
        link.target.node.id,
        link.sourceAnchorSide,
        link.targetAnchorSide
      );
    }

    if (link.connectionId && onRemoveConnection) {
      onRemoveConnection(link.connectionId);
    }
  };

  const handleDeleteConnection = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (link.connectionId && onRemoveConnection) {
      onRemoveConnection(link.connectionId);
    }
  };

  return (
    <g
      transform={`translate(${midX}, ${midY})`}
      className="cursor-pointer pointer-events-auto select-none"
    >
      {/* Background pill */}
      <rect
        x="-76"
        y="-12"
        width="152"
        height="24"
        rx="12"
        fill="#09090b"
        stroke={isHoveredCustom ? "#10b981" : "rgba(6, 182, 212, 0.55)"}
        strokeWidth="1.2"
        style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }}
      />

      {/* Tombol Gabung sebagai Cabang */}
      {onReparentNode && (
        <g
          transform="translate(-34, 0)"
          className="group/join cursor-pointer"
          onClick={handleJoinBranch}
        >
          <rect
            x="-34"
            y="-9"
            width="68"
            height="18"
            rx="9"
            fill="#064e3b"
            stroke="#10b981"
            strokeWidth="1"
            className="transition-colors group-hover/join:fill-[#047857] group-hover/join:stroke-white"
          />
          <text
            x="0"
            y="3.5"
            textAnchor="middle"
            fill="#6ee7b7"
            fontSize="9.5"
            fontWeight="700"
          >
            🌿 Gabung
          </text>
          <title>{`Jadikan "${link.source.node.label}" sebagai cabang dari "${link.target.node.label}" (semua sub-cabang ikut & menyesuaikan warna)`}</title>
        </g>
      )}

      {/* Indikator Arah Relasi */}
      <text
        x="18"
        y="3.5"
        textAnchor="middle"
        fill="#67e8f9"
        fontSize="9"
        fontWeight="600"
        className="pointer-events-none"
      >
        {`${sLabel[0]}➔${tLabel[0]}`}
      </text>

      {/* Tombol Hapus (×) Interaktif */}
      <g
        transform="translate(58, 0)"
        className="group/del cursor-pointer"
        onClick={handleDeleteConnection}
      >
        <circle
          cx="0"
          cy="0"
          r="8.5"
          fill={isHoveredCustom ? "#f43f5e" : "#27272a"}
          stroke="#ffffff"
          strokeWidth="0.8"
          className="transition-colors group-hover/del:fill-[#e11d48]"
        />
        <text
          x="0"
          y="3"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="9.5"
          fontWeight="bold"
        >
          ×
        </text>
        <title>{`Hapus koneksi antara [${sLabel}] "${link.source.node.label}" dan [${tLabel}] "${link.target.node.label}"`}</title>
      </g>
    </g>
  );
};
