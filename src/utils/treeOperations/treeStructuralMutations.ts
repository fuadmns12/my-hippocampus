import { MindMapNode, AnchorSide } from "../../types";

export function addChildInTree(
  curr: MindMapNode,
  parentId: string,
  newChild: MindMapNode
): MindMapNode {
  if (curr.id === parentId) {
    return {
      ...curr,
      collapsed: false,
      children: [...(curr.children || []), newChild],
    };
  }
  if (curr.children) {
    return {
      ...curr,
      children: curr.children.map((c) => addChildInTree(c, parentId, newChild)),
    };
  }
  return curr;
}

export function deleteNodeFromTree(
  curr: MindMapNode,
  nodeId: string
): MindMapNode {
  if (curr.children) {
    return {
      ...curr,
      children: curr.children
        .filter((c) => c.id !== nodeId)
        .map((c) => deleteNodeFromTree(c, nodeId)),
    };
  }
  return curr;
}

export function detachNodeFromTree(
  root: MindMapNode,
  nodeId: string
): { updatedRoot: MindMapNode; detachedNode: MindMapNode | null } {
  let detachedNode: MindMapNode | null = null;

  function extractNode(curr: MindMapNode): MindMapNode {
    if (curr.children) {
      const match = curr.children.find((c) => c.id === nodeId);
      if (match) {
        detachedNode = {
          ...match,
        };
      }
      return {
        ...curr,
        children: curr.children
          .filter((c) => c.id !== nodeId)
          .map(extractNode),
      };
    }
    return curr;
  }

  const updatedRoot = extractNode(root);
  return { updatedRoot, detachedNode };
}

export function cleanSubtreeInheritance(n: MindMapNode): MindMapNode {
  return {
    ...n,
    borderColor: undefined,
    color: undefined,
    bgColor: undefined,
    xOffset: undefined,
    yOffset: undefined,
    sourceAnchorSide: undefined,
    targetAnchorSide: undefined,
    collapsed: false,
    children: n.children ? n.children.map(cleanSubtreeInheritance) : undefined,
  };
}

export function reparentNodeInTree(
  root: MindMapNode,
  nodeId: string,
  newParentId: string,
  sourceAnchorSide?: AnchorSide,
  targetAnchorSide?: AnchorSide
): { updatedRoot: MindMapNode; movedNode: MindMapNode | null; sameParent?: boolean } {
  if (nodeId === newParentId) return { updatedRoot: root, movedNode: null };

  // 1. Cek apakah node ini sudah berada di bawah newParentId (pindah anchor pada parent yang sama)
  let sameParentUpdated = false;
  let targetChildNode: MindMapNode | null = null;

  function updateAnchorOnSameParent(curr: MindMapNode): MindMapNode {
    if (curr.id === newParentId && curr.children) {
      const matchIdx = curr.children.findIndex((c) => c.id === nodeId);
      if (matchIdx !== -1) {
        sameParentUpdated = true;
        const updatedChildren = [...curr.children];
        targetChildNode = {
          ...updatedChildren[matchIdx],
          sourceAnchorSide,
          targetAnchorSide,
        };
        updatedChildren[matchIdx] = targetChildNode;
        return {
          ...curr,
          children: updatedChildren,
        };
      }
    }
    if (curr.children) {
      return {
        ...curr,
        children: curr.children.map(updateAnchorOnSameParent),
      };
    }
    return curr;
  }

  const rootSameCheck = updateAnchorOnSameParent(root);
  if (sameParentUpdated && targetChildNode) {
    return { updatedRoot: rootSameCheck, movedNode: targetChildNode, sameParent: true };
  }

  // 2. Jika dipindahkan ke parent lain:
  // Bersihkan properti warna manual (borderColor & color) agar node dan seluruh anak cabangnya
  // otomatis mewarisi warna rute dan titik dote dari induk barunya
  let nodeToMove: MindMapNode | null = null;

  function extractNode(curr: MindMapNode): MindMapNode {
    if (curr.children) {
      const match = curr.children.find((c) => c.id === nodeId);
      if (match) {
        nodeToMove = {
          ...cleanSubtreeInheritance(match),
          xOffset: undefined,
          yOffset: undefined,
          sourceAnchorSide,
          targetAnchorSide,
        };
      }
      return {
        ...curr,
        children: curr.children
          .filter((c) => c.id !== nodeId)
          .map(extractNode),
      };
    }
    return curr;
  }

  const rootWithoutNode = extractNode(root);
  if (!nodeToMove) return { updatedRoot: root, movedNode: null };

  let attachSuccess = false;
  function attachToParent(curr: MindMapNode): MindMapNode {
    if (curr.id === newParentId) {
      attachSuccess = true;
      return {
        ...curr,
        collapsed: false,
        children: [...(curr.children || []), nodeToMove!],
      };
    }
    if (curr.children) {
      return {
        ...curr,
        children: curr.children.map(attachToParent),
      };
    }
    return curr;
  }

  const updatedRoot = attachToParent(rootWithoutNode);
  if (!attachSuccess) {
    return { updatedRoot: root, movedNode: null };
  }

  return { updatedRoot, movedNode: nodeToMove, sameParent: false };
}
