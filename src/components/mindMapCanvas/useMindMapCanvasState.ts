import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { THEME_PALETTES, ThemePalette } from "../../utils/colorThemes";
import { NodeLink } from "../../utils/mindmapLayout";
import { NodeShape } from "../../types";
import { useCanvasViewport } from "../canvas/useCanvasViewport";
import { useCanvasSearch } from "../canvas/useCanvasSearch";
import { useRouteReparentDrag } from "../canvas/useRouteReparentDrag";
import { MindMapCanvasProps } from "./types";

export interface UseMindMapCanvasStateParams {
  data: MindMapCanvasProps["data"];
  layout: MindMapCanvasProps["layout"];
  theme: MindMapCanvasProps["theme"];
  connectorStyle: MindMapCanvasProps["connectorStyle"];
  nodeShape?: NodeShape | string;
  onUpdateNodeOffset: MindMapCanvasProps["onUpdateNodeOffset"];
  onUpdateNodeScale?: MindMapCanvasProps["onUpdateNodeScale"];
  onResetNodeOffsets?: MindMapCanvasProps["onResetNodeOffsets"];
  onReparentNode?: MindMapCanvasProps["onReparentNode"];
  onAddConnection?: MindMapCanvasProps["onAddConnection"];
  onRemoveConnection?: MindMapCanvasProps["onRemoveConnection"];
  svgRef: React.RefObject<SVGSVGElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  gRef: React.RefObject<SVGGElement | null>;
}

export function useMindMapCanvasState({
  data,
  layout,
  theme,
  connectorStyle,
  nodeShape = "rounded",
  onUpdateNodeOffset,
  onUpdateNodeScale,
  onResetNodeOffsets,
  onReparentNode,
  onAddConnection,
  onRemoveConnection,
  svgRef,
  containerRef,
  gRef,
}: UseMindMapCanvasStateParams) {
  const palette: ThemePalette = THEME_PALETTES[theme] || THEME_PALETTES.pastel;

  // Search, route calculations & layout generation
  const searchState = useCanvasSearch(
    data.root,
    layout,
    connectorStyle,
    data.additionalRoots,
    data.connections,
    nodeShape
  );

  // Viewport navigation, zoom, pan & interactive drag/resize
  const viewportState = useCanvasViewport({
    svgRef,
    gRef,
    containerRef,
    bounds: searchState.bounds,
    nodesLength: searchState.nodes.length,
    layout,
    dataId: data.id,
    onUpdateNodeOffset,
    onUpdateNodeScale,
    onResetNodeOffsets,
    nodes: searchState.nodes,
    onReparentNode,
  });

  // Interactive multi-anchor connection & reparenting by dragging
  const reparentState = useRouteReparentDrag({
    nodes: searchState.nodes,
    links: searchState.links,
    layout,
    connectorStyle,
    svgRef,
    gRef,
    onReparentNode,
    onAddConnection,
    onRemoveConnection,
  });

  // Listen for global fit-to-screen triggers (e.g. from Header button)
  const fitRef = useRef(viewportState.handleFitToScreen);
  fitRef.current = viewportState.handleFitToScreen;

  useEffect(() => {
    const onTriggerFit = () => {
      fitRef.current();
    };
    window.addEventListener("mindmap:fit-screen", onTriggerFit);
    return () => {
      window.removeEventListener("mindmap:fit-screen", onTriggerFit);
    };
  }, []);

  const allRoots = useMemo(
    () => [data.root, ...(data.additionalRoots || [])],
    [data.root, data.additionalRoots]
  );

  const incomingLinksMap = useMemo(() => {
    const map = new Map<string, NodeLink>();
    searchState.links.forEach((l) => {
      map.set(l.target.node.id, l);
    });
    return map;
  }, [searchState.links]);

  const getBranchStyle = useCallback(
    (branchIndex: number) => {
      const branchPalettes = palette.branchColors;
      return branchPalettes[branchIndex % branchPalettes.length];
    },
    [palette]
  );

  const isMyVersion = Boolean(
    palette.useRouteColorForBorder ||
      palette.name?.toLowerCase().includes("my version")
  );

  return {
    palette,
    searchState,
    viewportState,
    reparentState,
    allRoots,
    incomingLinksMap,
    getBranchStyle,
    isMyVersion,
  };
}
