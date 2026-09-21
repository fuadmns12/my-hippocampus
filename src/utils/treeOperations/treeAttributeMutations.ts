import { MindMapNode } from "../../types";

export function updateNodeInTree(
  curr: MindMapNode,
  updatedNode: MindMapNode
): MindMapNode {
  if (curr.id === updatedNode.id) {
    const result: MindMapNode = {
      ...curr,
      label: updatedNode.label,
      subtitle: updatedNode.subtitle || undefined,
      emoji: updatedNode.emoji || undefined,
      bgColor: updatedNode.bgColor || undefined,
      borderColor: updatedNode.borderColor || undefined,
      color: updatedNode.color || updatedNode.borderColor || undefined,
    };
    if (!updatedNode.emoji) delete result.emoji;
    if (!updatedNode.subtitle) delete result.subtitle;
    if (!updatedNode.bgColor) delete result.bgColor;
    if (!updatedNode.borderColor) delete result.borderColor;
    if (!updatedNode.color && !updatedNode.borderColor) delete result.color;
    return result;
  }
  if (curr.children) {
    return {
      ...curr,
      children: curr.children.map((child) => updateNodeInTree(child, updatedNode)),
    };
  }
  return curr;
}

export function updateNotesInTree(
  curr: MindMapNode,
  nodeId: string,
  notes: MindMapNode["notes"]
): MindMapNode {
  if (curr.id === nodeId) {
    return { ...curr, notes };
  }
  if (curr.children) {
    return {
      ...curr,
      children: curr.children.map((c) => updateNotesInTree(c, nodeId, notes)),
    };
  }
  return curr;
}

export function toggleCollapseInTree(
  curr: MindMapNode,
  nodeId: string
): MindMapNode {
  if (curr.id === nodeId) {
    return { ...curr, collapsed: !curr.collapsed };
  }
  if (curr.children) {
    return {
      ...curr,
      children: curr.children.map((c) => toggleCollapseInTree(c, nodeId)),
    };
  }
  return curr;
}

export function updateOffsetInTree(
  curr: MindMapNode,
  nodeId: string,
  xOffset: number,
  yOffset: number
): MindMapNode {
  const roundedX = Math.round(xOffset);
  const roundedY = Math.round(yOffset);
  if (curr.id === nodeId) {
    return {
      ...curr,
      xOffset: roundedX,
      yOffset: roundedY,
      sourceAnchorSide: curr.sourceAnchorSide,
      targetAnchorSide: curr.targetAnchorSide,
    };
  }
  if (curr.children) {
    return {
      ...curr,
      children: curr.children.map((c) =>
        updateOffsetInTree(c, nodeId, roundedX, roundedY)
      ),
    };
  }
  return curr;
}

export function updateScaleInTree(
  curr: MindMapNode,
  nodeId: string,
  scale: number
): MindMapNode {
  if (curr.id === nodeId) {
    return { ...curr, scale };
  }
  if (curr.children) {
    return {
      ...curr,
      children: curr.children.map((c) => updateScaleInTree(c, nodeId, scale)),
    };
  }
  return curr;
}

export function clearOffsetsInTree(curr: MindMapNode): MindMapNode {
  const { xOffset, yOffset, ...rest } = curr;
  return {
    ...rest,
    children: curr.children ? curr.children.map(clearOffsetsInTree) : undefined,
  };
}
