import React from "react";
import { NodeLink } from "../../../utils/mindmapLayout";

interface DetachRouteButtonProps {
  link: NodeLink;
  midX: number;
  midY: number;
  isHoveredRoute: boolean;
  onRouteEnter: (linkId: string) => void;
  onRouteLeave: () => void;
  onDetachNodeAsRoot: (nodeId: string, currentPos?: { x: number; y: number }) => void;
}

export const DetachRouteButton: React.FC<DetachRouteButtonProps> = ({
  link,
  midX,
  midY,
  isHoveredRoute,
  onRouteEnter,
  onRouteLeave,
  onDetachNodeAsRoot,
}) => {
  return (
    <g
      transform={`translate(${midX}, ${midY})`}
      className="group cursor-pointer pointer-events-auto select-none"
      onMouseEnter={() => onRouteEnter(link.id)}
      onMouseLeave={onRouteLeave}
      onClick={(e) => {
        e.stopPropagation();
        onDetachNodeAsRoot(link.target.node.id, {
          x: link.target.x,
          y: link.target.y,
        });
      }}
    >
      {/* Area klik tak kasat mata agar mudah diklik */}
      <circle
        cx="0"
        cy="0"
        r="18"
        fill="transparent"
        className="pointer-events-all"
      />

      {/* Lingkaran Tombol (×) yang diam stabil di posisi */}
      <circle
        cx="0"
        cy="0"
        r="10"
        fill={isHoveredRoute ? "#f43f5e" : "#18181b"}
        stroke={isHoveredRoute ? "#ffffff" : "#f43f5e"}
        strokeWidth="1.4"
        style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.8))" }}
        className="transition-colors duration-150 group-hover:fill-[#e11d48] group-hover:stroke-white group-active:fill-[#be123c]"
      />
      <text
        x="0"
        y="3.5"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="12"
        fontWeight="bold"
        className="pointer-events-none"
      >
        ×
      </text>
      <title>{`Putus rute: Lepaskan "${link.target.node.label}" dari "${link.source.node.label}"`}</title>
    </g>
  );
};
