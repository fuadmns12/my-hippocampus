import React from "react";
import { MindMapNode, NodeShape } from "../../../types";
import { renderNodeCardShape } from "../NodeShapeRenderer";
import { soundFx } from "../../../utils/soundEffects";

interface NodeCardSurfaceProps {
  node: MindMapNode;
  nodeShape: NodeShape | string;
  width: number;
  height: number;
  isRoot: boolean;
  cardFill: string;
  cardStroke: string;
  cardStrokeWidth: number;
  cardStyle?: React.CSSProperties;
  isDragging: boolean;
  isHovered: boolean;
  isMyVersion: boolean;
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
}

export const NodeCardSurface: React.FC<NodeCardSurfaceProps> = ({
  node,
  nodeShape,
  width,
  height,
  isRoot,
  cardFill,
  cardStroke,
  cardStrokeWidth,
  cardStyle,
  isDragging,
  isHovered,
  isMyVersion,
  onSelectNode,
  handleStartDragNode,
  wasJustDragged,
  x,
  y,
}) => {
  return (
    <g
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
      {renderNodeCardShape(
        nodeShape,
        width,
        height,
        isRoot,
        cardFill,
        cardStroke,
        cardStrokeWidth,
        `${
          isDragging
            ? "cursor-grabbing"
            : "transition-colors duration-150 cursor-pointer"
        } ${
          isHovered
            ? isMyVersion
              ? ""
              : "stroke-indigo-400 stroke-2"
            : ""
        }`,
        cardStyle
      )}
    </g>
  );
};
