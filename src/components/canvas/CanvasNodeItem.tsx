import React from "react";
import { NodeResizeSystem } from "./NodeResizeSystem";
import { NodeActionBadges } from "./NodeActionBadges";
import { NodeGlowAura } from "./NodeGlowAura";
import { NodeLineageDots } from "./NodeLineageDots";
import { useCanvasNodeState } from "./useCanvasNodeState";
import {
  CanvasNodeItemProps,
  NodeCardSurface,
  NodeAnchorPoints,
  NodeTextContent,
} from "./nodeItem";

export type { CanvasNodeItemProps };

export const CanvasNodeItem = React.memo<CanvasNodeItemProps>(({
  posNode,
  nodeShape,
  palette,
  searchQuery,
  hoveredNodeId,
  activeScaleMenuId,
  isOnSearchRoute = false,
  isDragging = false,
  isRelated,
  incomingLink,
  onStartReparentDrag,
  onStartAnchorDrag,
  setHoveredNodeId,
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
  const {
    node,
    x,
    y,
    width,
    height,
    depth,
    applyX,
    applyY,
    hoveredAnchorSide,
    setHoveredAnchorSide,
    isRoot,
    isBranch,
    bStyle,
    branchRouteColor,
    hasNotes,
    hasChildren,
    isHovered,
    searchResult,
    scaleFactor,
    dynamicLabelFontSize,
    dynamicSubFontSize,
    availableTextWidth,
    displayLabelText,
    displaySubText,
    isMyVersion,
    cardFill,
    cardStroke,
    cardStrokeWidth,
    cardStyle,
    isCardDark,
    labelTextColor,
    subTextColor,
    rightMargin,
    textXOffset,
    nodeOpacity,
    isGlowActive,
  } = useCanvasNodeState({
    posNode,
    nodeShape,
    palette,
    searchQuery,
    hoveredNodeId,
    isOnSearchRoute,
    isRelated,
    getBranchStyle,
    spotlightNodeIds,
  });

  return (
    <g
      id={`canvas-node-${node.id}`}
      transform={`translate(${applyX}, ${applyY})`}
      opacity={nodeOpacity}
      onMouseEnter={() => setHoveredNodeId(node.id)}
      onMouseLeave={() => setHoveredNodeId(null)}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`group transition-opacity duration-150 ${
        isDragging ? "cursor-grabbing opacity-95" : ""
      }`}
    >
      {/* Radiant Search Glow Aura around the Node Card */}
      {isGlowActive && (
        <NodeGlowAura
          nodeId={node.id}
          nodeShape={nodeShape}
          width={width}
          height={height}
          isRoot={isRoot}
          scaleFactor={scaleFactor}
          glowColor={cardStroke}
        />
      )}

      {/* Main Node Card Background with glowing border and drag/click interaction */}
      <NodeCardSurface
        node={node}
        nodeShape={nodeShape}
        width={width}
        height={height}
        isRoot={isRoot}
        cardFill={cardFill}
        cardStroke={cardStroke}
        cardStrokeWidth={cardStrokeWidth}
        cardStyle={cardStyle}
        isDragging={isDragging}
        isHovered={isHovered}
        isMyVersion={isMyVersion}
        onSelectNode={onSelectNode}
        handleStartDragNode={handleStartDragNode}
        wasJustDragged={wasJustDragged}
        x={x}
        y={y}
      />

      {/* 4 Titik Koneksi (Anchor Points): Tengah Atas, Tengah Bawah, Tengah Kiri, Tengah Kanan */}
      <NodeAnchorPoints
        node={node}
        posNode={posNode}
        nodeShape={nodeShape}
        width={width}
        height={height}
        branchRouteColor={branchRouteColor}
        isHovered={isHovered}
        isDragging={isDragging}
        incomingLink={incomingLink}
        hoveredAnchorSide={hoveredAnchorSide}
        setHoveredAnchorSide={setHoveredAnchorSide}
        onStartAnchorDrag={onStartAnchorDrag}
        onStartReparentDrag={onStartReparentDrag}
      />

      {/* Titik Jejak Induk (Parent Lineage Dot / Color Dot) di Border Atas Node */}
      <NodeLineageDots
        depth={depth}
        width={width}
        height={height}
        color={branchRouteColor}
        scaleFactor={scaleFactor}
        nodeShape={nodeShape}
      />

      {/* Interactive Label & Subtitle with ClipPath protection and drag/click interaction */}
      <NodeTextContent
        node={node}
        availableTextWidth={availableTextWidth}
        textXOffset={textXOffset}
        height={height}
        scaleFactor={scaleFactor}
        labelTextColor={labelTextColor}
        dynamicLabelFontSize={dynamicLabelFontSize}
        displayLabelText={displayLabelText}
        searchResult={searchResult}
        isRoot={isRoot}
        isBranch={isBranch}
        subTextColor={subTextColor}
        dynamicSubFontSize={dynamicSubFontSize}
        displaySubText={displaySubText}
        isCardDark={isCardDark}
        cardFill={cardFill}
        isHovered={isHovered}
        onSelectNode={onSelectNode}
        handleStartDragNode={handleStartDragNode}
        wasJustDragged={wasJustDragged}
        x={x}
        y={y}
        width={width}
      />

      {/* Corner Node Sizing Handles & Interactive Sizing Card */}
      <NodeResizeSystem
        node={node}
        width={width}
        height={height}
        isHovered={isHovered}
        isScaleMenuOpen={activeScaleMenuId === node.id}
        toggleScaleMenu={(id) =>
          setActiveScaleMenuId(activeScaleMenuId === id ? null : id)
        }
        startResize={(id, corner, xPos, yPos, scale) => {
          setResizingNodeId(id);
          setResizingCorner(corner);
          setResizeStartPos({ x: xPos, y: yPos });
          setInitialScale(scale);
        }}
        onUpdateNodeScale={onUpdateNodeScale}
      />

      {/* Action Badges (Collapse Count, Drag Target, Edit & Notes) */}
      <NodeActionBadges
        node={node}
        width={width}
        height={height}
        rightMargin={rightMargin}
        isRoot={isRoot}
        isBranch={isBranch}
        hasChildren={hasChildren}
        hasNotes={hasNotes}
        hasMatchingDescendants={searchResult.hasMatchingDescendants}
        matchedInNotes={Boolean(searchResult.matchedInNotes)}
        isDragging={isDragging}
        branchLinkColor={bStyle.link}
        onToggleCollapseNode={onToggleCollapseNode}
        handleStartDragNode={(e, n) => handleStartDragNode(e, n, x, y, width, height)}
        wasJustDragged={wasJustDragged}
        onSelectNode={onSelectNode}
        onOpenNotes={onOpenNotes}
        isSpotlighted={Boolean(spotlightNodeIds && spotlightNodeIds.has(node.id))}
        onToggleSpotlight={onToggleSpotlight}
        onDrillDownSubtree={onDrillDownSubtree}
      />
    </g>
  );
});
