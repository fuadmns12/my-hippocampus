import React from "react";
import { MindMapNode } from "../../types";
import { useThemeMode } from "../../context/ThemeModeContext";

export interface NodePopoverOverlayProps {
  node: MindMapNode;
  height: number;
}

export const NodePopoverOverlay: React.FC<NodePopoverOverlayProps> = ({
  node,
  height,
}) => {
  const themeModeCtx = useThemeMode();
  const isLight = themeModeCtx?.isLight ?? false;

  const cardBg = isLight ? "#ffffff" : "#000000";
  const headerBg = isLight ? "#f8fafc" : "#000000";
  const titleColor = isLight ? "#0284c7" : "#ffffff";
  const textColor = isLight ? "#0f172a" : "#f8fafc";
  const subColor = isLight ? "#475569" : "#94a3b8";

  const fullText = node.emoji ? `${node.emoji} ${node.label}` : node.label;
  const words = fullText.split(" ");
  const textLines: string[] = [];
  let curr = "";
  for (const w of words) {
    if ((curr + " " + w).trim().length <= 26) {
      curr = (curr + " " + w).trim();
    } else {
      if (curr) textLines.push(curr);
      curr = w;
    }
  }
  if (curr) textLines.push(curr);

  const lineCount = Math.min(textLines.length, 3);
  const popoverHeight = 34 + lineCount * 14 + (node.subtitle ? 16 : 0);

  return (
    <g
      transform={`translate(0, ${-height / 2 - popoverHeight - 8})`}
      className="popover-card cursor-default z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Popover Background */}
      <rect
        x={-115}
        y={0}
        width={230}
        height={popoverHeight}
        rx={10}
        fill={cardBg}
        stroke="#06b6d4"
        strokeWidth={1.5}
        style={isLight ? { filter: "drop-shadow(0 4px 6px rgba(15, 23, 42, 0.12))" } : undefined}
      />
      {/* Popover Header */}
      <rect
        x={-115}
        y={0}
        width={230}
        height={24}
        rx={10}
        fill={headerBg}
      />
      <rect
        x={-115}
        y={14}
        width={230}
        height={10}
        fill={headerBg}
      />

      {/* Header Title */}
      <text
        x={-105}
        y={12}
        fill={titleColor}
        fontSize={9}
        fontWeight="bold"
        dominantBaseline="middle"
        fontFamily="sans-serif"
      >
        ✨ TEKS LENGKAP
      </text>

      {/* Label Text Lines */}
      <text
        x={-105}
        y={36}
        fill={textColor}
        fontSize={10}
        fontWeight="600"
        fontFamily="sans-serif"
      >
        {textLines.slice(0, 3).map((line, idx) => (
          <tspan key={idx} x={-105} dy={idx === 0 ? 0 : 13}>
            {line}
          </tspan>
        ))}
      </text>

      {/* Subtitle Line if any */}
      {node.subtitle && (
        <text
          x={-105}
          y={36 + lineCount * 13 + 2}
          fill={subColor}
          fontSize={8.5}
          fontFamily="sans-serif"
        >
          {node.subtitle.length > 35
            ? node.subtitle.slice(0, 34) + "…"
            : node.subtitle}
        </text>
      )}
    </g>
  );
};
