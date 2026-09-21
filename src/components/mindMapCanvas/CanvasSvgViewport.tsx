import React from "react";
import { CanvasLinksLayer } from "../canvas/CanvasLinksLayer";
import { CanvasBoundaryHullsLayer } from "../canvas/boundaries";
import { ReparentDragOverlay } from "../canvas/ReparentDragOverlay";
import { CanvasNodesLayer } from "./CanvasNodesLayer";
import { DropTargetIndicator } from "./DropTargetIndicator";
import { CanvasSvgViewportProps } from "./viewportTypes";

export type { CanvasSvgViewportProps };

export const CanvasSvgViewport: React.FC<CanvasSvgViewportProps> = ({
  svgRef,
  gRef,
  pan,
  zoom,
  boundaries,
  showBranchBoundaries,
  onSelectBoundary,
  spotlightNodeIds,
  onToggleSpotlight,
  onDrillDownSubtree,
  links,
  connectorStyle,
  layout,
  palette,
  relatedNodeIds,
  hoveredNodeId,
  isSearchActive,
  searchRouteLinkIds,
  isMyVersion,
  getBranchStyle,
  onReparentNode,
  onAddConnection,
  onRemoveConnection,
  onDetachNodeAsRoot,
  hoveredEndpointLinkId,
  setHoveredEndpointLinkId,
  reparentDragState,
  handleStartReparentDrag,
  handleStartAnchorDrag,
  nodes,
  nodeShape,
  searchQuery,
  pinnedNodeId,
  activeScaleMenuId,
  searchRouteNodeIds,
  draggingNodeId,
  incomingLinksMap,
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
  dropTargetCandidate,
}) => {
  return (
    <svg
      ref={svgRef}
      className="w-full h-full overflow-visible"
      viewBox="0 0 1600 1200"
    >
      <g
        ref={gRef}
        transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
      >
        {/* Visual Boundary / Cloud Hulls Layer */}
        <CanvasBoundaryHullsLayer
          nodes={nodes}
          nodeShape={nodeShape}
          palette={palette}
          boundaries={boundaries}
          showBranchBoundaries={showBranchBoundaries}
          getBranchStyle={getBranchStyle}
          spotlightNodeIds={spotlightNodeIds}
          onSelectBoundary={onSelectBoundary}
        />

        {/* Connecting Lines Layer */}
        <CanvasLinksLayer
          links={links}
          connectorStyle={connectorStyle}
          layout={layout}
          palette={palette}
          relatedNodeIds={relatedNodeIds}
          hoveredNodeId={hoveredNodeId}
          isSearchActive={isSearchActive}
          searchRouteLinkIds={searchRouteLinkIds}
          isMyVersion={isMyVersion}
          getBranchStyle={getBranchStyle}
          onStartReparentDrag={
            onReparentNode || onAddConnection ? handleStartReparentDrag : undefined
          }
          onRemoveConnection={onRemoveConnection}
          onDetachNodeAsRoot={onDetachNodeAsRoot}
          onReparentNode={onReparentNode}
          hoveredEndpointLinkId={hoveredEndpointLinkId}
          setHoveredEndpointLinkId={setHoveredEndpointLinkId}
          draggingLinkId={reparentDragState?.linkId}
          spotlightNodeIds={spotlightNodeIds}
        />

        {/* Native SVG Nodes Layer */}
        <CanvasNodesLayer
          nodes={nodes}
          nodeShape={nodeShape}
          palette={palette}
          searchQuery={searchQuery}
          hoveredNodeId={hoveredNodeId}
          pinnedNodeId={pinnedNodeId}
          activeScaleMenuId={activeScaleMenuId}
          isSearchActive={isSearchActive}
          searchRouteNodeIds={searchRouteNodeIds}
          draggingNodeId={draggingNodeId}
          relatedNodeIds={relatedNodeIds}
          incomingLinksMap={incomingLinksMap}
          onReparentNode={onReparentNode}
          handleStartReparentDrag={handleStartReparentDrag}
          handleStartAnchorDrag={handleStartAnchorDrag}
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

        {/* Drop-to-Reparent Target Visual Indicator */}
        <DropTargetIndicator
          dropTargetCandidate={dropTargetCandidate}
          draggingNodeId={draggingNodeId}
        />

        {/* Reparenting Route Drag Overlay */}
        <ReparentDragOverlay
          dragState={reparentDragState}
          connectorStyle={connectorStyle}
        />
      </g>
    </svg>
  );
};
