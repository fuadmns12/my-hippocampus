import React, { useState, useRef, useEffect } from "react";
import {
  CanvasLinksLayerProps,
  computeLinkStyle,
  DetachRouteButton,
  CustomConnectionBadge,
  EndpointHandlePin,
} from "./links";

export type { CanvasLinksLayerProps };

export const CanvasLinksLayer = React.memo<CanvasLinksLayerProps>(({
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
  onStartReparentDrag,
  onRemoveConnection,
  onDetachNodeAsRoot,
  onReparentNode,
  hoveredEndpointLinkId,
  setHoveredEndpointLinkId,
  draggingLinkId,
  spotlightNodeIds,
}) => {
  const [hoveredCustomLinkId, setHoveredCustomLinkId] = useState<string | null>(null);
  const [hoveredRouteLinkId, setHoveredRouteLinkId] = useState<string | null>(null);
  const isAnimatedFlow = connectorStyle === "animated-dashed";
  const isDotted = connectorStyle === "dotted";

  const routeLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleRouteEnter = (linkId: string) => {
    if (routeLeaveTimeoutRef.current) {
      clearTimeout(routeLeaveTimeoutRef.current);
      routeLeaveTimeoutRef.current = null;
    }
    setHoveredRouteLinkId(linkId);
  };

  const handleRouteLeave = () => {
    if (routeLeaveTimeoutRef.current) {
      clearTimeout(routeLeaveTimeoutRef.current);
    }
    routeLeaveTimeoutRef.current = setTimeout(() => {
      setHoveredRouteLinkId(null);
    }, 600);
  };

  useEffect(() => {
    return () => {
      if (routeLeaveTimeoutRef.current) {
        clearTimeout(routeLeaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <g className="links">
      {links.map((link) => {
        const computed = computeLinkStyle({
          link,
          layout,
          palette,
          relatedNodeIds,
          hoveredNodeId,
          isSearchActive,
          searchRouteLinkIds,
          isMyVersion,
          getBranchStyle,
          hoveredCustomLinkId,
          hoveredRouteLinkId,
          draggingLinkId,
          spotlightNodeIds,
        });

        const {
          isCustom,
          linkColor,
          linkStrokeWidth,
          linkOpacity,
          linkFilter,
          isHighlight,
          isSearchLink,
          sourceAnchor,
          midX,
          midY,
          sLabel,
          tLabel,
        } = computed;

        const isHoveredCustom = hoveredCustomLinkId === link.id;
        const isHoveredRoute = hoveredRouteLinkId === link.id;
        const isTargetNodeHovered = hoveredNodeId === link.target.node.id;
        const isHoveredHandle = hoveredEndpointLinkId === link.id;

        return (
          <g
            key={link.id}
            onMouseEnter={() => {
              if (isCustom) {
                setHoveredCustomLinkId(link.id);
              } else {
                handleRouteEnter(link.id);
              }
            }}
            onMouseLeave={() => {
              if (isCustom) {
                setHoveredCustomLinkId(null);
              } else {
                handleRouteLeave();
              }
            }}
          >
            {/* Search Glowing Halo along Route */}
            {isSearchLink && (
              <path
                d={link.pathD}
                fill="none"
                stroke={linkColor}
                strokeWidth={linkStrokeWidth * 2.2}
                strokeLinecap="round"
                opacity={0.35}
                className="pointer-events-none transition-opacity duration-150 animate-pulse"
                style={{ filter: "blur(3px)" }}
              />
            )}

            {/* Subtle Background Glow Path for Highlighted or Custom Connection */}
            {((isHighlight && isMyVersion && !isSearchLink) || (isCustom && isHoveredCustom)) && (
              <path
                d={link.pathD}
                fill="none"
                stroke={linkColor}
                strokeWidth={linkStrokeWidth * 2.6}
                strokeLinecap="round"
                opacity={0.4}
                className="pointer-events-none transition-opacity duration-150"
                style={{ filter: "blur(4px)" }}
              />
            )}

            {/* Primary Path */}
            <path
              d={link.pathD}
              fill="none"
              stroke={linkColor}
              strokeWidth={linkStrokeWidth}
              strokeDasharray={
                isCustom
                  ? "6,4"
                  : isAnimatedFlow
                  ? "8,6"
                  : isDotted
                  ? "6,6"
                  : "none"
              }
              strokeLinecap={isCustom || isAnimatedFlow || isDotted ? "round" : "butt"}
              opacity={linkOpacity}
              style={linkFilter ? { filter: linkFilter } : undefined}
              className={`transition-opacity duration-150 ${
                isAnimatedFlow ? "animate-flow-dash" : ""
              }`}
            />

            {/* Transparent wide path for easy hover over hierarchical route */}
            {!isCustom && onDetachNodeAsRoot && (
              <path
                d={link.pathD}
                fill="none"
                stroke="transparent"
                strokeWidth={34}
                className="cursor-pointer pointer-events-stroke"
                onMouseEnter={() => handleRouteEnter(link.id)}
                onMouseLeave={handleRouteLeave}
              />
            )}

            {/* Indikator / Tombol (×) Putus Rute untuk Hierarchical Tree Link */}
            {!isCustom && onDetachNodeAsRoot && (isHoveredRoute || isTargetNodeHovered || isHighlight) && (
              <DetachRouteButton
                link={link}
                midX={midX}
                midY={midY}
                isHoveredRoute={isHoveredRoute}
                onRouteEnter={handleRouteEnter}
                onRouteLeave={handleRouteLeave}
                onDetachNodeAsRoot={onDetachNodeAsRoot}
              />
            )}

            {/* Indicator / Badge untuk Custom Multi-Anchor Connection */}
            {isCustom && (
              <CustomConnectionBadge
                link={link}
                midX={midX}
                midY={midY}
                isHoveredCustom={isHoveredCustom}
                sLabel={sLabel}
                tLabel={tLabel}
                onReparentNode={onReparentNode}
                onRemoveConnection={onRemoveConnection}
              />
            )}

            {/* Ujung Garis Rute (Interactive Endpoint Pin Handle) */}
            {onStartReparentDrag && (
              <EndpointHandlePin
                link={link}
                sourceAnchor={sourceAnchor}
                linkColor={linkColor}
                isCustom={isCustom}
                isHoveredHandle={isHoveredHandle}
                onStartReparentDrag={onStartReparentDrag}
                onMouseEnter={() => setHoveredEndpointLinkId?.(link.id)}
                onMouseLeave={() => setHoveredEndpointLinkId?.(null)}
              />
            )}
          </g>
        );
      })}
    </g>
  );
});
