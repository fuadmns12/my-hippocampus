import { BoundaryGroup, NodeShape } from "../../../types";
import { PositionedNode } from "../../../utils/mindmapLayout";
import { ThemePalette } from "../../../utils/colorThemes";

export interface CanvasBoundaryHullsLayerProps {
  nodes: PositionedNode[];
  nodeShape?: NodeShape | string;
  palette: ThemePalette;
  boundaries?: BoundaryGroup[];
  showBranchBoundaries?: boolean;
  getBranchStyle: (branchIndex: number) => {
    border: string;
    bg: string;
    text: string;
    link?: string;
  };
  spotlightNodeIds?: Set<string> | null;
  onSelectBoundary?: (boundaryId: string, nodeIds: string[]) => void;
}
