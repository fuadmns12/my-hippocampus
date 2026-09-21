import React from "react";
import { MindMapNode } from "../../types";
import { NodeCollapseBadge } from "./badges/NodeCollapseBadge";
import { NodeDragHandleBadge } from "./badges/NodeDragHandleBadge";
import { NodeBottomActionBadges } from "./badges/NodeBottomActionBadges";
import { NodeFocusBadges } from "./badges/NodeFocusBadges";

interface NodeActionBadgesProps {
  node: MindMapNode;
  width?: number;
  height: number;
  rightMargin: number;
  isRoot: boolean;
  isBranch: boolean;
  hasChildren: boolean;
  hasNotes: boolean;
  hasMatchingDescendants: boolean;
  matchedInNotes: boolean;
  isDragging: boolean;
  branchLinkColor?: string;
  onToggleCollapseNode: (nodeId: string) => void;
  handleStartDragNode: (
    e: React.MouseEvent | React.TouchEvent,
    node: MindMapNode
  ) => void;
  wasJustDragged?: () => boolean;
  onSelectNode: (node: MindMapNode) => void;
  onOpenNotes?: (node: MindMapNode) => void;
  isSpotlighted?: boolean;
  onToggleSpotlight?: (nodeId: string) => void;
  onDrillDownSubtree?: (nodeId: string) => void;
}

export const NodeActionBadges: React.FC<NodeActionBadgesProps> = ({
  node,
  width,
  height,
  rightMargin,
  isRoot,
  isBranch,
  hasChildren,
  hasNotes,
  hasMatchingDescendants,
  matchedInNotes,
  isDragging,
  branchLinkColor,
  onToggleCollapseNode,
  handleStartDragNode,
  wasJustDragged,
  onSelectNode,
  onOpenNotes,
  isSpotlighted,
  onToggleSpotlight,
  onDrillDownSubtree,
}) => {
  return (
    <>
      {/* Top Edge Focus & Drill-down Actions */}
      <NodeFocusBadges
        node={node}
        width={width}
        height={height}
        isRoot={isRoot}
        hasChildren={hasChildren}
        isSpotlighted={isSpotlighted}
        onToggleSpotlight={onToggleSpotlight}
        onDrillDownSubtree={onDrillDownSubtree}
        wasJustDragged={wasJustDragged}
      />

      {/* Middle-Right Collapse Badge (only shown when collapsed) */}
      <NodeCollapseBadge
        node={node}
        rightMargin={rightMargin}
        isRoot={isRoot}
        isBranch={isBranch}
        hasChildren={hasChildren}
        hasMatchingDescendants={hasMatchingDescendants}
        branchLinkColor={branchLinkColor}
        onToggleCollapseNode={onToggleCollapseNode}
        wasJustDragged={wasJustDragged}
      />

      {/* Hover/Touch Drag Handle - Dedicated Node Drag Target (only when not colliding with drill down) */}
      {!(onDrillDownSubtree && hasChildren && !isRoot) && (
        <NodeDragHandleBadge
          node={node}
          width={width}
          height={height}
          isDragging={isDragging}
          handleStartDragNode={handleStartDragNode}
        />
      )}

      {/* Bottom Action Controls: Edit, Note & Link Badges */}
      <NodeBottomActionBadges
        node={node}
        width={width}
        height={height}
        hasNotes={hasNotes}
        matchedInNotes={matchedInNotes}
        wasJustDragged={wasJustDragged}
        onSelectNode={onSelectNode}
        onOpenNotes={onOpenNotes}
      />
    </>
  );
};

