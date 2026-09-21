import React from "react";
import { MindMapNode, NodeShape, AnchorSide } from "../../types";
import { PositionedNode, NodeLink } from "../../utils/mindmapLayout";
import { ThemePalette } from "../../utils/colorThemes";
import { CanvasNodeItem } from "../canvas/CanvasNodeItem";

interface CanvasNodesLayerProps {
  nodes: PositionedNode[];
  nodeShape?: NodeShape;
  palette: ThemePalette;
  searchQuery: string;
  hoveredNodeId: string | null;
  pinnedNodeId: string | null;
  activeScaleMenuId: string | null;
  isSearchActive: boolean;
  searchRouteNodeIds: Set<string>;
  draggingNodeId: string | null;
  relatedNodeIds: Set<string>;
  incomingLinksMap: Map<string, NodeLink>;
  onReparentNode?: (
    nodeId: string,
    newParentId: string,
    sourceAnchorSide?: AnchorSide,
    targetAnchorSide?: AnchorSide
  ) => void;
  handleStartReparentDrag: (
    link: NodeLink,
    e: React.PointerEvent | React.MouseEvent,
    side?: AnchorSide
  ) => void;
  handleStartAnchorDrag: (
    sourceNode: PositionedNode,
    side: AnchorSide,
    e: React.PointerEvent | React.MouseEvent
  ) => void;
  setHoveredNodeId: (id: string | null) => void;
  setPinnedNodeId: (id: string | null) => void;
  setActiveScaleMenuId: (id: string | null) => void;
  onSelectNode: (node: MindMapNode) => void;
  onOpenNotes?: (node: MindMapNode) => void;
  onToggleCollapseNode: (nodeId: string) => void;
  handleStartDragNode: (
    e: React.MouseEvent | React.TouchEvent,
    node: MindMapNode,
    baseX?: number,
    baseY?: number,
    width?: number,
    height?: number
  ) => void;
  wasJustDragged?: () => boolean;
  setResizingNodeId: (id: string | null) => void;
  setResizingCorner: (corner: "nw" | "ne" | "sw" | "se") => void;
  setResizeStartPos: (pos: { x: number; y: number }) => void;
  setInitialScale: (scale: number) => void;
  onUpdateNodeScale?: (nodeId: string, scale: number) => void;
  getBranchStyle: (branchIndex: number) => { link?: string };
  spotlightNodeIds?: Set<string> | null;
  onToggleSpotlight?: (nodeId: string) => void;
  onDrillDownSubtree?: (nodeId: string) => void;
}

export const CanvasNodesLayer = React.memo<CanvasNodesLayerProps>(({
  nodes,
  nodeShape = "rounded",
  palette,
  searchQuery,
  hoveredNodeId,
  pinnedNodeId,
  activeScaleMenuId,
  isSearchActive,
  searchRouteNodeIds,
  draggingNodeId,
  relatedNodeIds,
  incomingLinksMap,
  onReparentNode,
  handleStartReparentDrag,
  handleStartAnchorDrag,
  setHoveredNodeId,
  setPinnedNodeId,
  setActiveScaleMenuId,
  onSelectNode,
  onOpenNotes,
  onToggleCollapseNode,
  handleStartDragNode,
  wasJustDragged,
  setResizingNodeId,
  setResizingCorner,
  setResizeStartPos,
  setInitialScale,
  onUpdateNodeScale,
  getBranchStyle,
  spotlightNodeIds,
  onToggleSpotlight,
  onDrillDownSubtree,
}) => {
  return (
    <g className="nodes">
      {nodes.map((posNode) => (
        <CanvasNodeItem
          key={posNode.node.id}
          posNode={posNode}
          nodeShape={nodeShape}
          palette={palette}
          searchQuery={searchQuery}
          hoveredNodeId={hoveredNodeId}
          pinnedNodeId={pinnedNodeId}
          activeScaleMenuId={activeScaleMenuId}
          isOnSearchRoute={isSearchActive && searchRouteNodeIds.has(posNode.node.id)}
          isDragging={draggingNodeId === posNode.node.id}
          isRelated={relatedNodeIds.has(posNode.node.id)}
          incomingLink={incomingLinksMap.get(posNode.node.id)}
          onStartReparentDrag={onReparentNode ? handleStartReparentDrag : undefined}
          onStartAnchorDrag={handleStartAnchorDrag}
          setHoveredNodeId={setHoveredNodeId}
          setPinnedNodeId={setPinnedNodeId}
          setActiveScaleMenuId={setActiveScaleMenuId}
          onSelectNode={onSelectNode}
          onOpenNotes={onOpenNotes}
          onToggleCollapseNode={onToggleCollapseNode}
          handleStartDragNode={handleStartDragNode}
          wasJustDragged={wasJustDragged}
          setResizingNodeId={setResizingNodeId}
          setResizingCorner={setResizingCorner}
          setResizeStartPos={setResizeStartPos}
          setInitialScale={setInitialScale}
          onUpdateNodeScale={onUpdateNodeScale}
          getBranchStyle={getBranchStyle}
          spotlightNodeIds={spotlightNodeIds}
          onToggleSpotlight={onToggleSpotlight}
          onDrillDownSubtree={onDrillDownSubtree}
        />
      ))}
    </g>
  );
});
