import { MindMapNode } from "../../types";

export function findNodeInTree(
  curr: MindMapNode,
  targetId: string
): MindMapNode | null {
  if (curr.id === targetId) return curr;
  if (curr.children) {
    for (const child of curr.children) {
      const found = findNodeInTree(child, targetId);
      if (found) return found;
    }
  }
  return null;
}

export function findNodeByLabel(
  curr: MindMapNode,
  label: string
): MindMapNode | null {
  const cleanTarget = label.trim().toLowerCase();
  if (curr.label.trim().toLowerCase() === cleanTarget) return curr;
  if (curr.children) {
    for (const child of curr.children) {
      const found = findNodeByLabel(child, label);
      if (found) return found;
    }
  }
  return null;
}

export function findNodeByLabelInTrees(
  trees: MindMapNode[],
  label: string
): MindMapNode | null {
  for (const tree of trees) {
    const found = findNodeByLabel(tree, label);
    if (found) return found;
  }
  return null;
}

export function findNodeInAnyTree(
  roots: MindMapNode[],
  targetId: string
): MindMapNode | null {
  for (const r of roots) {
    const found = findNodeInTree(r, targetId);
    if (found) return found;
  }
  return null;
}

export function findRootContainingNode(
  roots: MindMapNode[],
  targetId: string
): MindMapNode | null {
  for (const r of roots) {
    if (findNodeInTree(r, targetId)) return r;
  }
  return null;
}

export function extractLeafNamesFromTree(root: MindMapNode): string[] {
  const names: string[] = [];
  function collect(node: MindMapNode) {
    if (!node.children || node.children.length === 0) {
      if (node.id !== root.id) names.push(node.label);
    } else {
      node.children.forEach(collect);
    }
  }
  collect(root);
  return names;
}
