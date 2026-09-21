import React from "react";
import { NodeLink, AnchorPoint } from "../../../utils/mindmapLayout";

interface EndpointHandlePinProps {
  link: NodeLink;
  sourceAnchor: AnchorPoint;
  linkColor: string;
  isCustom: boolean;
  isHoveredHandle: boolean;
  onStartReparentDrag: (link: NodeLink, e: React.PointerEvent | React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const EndpointHandlePin: React.FC<EndpointHandlePinProps> = ({
  link,
  sourceAnchor,
  linkColor,
  isCustom,
  isHoveredHandle,
  onStartReparentDrag,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <g
      className="route-endpoint-handle cursor-grab active:cursor-grabbing pointer-events-auto"
      onPointerDown={(e) => onStartReparentDrag(link, e)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Area klik/sentuh yang luas */}
      <circle
        cx={sourceAnchor.x}
        cy={sourceAnchor.y}
        r="18"
        fill="transparent"
        className="cursor-grab active:cursor-grabbing"
      >
        <title>{`Pindahkan Ujung Garis: Geser ke anchor Atas/Bawah/Kiri/Kanan pada cabang induk atau kartu lain`}</title>
      </circle>

      {/* Aura saat hover */}
      {isHoveredHandle && (
        <circle
          cx={sourceAnchor.x}
          cy={sourceAnchor.y}
          r="12"
          fill={linkColor}
          opacity={0.4}
          className="animate-ping pointer-events-none"
        />
      )}

      {/* Pin Ujung Garis Rute */}
      <circle
        cx={sourceAnchor.x}
        cy={sourceAnchor.y}
        r={isHoveredHandle ? 6.5 : isCustom ? 4 : 2.8}
        fill={isHoveredHandle ? "#ffffff" : linkColor}
        stroke={isHoveredHandle ? linkColor : "#09090b"}
        strokeWidth={isHoveredHandle ? 2.2 : 1.2}
        opacity={isHoveredHandle ? 1 : 0.85}
        className="transition-colors duration-150 pointer-events-none"
        style={{
          filter: isHoveredHandle
            ? `drop-shadow(0 0 6px ${linkColor})`
            : "none",
        }}
      />
    </g>
  );
};
