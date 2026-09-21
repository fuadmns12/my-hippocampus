import React from "react";

interface OriginAnchorPointProps {
  x: number;
  y: number;
}

export const OriginAnchorPoint: React.FC<OriginAnchorPointProps> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle
      cx="0"
      cy="0"
      r="8"
      fill="rgba(6, 182, 212, 0.25)"
      stroke="#06b6d4"
      strokeWidth="1.5"
    />
    <circle
      cx="0"
      cy="0"
      r="4.5"
      fill="#06b6d4"
      stroke="#ffffff"
      strokeWidth="2"
    />
  </g>
);

interface DragPinHandleProps {
  x: number;
  y: number;
  isSnapped: boolean;
  lineColor: string;
}

export const DragPinHandle: React.FC<DragPinHandleProps> = ({
  x,
  y,
  isSnapped,
  lineColor,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Glowing halo */}
    <circle
      cx="0"
      cy="0"
      r={isSnapped ? 18 : 14}
      fill={lineColor}
      opacity={0.25}
      className="animate-ping"
    />
    <circle
      cx="0"
      cy="0"
      r={isSnapped ? 10 : 8}
      fill={lineColor}
      stroke="#ffffff"
      strokeWidth="2.5"
      style={{ filter: `drop-shadow(0 0 6px ${lineColor})` }}
    />
    {/* Titik pusat */}
    <circle cx="0" cy="0" r="3" fill="#ffffff" />
  </g>
);
