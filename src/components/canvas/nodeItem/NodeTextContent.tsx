import React from "react";
import { MindMapNode } from "../../../types";
import { soundFx } from "../../../utils/soundEffects";
import { isColorDark } from "./nodeTextFit";

interface NodeTextContentProps {
  node: MindMapNode;
  availableTextWidth: number;
  textXOffset: number;
  height: number;
  scaleFactor: number;
  labelTextColor: string;
  dynamicLabelFontSize: number;
  displayLabelText: string;
  searchResult: {
    isMatch?: boolean;
    matchedInSubtitle?: boolean;
  };
  isRoot: boolean;
  isBranch: boolean;
  subTextColor: string;
  dynamicSubFontSize: number;
  displaySubText: string;
  isCardDark?: boolean;
  cardFill?: string;
  isHovered?: boolean;
  onSelectNode: (node: MindMapNode) => void;
  handleStartDragNode: (
    e: React.MouseEvent | React.TouchEvent,
    node: MindMapNode,
    baseX?: number,
    baseY?: number,
    width?: number,
    height?: number
  ) => void;
  wasJustDragged?: () => boolean;
  x: number;
  y: number;
  width: number;
}

export const NodeTextContent: React.FC<NodeTextContentProps> = ({
  node,
  availableTextWidth,
  textXOffset,
  height,
  scaleFactor,
  labelTextColor,
  dynamicLabelFontSize,
  displayLabelText,
  searchResult,
  isRoot,
  isBranch,
  subTextColor,
  dynamicSubFontSize,
  displaySubText,
  isCardDark,
  cardFill,
  isHovered,
  onSelectNode,
  handleStartDragNode,
  wasJustDragged,
  x,
  y,
  width,
}) => {
  // Contrast color calculation:
  // If node background is dark -> text stays light/white on normal and hover.
  // If node background is light/white -> text must stay dark (#0f172a / #020617) on hover and never turn white.
  const effectiveIsDark =
    isCardDark !== undefined
      ? isCardDark
      : isColorDark(cardFill || node.bgColor);

  const hoverTextColor = effectiveIsDark ? "#ffffff" : "#020617";
  const activeTextColor = isHovered ? hoverTextColor : labelTextColor;

  const hoverSubTextColor = effectiveIsDark ? "rgba(255, 255, 255, 0.95)" : "#0f172a";
  const activeSubTextColor = isHovered ? hoverSubTextColor : subTextColor;

  return (
    <>
      <defs>
        <clipPath id={`node-text-clip-${node.id}`}>
          <rect
            x={-availableTextWidth / 2 + textXOffset - 2}
            y={-height / 2}
            width={availableTextWidth + 4}
            height={height}
          />
        </clipPath>
      </defs>

      {/* Interactive Label & Subtitle with ClipPath protection and drag/click interaction */}
      <g
        clipPath={`url(#node-text-clip-${node.id})`}
        className="cursor-pointer pointer-events-auto"
        onMouseDown={(e) => {
          if (e.button === 0) {
            handleStartDragNode(e, node, x, y, width, height);
          }
        }}
        onTouchStart={(e) => {
          handleStartDragNode(e, node, x, y, width, height);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (wasJustDragged && wasJustDragged()) return;
          soundFx.play("pop");
          onSelectNode(node);
        }}
      >
        <text
          x={textXOffset}
          y={(node.subtitle ? -6 : 0) * scaleFactor}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={activeTextColor}
          fontSize={dynamicLabelFontSize}
          style={{
            fontSize: `${dynamicLabelFontSize}px`,
          }}
          textLength={
            displayLabelText.length * dynamicLabelFontSize * 0.52 > availableTextWidth
              ? availableTextWidth
              : undefined
          }
          lengthAdjust={
            displayLabelText.length * dynamicLabelFontSize * 0.52 > availableTextWidth
              ? "spacingAndGlyphs"
              : undefined
          }
          fontWeight={searchResult.isMatch ? "800" : isRoot || isBranch ? "bold" : "600"}
          fontFamily="sans-serif"
          className={`select-none transition-colors ${
            effectiveIsDark ? "group-hover:fill-white" : "group-hover:fill-slate-950"
          }`}
        >
          {displayLabelText}
        </text>

        {/* Subtitle text */}
        {node.subtitle && (
          <text
            x={textXOffset}
            y={12 * scaleFactor}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={activeSubTextColor}
            fontSize={dynamicSubFontSize}
            style={{
              fontSize: `${dynamicSubFontSize}px`,
            }}
            textLength={
              displaySubText.length * dynamicSubFontSize * 0.5 > availableTextWidth
                ? availableTextWidth
                : undefined
            }
            lengthAdjust={
              displaySubText.length * dynamicSubFontSize * 0.5 > availableTextWidth
                ? "spacingAndGlyphs"
                : undefined
            }
            fontWeight={searchResult.matchedInSubtitle ? "bold" : "normal"}
            fontFamily="sans-serif"
            className={`select-none transition-colors ${
              effectiveIsDark ? "group-hover:fill-white" : "group-hover:fill-slate-900"
            }`}
          >
            {displaySubText}
          </text>
        )}
      </g>
    </>
  );
};
