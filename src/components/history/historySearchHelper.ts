import { MindMapNode } from "../../types";

/**
 * Helper to recursively search query within node label, subtitle, and attached notes
 */
export const searchInNodes = (node?: MindMapNode, query?: string): boolean => {
  if (!node || !query) return false;
  if (node.label && node.label.toLowerCase().includes(query)) return true;
  if (node.subtitle && node.subtitle.toLowerCase().includes(query)) return true;
  if (node.notes && Array.isArray(node.notes)) {
    for (const note of node.notes) {
      if (
        (note.title && note.title.toLowerCase().includes(query)) ||
        (note.content && note.content.toLowerCase().includes(query))
      ) {
        return true;
      }
    }
  }
  if (node.children) {
    for (const child of node.children) {
      if (searchInNodes(child, query)) return true;
    }
  }
  return false;
};
