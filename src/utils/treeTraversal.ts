import { MindMapNode } from "../types";

export function findNodeInTree(root: MindMapNode, id: string): MindMapNode | null {
  if (root.id === id) return root;
  if (root.children && root.children.length > 0) {
    for (const child of root.children) {
      const found = findNodeInTree(child, id);
      if (found) return found;
    }
  }
  return null;
}
