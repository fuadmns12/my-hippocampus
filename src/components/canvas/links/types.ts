import React from "react";
import { ConnectorStyle, MindMapLayout, AnchorSide } from "../../../types";
import { NodeLink, AnchorPoint } from "../../../utils/mindmapLayout";
import { ThemePalette } from "../../../utils/colorThemes";

export const SIDE_NAMES: Record<AnchorSide, string> = {
  top: "Atas",
  bottom: "Bawah",
  left: "Kiri",
  right: "Kanan",
};

export interface CanvasLinksLayerProps {
  links: NodeLink[];
  connectorStyle: ConnectorStyle;
  layout: MindMapLayout;
  palette: ThemePalette;
  relatedNodeIds: Set<string>;
  hoveredNodeId: string | null;
  isSearchActive: boolean;
  searchRouteLinkIds: Set<string>;
  isMyVersion: boolean;
  getBranchStyle: (branchIndex: number) => {
    border: string;
    bg: string;
    text: string;
    link?: string;
  };
  onStartReparentDrag?: (link: NodeLink, e: React.PointerEvent | React.MouseEvent) => void;
  onRemoveConnection?: (connectionId: string) => void;
  onDetachNodeAsRoot?: (nodeId: string, currentPos?: { x: number; y: number }) => void;
  onReparentNode?: (
    nodeId: string,
    newParentId: string,
    sourceAnchorSide?: AnchorSide,
    targetAnchorSide?: AnchorSide
  ) => void;
  hoveredEndpointLinkId?: string | null;
  setHoveredEndpointLinkId?: (id: string | null) => void;
  draggingLinkId?: string | null;
  spotlightNodeIds?: Set<string> | null;
}

export interface ComputedLinkStyle {
  isCustom: boolean;
  linkColor: string;
  linkStrokeWidth: number;
  linkOpacity: number;
  linkFilter?: string;
  isHighlight: boolean;
  isSearchLink: boolean;
  sourceAnchor: AnchorPoint;
  targetAnchor: AnchorPoint;
  midX: number;
  midY: number;
  sLabel: string;
  tLabel: string;
}
