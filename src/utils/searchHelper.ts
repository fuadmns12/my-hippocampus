import { MindMapNode } from "../types";

export interface NodeSearchResult {
  isMatch: boolean;
  matchedInLabel: boolean;
  matchedInNotes: boolean;
  matchedInSubtitle: boolean;
  matchedInEmoji: boolean;
  hasMatchingDescendants: boolean;
}

/**
 * Checks if a mind map node contains the given search query across:
 * - Label / Topic title
 * - Subtitle
 * - Emoji
 * - Notes (both note title and note content)
 */
export function checkNodeSearchMatch(
  node: MindMapNode,
  query: string
): NodeSearchResult {
  const cleanQuery = query.trim().toLowerCase();

  const emptyResult: NodeSearchResult = {
    isMatch: false,
    matchedInLabel: false,
    matchedInNotes: false,
    matchedInSubtitle: false,
    matchedInEmoji: false,
    hasMatchingDescendants: false,
  };

  if (!cleanQuery) return emptyResult;

  let matchedInLabel = false;
  let matchedInNotes = false;
  let matchedInSubtitle = false;
  let matchedInEmoji = false;

  // 1. Check Label / Topic
  if (node.label && node.label.toLowerCase().includes(cleanQuery)) {
    matchedInLabel = true;
  }

  // 2. Check Subtitle
  if (node.subtitle && node.subtitle.toLowerCase().includes(cleanQuery)) {
    matchedInSubtitle = true;
  }

  // 3. Check Emoji
  if (node.emoji && node.emoji.toLowerCase().includes(cleanQuery)) {
    matchedInEmoji = true;
  }

  // 4. Check Notes (both title and content)
  if (node.notes && Array.isArray(node.notes) && node.notes.length > 0) {
    for (const note of node.notes) {
      if (note.title && note.title.toLowerCase().includes(cleanQuery)) {
        matchedInNotes = true;
        break;
      }
      if (note.content && note.content.toLowerCase().includes(cleanQuery)) {
        matchedInNotes = true;
        break;
      }
    }
  }

  // 5. Multi-word match: if query has multiple words (e.g. "rencana sprint")
  const words = cleanQuery.split(/\s+/).filter(Boolean);
  if (!matchedInLabel && !matchedInNotes && !matchedInSubtitle && words.length > 1) {
    const combinedTexts: string[] = [];
    if (node.label) combinedTexts.push(node.label);
    if (node.subtitle) combinedTexts.push(node.subtitle);
    if (node.emoji) combinedTexts.push(node.emoji);
    if (node.notes && Array.isArray(node.notes)) {
      for (const note of node.notes) {
        if (note.title) combinedTexts.push(note.title);
        if (note.content) combinedTexts.push(note.content);
      }
    }
    const combined = combinedTexts.join(" ").toLowerCase();
    if (words.every((w) => combined.includes(w))) {
      matchedInLabel = true; // flag general match
    }
  }

  const isDirectMatch =
    matchedInLabel || matchedInNotes || matchedInSubtitle || matchedInEmoji;

  // 6. Check descendants (for collapsed branches)
  let hasMatchingDescendants = false;
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      const childRes = checkNodeSearchMatch(child, cleanQuery);
      if (childRes.isMatch || childRes.hasMatchingDescendants) {
        hasMatchingDescendants = true;
        break;
      }
    }
  }

  return {
    isMatch: isDirectMatch,
    matchedInLabel,
    matchedInNotes,
    matchedInSubtitle,
    matchedInEmoji,
    hasMatchingDescendants,
  };
}
