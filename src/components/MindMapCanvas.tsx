import React, { useRef, useState, useMemo } from "react";
import { CanvasHeaderToolbar, CanvasZoomControls } from "./canvas/CanvasControls";
import { CanvasSpotlightBar, useCanvasSpotlight } from "./canvas/spotlight";
import { findNodeInTree } from "../utils/treeTraversal";
import { useThemeMode } from "../context/ThemeModeContext";
import {
  MindMapCanvasProps,
  CanvasGridPattern,
  CanvasFullscreenButton,
  CanvasSvgViewport,
  useMindMapCanvasState,
} from "./mindMapCanvas/index";

export type { MindMapCanvasProps };

export const MindMapCanvas: React.FC<MindMapCanvasProps> = ({
  data,
  layout,
  theme,
  connectorStyle,
  nodeShape = "rounded",
  isFullscreen = false,
  onToggleFullscreen,
  onSelectNode,
  onOpenNotes,
  onToggleCollapseNode,
  onReparentNode,
  onDetachNodeAsRoot,
  onAddConnection,
  onRemoveConnection,
  onUpdateNodeOffset,
  onUpdateNodeScale,
  onResetNodeOffsets,
  onSelectRoot,
  onRemoveMindMap,
  onAddNewMindMap,
  onClearCanvas,
  isClearConfirmOpen = false,
  onGenerateBranchesFromList,
  namesCount,
  svgRef,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);

  const [showBranchBoundaries, setShowBranchBoundaries] = useState<boolean>(
    data.showBranchBoundaries ?? true
  );
  const [drillDownNodeId, setDrillDownNodeId] = useState<string | null>(null);

  const effectiveRoot = useMemo(() => {
    if (!drillDownNodeId) return data.root;
    return findNodeInTree(data.root, drillDownNodeId) || data.root;
  }, [data.root, drillDownNodeId]);

  const effectiveData = useMemo(() => {
    if (!drillDownNodeId) return data;
    return { ...data, root: effectiveRoot };
  }, [data, drillDownNodeId, effectiveRoot]);

  const {
    palette,
    searchState,
    viewportState,
    reparentState,
    allRoots,
    incomingLinksMap,
    getBranchStyle,
    isMyVersion,
  } = useMindMapCanvasState({
    data: effectiveData,
    layout,
    theme,
    connectorStyle,
    nodeShape,
    onUpdateNodeOffset,
    onUpdateNodeScale,
    onResetNodeOffsets,
    onReparentNode,
    onAddConnection,
    onRemoveConnection,
    svgRef,
    containerRef,
    gRef,
  });

  const spotlight = useCanvasSpotlight(data.root, searchState.nodes, {
    drillDownNodeId,
    setDrillDownNodeId,
  });

  const themeModeCtx = useThemeMode();
  const isLightMode = themeModeCtx?.isLight ?? false;

  return (
    <div
      ref={containerRef}
      className={`${
        isFullscreen
          ? "fixed inset-0 z-40 w-screen h-screen rounded-none border-0"
          : "relative w-full h-[480px] sm:h-[600px] lg:h-[720px] rounded-2xl border border-cyan-500/40 scroll-mt-20"
      } overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing shadow-2xl transition-all ${
        isLightMode ? "bg-slate-50 border-slate-300" : palette.canvasBg
      }`}
      onMouseDown={viewportState.handleMouseDown}
      id="canvas-container"
      data-fullscreen={isFullscreen ? "true" : undefined}
    >
      {/* Background Dot Grid Pattern */}
      <CanvasGridPattern gridDotColor={isLightMode ? "#94a3b8" : palette.gridDotColor} />

      {/* Floating Canvas Header Search & Multi-Map Switcher */}
      <CanvasHeaderToolbar
        searchQuery={searchState.searchQuery}
        onSearchChange={searchState.setSearchQuery}
        matchCount={searchState.matchCount}
        allRoots={allRoots}
        activeRootId={data.activeRootId || data.root.id}
        onSelectRoot={onSelectRoot}
        onRemoveMindMap={onRemoveMindMap}
        onAddNewMindMap={onAddNewMindMap}
        onClearCanvas={onClearCanvas}
        isClearConfirmOpen={isClearConfirmOpen}
      />

      {/* Floating Spotlight / Drill-Down Indicator Bar */}
      <CanvasSpotlightBar
        spotlightNodeId={spotlight.spotlightNodeId}
        spotlightNodeLabel={spotlight.spotlightNodeLabel}
        onClearSpotlight={spotlight.clearSpotlight}
        drillDownNodeId={spotlight.drillDownNodeId}
        breadcrumbs={spotlight.breadcrumbs}
        onExitDrillDown={spotlight.exitDrillDown}
        onJumpBreadcrumb={spotlight.jumpBreadcrumb}
      />

      {/* Top Right Canvas Controls: Fullscreen Toggle */}
      {onToggleFullscreen && (
        <CanvasFullscreenButton
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
        />
      )}

      {/* Floating Zoom & Fit Controls Bottom Right */}
      <CanvasZoomControls
        zoom={viewportState.zoom}
        onZoomIn={() => viewportState.setZoom((z) => Math.min(4.0, z * 1.15))}
        onZoomOut={() => viewportState.setZoom((z) => Math.max(0.1, z * 0.85))}
        onFitToScreen={viewportState.handleFitToScreen}
        onResetNodeOffsets={viewportState.handleResetNodeOffsets}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
        showBranchBoundaries={showBranchBoundaries}
        onToggleBoundaries={() => setShowBranchBoundaries((prev) => !prev)}
      />

      {/* Viewport Transformation Wrapper & SVG Layers */}
      <CanvasSvgViewport
        svgRef={svgRef}
        gRef={gRef}
        pan={viewportState.pan}
        zoom={viewportState.zoom}
        boundaries={data.boundaries}
        showBranchBoundaries={showBranchBoundaries}
        spotlightNodeIds={spotlight.spotlightNodeIds}
        onToggleSpotlight={spotlight.toggleSpotlightNode}
        onDrillDownSubtree={spotlight.drillDown}
        links={searchState.links}
        connectorStyle={connectorStyle}
        layout={layout}
        palette={palette}
        relatedNodeIds={searchState.relatedNodeIds}
        hoveredNodeId={searchState.hoveredNodeId}
        isSearchActive={searchState.isSearchActive}
        searchRouteLinkIds={searchState.searchRouteLinkIds}
        isMyVersion={isMyVersion}
        getBranchStyle={getBranchStyle}
        onReparentNode={onReparentNode}
        onAddConnection={onAddConnection}
        onRemoveConnection={onRemoveConnection}
        onDetachNodeAsRoot={onDetachNodeAsRoot}
        hoveredEndpointLinkId={reparentState.hoveredEndpointLinkId}
        setHoveredEndpointLinkId={reparentState.setHoveredEndpointLinkId}
        reparentDragState={reparentState.reparentDragState}
        handleStartReparentDrag={reparentState.handleStartReparentDrag}
        handleStartAnchorDrag={reparentState.handleStartAnchorDrag}
        nodes={searchState.nodes}
        nodeShape={nodeShape}
        searchQuery={searchState.searchQuery}
        pinnedNodeId={searchState.pinnedNodeId}
        activeScaleMenuId={viewportState.activeScaleMenuId}
        searchRouteNodeIds={searchState.searchRouteNodeIds}
        draggingNodeId={viewportState.draggingNodeId}
        incomingLinksMap={incomingLinksMap}
        setHoveredNodeId={searchState.setHoveredNodeId}
        setPinnedNodeId={searchState.setPinnedNodeId}
        setActiveScaleMenuId={viewportState.setActiveScaleMenuId}
        onSelectNode={onSelectNode}
        onOpenNotes={onOpenNotes}
        onToggleCollapseNode={onToggleCollapseNode}
        handleStartDragNode={viewportState.handleStartDragNode}
        wasJustDragged={viewportState.wasJustDragged}
        setResizingNodeId={viewportState.setResizingNodeId}
        setResizingCorner={viewportState.setResizingCorner}
        setResizeStartPos={viewportState.setResizeStartPos}
        setInitialScale={viewportState.setInitialScale}
        onUpdateNodeScale={onUpdateNodeScale}
        dropTargetCandidate={viewportState.dropTargetCandidate}
      />
    </div>
  );
};

