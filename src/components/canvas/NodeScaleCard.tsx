import React from "react";
import { MindMapNode } from "../../types";
import { useThemeMode } from "../../context/ThemeModeContext";

export interface NodeScaleCardProps {
  node: MindMapNode;
  width: number;
  height: number;
  currentScale: number;
  scalePercent: number;
  toggleScaleMenu: (id: string) => void;
  onUpdateNodeScale?: (id: string, scale: number) => void;
}

const PRESET_SCALES = [
  { label: "0.8x", val: 0.8 },
  { label: "1.0x", val: 1.0 },
  { label: "1.2x", val: 1.2 },
  { label: "1.5x", val: 1.5 },
  { label: "2.0x", val: 2.0 },
];

export const NodeScaleCard: React.FC<NodeScaleCardProps> = ({
  node,
  width,
  height,
  currentScale,
  scalePercent,
  toggleScaleMenu,
  onUpdateNodeScale,
}) => {
  const themeModeCtx = useThemeMode();
  const isLight = themeModeCtx?.isLight ?? false;

  const cardBg = isLight ? "#ffffff" : "#000000";
  const textColor = isLight ? "#0f172a" : "#ffffff";
  const itemBg = isLight ? "#f8fafc" : "#000000";
  const itemBorder = isLight ? "#cbd5e1" : "#334155";
  const itemText = isLight ? "#334155" : "#ffffff";

  return (
    <g
      transform={`translate(${width / 2 - 10}, ${height / 2 + 8})`}
      onClick={(e) => e.stopPropagation()}
      className="node-size-card cursor-default z-50"
    >
      {/* Card Background */}
      <rect
        x={-5}
        y={0}
        width={185}
        height={82}
        rx={10}
        fill={cardBg}
        stroke="#06b6d4"
        strokeWidth={1.5}
        style={isLight ? { filter: "drop-shadow(0 4px 6px rgba(15, 23, 42, 0.12))" } : undefined}
      />

      {/* Header Title */}
      <text
        x={6}
        y={14}
        fill={textColor}
        fontSize={8.5}
        fontWeight="bold"
        dominantBaseline="middle"
        fontFamily="sans-serif"
      >
        📐 UKURAN NODE: {scalePercent}% ({currentScale}x)
      </text>

      {/* Close Button ✕ */}
      <g
        transform="translate(166, 14)"
        onClick={(e) => {
          e.stopPropagation();
          toggleScaleMenu(node.id);
        }}
        className="cursor-pointer hover:opacity-80"
      >
        <title>Tutup Kartu Ukuran</title>
        <circle r={6} fill={cardBg} stroke={itemBorder} strokeWidth={1} />
        <text
          x={0}
          y={0}
          fill={textColor}
          fontSize={8}
          textAnchor="middle"
          dominantBaseline="central"
          fontWeight="bold"
        >
          ✕
        </text>
      </g>

      {/* Row 1: Preset Scale Chips (0.8x, 1.0x, 1.2x, 1.5x, 2.0x) */}
      {PRESET_SCALES.map((preset, idx) => {
        const isSelected = Math.abs(currentScale - preset.val) < 0.05;
        const chipX = 2 + idx * 35;
        return (
          <g
            key={preset.label}
            transform={`translate(${chipX}, 34)`}
            onClick={(e) => {
              e.stopPropagation();
              if (onUpdateNodeScale) {
                onUpdateNodeScale(node.id, preset.val);
              }
            }}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <rect
              x={0}
              y={-9}
              width={30}
              height={18}
              rx={5}
              fill={isSelected && isLight ? "#ecfeff" : itemBg}
              stroke={isSelected ? "#06b6d4" : itemBorder}
              strokeWidth={isSelected ? 1.5 : 1}
            />
            <text
              x={15}
              y={0}
              fill={isSelected ? (isLight ? "#0891b2" : "#22d3ee") : itemText}
              fontSize={8}
              fontWeight={isSelected ? "bold" : "normal"}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="sans-serif"
            >
              {preset.label}
            </text>
          </g>
        );
      })}

      {/* Row 2: Stepper controls ( - , Reset 100%, + ) */}
      {/* Stepper (-) */}
      <g
        transform="translate(20, 62)"
        onClick={(e) => {
          e.stopPropagation();
          if (onUpdateNodeScale) {
            onUpdateNodeScale(node.id, Math.max(0.5, currentScale - 0.1));
          }
        }}
        className="cursor-pointer hover:scale-110 transition-transform"
      >
        <title>Perkecil (-10%)</title>
        <rect x={-14} y={-8} width={28} height={16} rx={4} fill={itemBg} stroke={itemBorder} strokeWidth={1} />
        <text
          x={0}
          y={0}
          fill={itemText}
          fontSize={10}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
        >
          −
        </text>
      </g>

      {/* Reset Button */}
      <g
        transform="translate(86, 62)"
        onClick={(e) => {
          e.stopPropagation();
          if (onUpdateNodeScale) {
            onUpdateNodeScale(node.id, 1.0);
          }
        }}
        className="cursor-pointer hover:scale-105 transition-transform"
      >
        <title>Reset ke Ukuran Normal (1.0x)</title>
        <rect
          x={-32}
          y={-8}
          width={64}
          height={16}
          rx={4}
          fill={itemBg}
          stroke={itemBorder}
          strokeWidth={1}
        />
        <text
          x={0}
          y={0}
          fill={itemText}
          fontSize={8}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="sans-serif"
        >
          ↺ Reset 100%
        </text>
      </g>

      {/* Stepper (+) */}
      <g
        transform="translate(152, 62)"
        onClick={(e) => {
          e.stopPropagation();
          if (onUpdateNodeScale) {
            onUpdateNodeScale(node.id, Math.min(2.5, currentScale + 0.1));
          }
        }}
        className="cursor-pointer hover:scale-110 transition-transform"
      >
        <title>Perbesar (+10%)</title>
        <rect x={-14} y={-8} width={28} height={16} rx={4} fill={itemBg} stroke="#06b6d4" strokeWidth={1} />
        <text
          x={0}
          y={0}
          fill={isLight ? "#0891b2" : "#ffffff"}
          fontSize={10}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
        >
          +
        </text>
      </g>
    </g>
  );
};
