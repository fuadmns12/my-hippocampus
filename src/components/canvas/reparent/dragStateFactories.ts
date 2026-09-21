import {
  PositionedNode,
  NodeLink,
  getNode4Anchors,
  selectOptimal4PointPair,
  AnchorPoint,
  AnchorSide,
} from "../../../utils/mindmapLayout";
import { MindMapLayout, ConnectorStyle } from "../../../types";
import { ReparentDragState } from "./types";

export interface CreateAnchorDragParams {
  sourceNode: PositionedNode;
  side: AnchorSide;
  pointerPos: { x: number; y: number };
  connectorStyle: ConnectorStyle;
  layout: MindMapLayout;
}

export function createAnchorDragState({
  sourceNode,
  side,
  pointerPos,
  connectorStyle,
  layout,
}: CreateAnchorDragParams): ReparentDragState {
  const anchors = getNode4Anchors(sourceNode);
  const sourceAnchor = anchors[side];

  return {
    mode: "connect",
    linkId: `drag-anchor-${sourceNode.node.id}-${side}`,
    sourceNode,
    sourceAnchorSide: side,
    childNode: sourceNode,
    oldParentNode: sourceNode,
    childAnchor: sourceAnchor,
    currentPointer: pointerPos,
    hoveredTargetNode: null,
    targetAnchor: null,
    isValidTarget: false,
    isSnapped: false,
    connectorStyle,
    layout,
  };
}

export interface CreateReparentDragParams {
  link: NodeLink;
  pointerPos: { x: number; y: number };
  connectorStyle: ConnectorStyle;
  layout: MindMapLayout;
  forcedChildSide?: AnchorSide;
}

export function createReparentOrRouteDragState({
  link,
  pointerPos,
  connectorStyle,
  layout,
  forcedChildSide,
}: CreateReparentDragParams): ReparentDragState {
  if (link.isCustomConnection) {
    const sourceAnchors = getNode4Anchors(link.source);
    const sourceSide = link.sourceAnchorSide || "right";
    const sourceAnchor = sourceAnchors[sourceSide];

    return {
      mode: "connect",
      linkId: link.id,
      sourceNode: link.source,
      sourceAnchorSide: sourceSide,
      childNode: link.source,
      oldParentNode: link.source,
      childAnchor: sourceAnchor,
      currentPointer: pointerPos,
      hoveredTargetNode: null,
      targetAnchor: null,
      isValidTarget: false,
      isSnapped: false,
      connectorStyle,
      layout,
      existingCustomConnectionId: link.connectionId,
    };
  }

  // Hitung 4 anchor pada childNode
  const childAnchors = getNode4Anchors(link.target);
  let childAnchor: AnchorPoint;

  if (forcedChildSide && childAnchors[forcedChildSide]) {
    childAnchor = childAnchors[forcedChildSide];
  } else {
    const { targetAnchor } = selectOptimal4PointPair(link.source, link.target, layout);
    childAnchor = targetAnchor;
  }

  return {
    mode: "reparent",
    linkId: link.id,
    sourceNode: link.target,
    sourceAnchorSide: childAnchor.side,
    childNode: link.target,
    oldParentNode: link.source,
    childAnchor,
    currentPointer: pointerPos,
    hoveredTargetNode: null,
    targetAnchor: null,
    isValidTarget: false,
    isSnapped: false,
    connectorStyle,
    layout,
  };
}
