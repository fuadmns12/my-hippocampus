import { MindMapNode, AnchorSide } from "../../types";
import {
  findNodeInTree,
  detachNodeFromTree,
  cleanSubtreeInheritance,
} from "../../utils/nodeTreeOperations";

/**
 * Memasangkan child node ke parentId tertentu dalam sebuah subtree pohon.
 */
export function attachChildToTree(
  root: MindMapNode,
  parentId: string,
  child: MindMapNode
): { updatedTree: MindMapNode; attached: boolean } {
  let attached = false;

  function traverse(curr: MindMapNode): MindMapNode {
    if (curr.id === parentId) {
      attached = true;
      return {
        ...curr,
        collapsed: false,
        children: [...(curr.children || []), child],
      };
    }
    if (curr.children && curr.children.length > 0) {
      return { ...curr, children: curr.children.map(traverse) };
    }
    return curr;
  }

  const updatedTree = traverse(root);
  return { updatedTree, attached };
}

/**
 * Membersihkan pewarisan offset dan memasang sisi anchor saat node berpindah parent.
 */
export function prepareReparentedNode(
  node: MindMapNode,
  sourceAnchorSide?: AnchorSide,
  targetAnchorSide?: AnchorSide
): MindMapNode {
  return cleanSubtreeInheritance({
    ...node,
    xOffset: undefined,
    yOffset: undefined,
    sourceAnchorSide,
    targetAnchorSide,
  });
}

export interface CrossTreeResult {
  updatedRoot: MindMapNode;
  updatedAdditional: MindMapNode[];
  movedNode: MindMapNode | null;
}

/**
 * Menangani kasus ketika root (baik additionalRoot maupun main root) dipindahkan menjadi child dari pohon lain.
 */
export function handleRootReparent(
  root: MindMapNode,
  additionalRoots: MindMapNode[],
  nodeId: string,
  newParentId: string,
  sourceAnchorSide?: AnchorSide,
  targetAnchorSide?: AnchorSide
): CrossTreeResult | null {
  // Kasus 1: nodeId adalah additionalRoot yang ingin ditempelkan ke node lain
  const addRootMatch = additionalRoots.find((r) => r.id === nodeId);
  if (addRootMatch) {
    const cleanedNode = prepareReparentedNode(addRootMatch, sourceAnchorSide, targetAnchorSide);
    const mainRes = attachChildToTree(root, newParentId, cleanedNode);

    if (mainRes.attached) {
      return {
        updatedRoot: mainRes.updatedTree,
        updatedAdditional: additionalRoots.filter((r) => r.id !== nodeId),
        movedNode: cleanedNode,
      };
    }

    let attachedInAdd = false;
    const remainingRoots = additionalRoots.filter((r) => r.id !== nodeId);
    const updatedAdditional = remainingRoots.map((r) => {
      const res = attachChildToTree(r, newParentId, cleanedNode);
      if (res.attached) attachedInAdd = true;
      return res.updatedTree;
    });

    if (attachedInAdd) {
      return {
        updatedRoot: root,
        updatedAdditional,
        movedNode: cleanedNode,
      };
    }
  }

  // Kasus 2: nodeId adalah root utama yang dipindahkan ke node dalam salah satu additionalRoot
  if (nodeId === root.id && additionalRoots.length > 0) {
    const targetRootIdx = additionalRoots.findIndex((r) => findNodeInTree(r, newParentId));
    if (targetRootIdx !== -1) {
      const cleanedNode = prepareReparentedNode(root, sourceAnchorSide, targetAnchorSide);
      const targetRoot = additionalRoots[targetRootIdx];
      const { updatedTree: newMainRoot, attached } = attachChildToTree(targetRoot, newParentId, cleanedNode);

      if (attached) {
        return {
          updatedRoot: newMainRoot,
          updatedAdditional: additionalRoots.filter((_, idx) => idx !== targetRootIdx),
          movedNode: cleanedNode,
        };
      }
    }
  }

  return null;
}

/**
 * Menangani pemindahan cabang child node dari satu pohon ke pohon lain (cross-tree).
 */
export function handleCrossTreeDetachAndAttach(
  root: MindMapNode,
  additionalRoots: MindMapNode[],
  nodeId: string,
  newParentId: string,
  sourceAnchorSide?: AnchorSide,
  targetAnchorSide?: AnchorSide
): CrossTreeResult | null {
  let extracted: MindMapNode | null = null;
  let candidateRoot = root;

  const rootDetach = detachNodeFromTree(root, nodeId);
  if (rootDetach.detachedNode) {
    candidateRoot = rootDetach.updatedRoot;
    extracted = rootDetach.detachedNode;
  }

  let candidateAdditional = [...additionalRoots];
  if (!extracted) {
    candidateAdditional = candidateAdditional.map((r) => {
      const rDetach = detachNodeFromTree(r, nodeId);
      if (rDetach.detachedNode) {
        extracted = rDetach.detachedNode;
        return rDetach.updatedRoot;
      }
      return r;
    });
  }

  if (!extracted) {
    return null;
  }

  const cleanedNode = prepareReparentedNode(extracted, sourceAnchorSide, targetAnchorSide);

  const mainAttach = attachChildToTree(candidateRoot, newParentId, cleanedNode);
  if (mainAttach.attached) {
    return {
      updatedRoot: mainAttach.updatedTree,
      updatedAdditional: candidateAdditional,
      movedNode: cleanedNode,
    };
  }

  let attachedInAdd = false;
  const updatedAdditional = candidateAdditional.map((r) => {
    const res = attachChildToTree(r, newParentId, cleanedNode);
    if (res.attached) attachedInAdd = true;
    return res.updatedTree;
  });

  if (attachedInAdd) {
    return {
      updatedRoot: candidateRoot,
      updatedAdditional,
      movedNode: cleanedNode,
    };
  }

  return null;
}
