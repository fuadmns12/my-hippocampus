import React from "react";
import { NodeShape } from "../../types";

export const renderNodeCardShape = (
  shape: NodeShape | string,
  w: number,
  h: number,
  isRoot: boolean,
  fill: string,
  stroke: string,
  strokeWidth: number,
  className?: string,
  style?: React.CSSProperties
) => {
  const hw = w / 2;
  const hh = h / 2;

  switch (shape) {
    case "pill":
      return (
        <rect
          x={-hw}
          y={-hh}
          width={w}
          height={h}
          rx={hh}
          ry={hh}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          className={className}
          style={style}
        />
      );
    case "sharp":
      return (
        <rect
          x={-hw}
          y={-hh}
          width={w}
          height={h}
          rx={2}
          ry={2}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          className={className}
          style={style}
        />
      );
    case "oval":
      return (
        <ellipse
          cx={0}
          cy={0}
          rx={hw + 4}
          ry={hh}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          className={className}
          style={style}
        />
      );
    case "circle": {
      const radius = Math.max(hw, hh);
      return (
        <circle
          cx={0}
          cy={0}
          r={radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          className={className}
          style={style}
        />
      );
    }
    case "hexagon": {
      const c = 14;
      const pts = `${-hw + c},${-hh} ${hw - c},${-hh} ${hw},0 ${hw - c},${hh} ${-hw + c},${hh} ${-hw},0`;
      return (
        <polygon
          points={pts}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          className={className}
          style={style}
        />
      );
    }
    case "rounded":
    default:
      return (
        <rect
          x={-hw}
          y={-hh}
          width={w}
          height={h}
          rx={isRoot ? 16 : 12}
          ry={isRoot ? 16 : 12}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          className={className}
          style={style}
        />
      );
  }
};

export const getNodeShapeMetrics = (
  shape: NodeShape | string,
  isRoot: boolean,
  isBranch: boolean,
  nodeScale: number = 1.0
) => {
  const scale = Math.max(0.4, nodeScale);
  let paddingLeft = 12;
  let paddingRight = 14;
  let fontSizeLabel = isRoot ? 13 : isBranch ? 12 : 11;
  let fontSizeSubtitle = 9;
  let maxTextChars = isRoot ? 22 : 17;
  let subtitleMaxChars = 20;

  switch (shape) {
    case "pill":
      paddingLeft = 18;
      paddingRight = 18;
      fontSizeLabel = isRoot ? 12 : isBranch ? 11 : 10;
      fontSizeSubtitle = 8.5;
      maxTextChars = isRoot ? 18 : 13;
      subtitleMaxChars = 16;
      break;
    case "sharp":
      paddingLeft = 10;
      paddingRight = 12;
      fontSizeLabel = isRoot ? 13 : isBranch ? 12 : 11;
      fontSizeSubtitle = 9;
      maxTextChars = isRoot ? 22 : 17;
      subtitleMaxChars = 20;
      break;
    case "oval":
      paddingLeft = 24;
      paddingRight = 24;
      fontSizeLabel = isRoot ? 11.5 : isBranch ? 10.5 : 9.5;
      fontSizeSubtitle = 8;
      maxTextChars = isRoot ? 15 : 11;
      subtitleMaxChars = 14;
      break;
    case "circle":
      paddingLeft = 20;
      paddingRight = 20;
      fontSizeLabel = isRoot ? 12 : isBranch ? 11 : 10;
      fontSizeSubtitle = 8.5;
      maxTextChars = isRoot ? 16 : 12;
      subtitleMaxChars = 14;
      break;
    case "hexagon":
      paddingLeft = 22;
      paddingRight = 22;
      fontSizeLabel = isRoot ? 12 : isBranch ? 11 : 10;
      fontSizeSubtitle = 8.5;
      maxTextChars = isRoot ? 17 : 13;
      subtitleMaxChars = 15;
      break;
    case "rounded":
    default:
      paddingLeft = 12;
      paddingRight = 14;
      fontSizeLabel = isRoot ? 13 : isBranch ? 12 : 11;
      fontSizeSubtitle = 9;
      maxTextChars = isRoot ? 22 : 17;
      subtitleMaxChars = 20;
      break;
  }

  return {
    paddingLeft: Math.round(paddingLeft * scale),
    paddingRight: Math.round(paddingRight * scale),
    fontSizeLabel: Math.max(7, Math.round(fontSizeLabel * scale * 10) / 10),
    fontSizeSubtitle: Math.max(6, Math.round(fontSizeSubtitle * scale * 10) / 10),
    maxTextChars,
    subtitleMaxChars,
  };
};
