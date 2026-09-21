import { MindMapData, MindMapNode } from "../../types";

/**
 * Ekstraksi seluruh nama leaf nodes (ujung ranting) dari diagram mind map
 */
export function extractAllLeafNames(map: MindMapData): string[] {
  const leafNames: string[] = [];
  const collect = (node: MindMapNode, rootId: string) => {
    if (!node.children || node.children.length === 0) {
      if (node.id !== rootId) leafNames.push(node.label);
    } else {
      node.children.forEach((c) => collect(c, rootId));
    }
  };

  if (map.root) {
    collect(map.root, map.root.id);
  }
  if (map.additionalRoots) {
    map.additionalRoots.forEach((r) => collect(r, r.id));
  }
  return leafNames;
}

export interface PrepareImportOptions {
  mode?: "overwrite" | "copy";
  customTitle?: string;
  targetExistingId?: string;
}

/**
 * Siapkan data mind map impor, mengkloning atau menghasilkan ID baru jika mode salinan baru dipilih
 */
export function prepareImportMap(
  data: MindMapData,
  options?: PrepareImportOptions
): MindMapData {
  if (options?.mode === "copy") {
    const newTitle = options.customTitle?.trim() || `${data.title} (Salinan Baru)`;
    const newId = `map-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    return {
      ...data,
      id: newId,
      title: newTitle,
      root: {
        ...data.root,
        label: newTitle,
      },
    };
  }
  return { ...data };
}

/**
 * Tentukan judul akhir ketika mengimpor teks mentah
 */
export function resolveRawImportTitle(
  newTitle: string,
  options?: { mode?: "overwrite" | "copy"; customTitle?: string }
): string {
  if (options?.mode === "copy" && options.customTitle) {
    return options.customTitle.trim();
  }
  if (options?.mode === "copy") {
    return `${newTitle} (Salinan Baru)`;
  }
  return newTitle;
}
