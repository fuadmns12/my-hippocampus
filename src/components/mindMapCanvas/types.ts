import React from "react";
import {
  MindMapData,
  MindMapNode,
  MindMapLayout,
  ColorTheme,
  ConnectorStyle,
  NodeShape,
  AnchorSide,
} from "../../types";

export interface MindMapCanvasProps {
  data: MindMapData;
  layout: MindMapLayout;
  theme: ColorTheme;
  connectorStyle: ConnectorStyle;
  nodeShape?: NodeShape;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onSelectNode: (node: MindMapNode) => void;
  onOpenNotes?: (node: MindMapNode) => void;
  onToggleCollapseNode: (nodeId: string) => void;
  onReparentNode?: (
    nodeId: string,
    newParentId: string,
    sourceAnchorSide?: AnchorSide,
    targetAnchorSide?: AnchorSide
  ) => void;
  onDetachNodeAsRoot?: (nodeId: string, currentPos?: { x: number; y: number }) => void;
  onAddConnection?: (
    sourceNodeId: string,
    sourceAnchorSide: AnchorSide,
    targetNodeId: string,
    targetAnchorSide: AnchorSide
  ) => void;
  onRemoveConnection?: (connectionId: string) => void;
  onUpdateNodeOffset: (nodeId: string, xOffset: number, yOffset: number) => void;
  onUpdateNodeScale?: (nodeId: string, scale: number) => void;
  onResetNodeOffsets?: () => void;
  onSelectRoot?: (rootId: string) => void;
  onRemoveMindMap?: (rootId: string) => void;
  onAddNewMindMap?: () => void;
  onClearCanvas?: () => void;
  isClearConfirmOpen?: boolean;
  onGenerateBranchesFromList?: () => void;
  namesCount?: number;
  svgRef: React.RefObject<SVGSVGElement | null>;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}
