import {
  MindMapData,
  MindMapNode,
  NodeNote,
  MindMapLayout,
  GroupingStrategy,
  CustomGroupingConfig,
  DocumentFolder,
  ColorTheme,
  ConnectorStyle,
  NodeShape,
} from "../../types";
import { buildSingleRootNode } from "../../utils/mindMapTreeBuilder";

/**
 * Kumpulkan seluruh catatan (notes) yang ada pada target root dan anak rantingnya
 * agar tidak hilang saat struktur mind map digenerate ulang.
 */
export function collectNodeNotes(targetRoot: MindMapNode): {
  existingNotesMap: Record<string, NodeNote[]>;
  existingRootNotes?: NodeNote[];
} {
  const existingNotesMap: Record<string, NodeNote[]> = {};
  let existingRootNotes: NodeNote[] | undefined;

  if (targetRoot.notes) {
    existingRootNotes = targetRoot.notes.map((n) => ({ ...n }));
  }

  const collectNotes = (node: MindMapNode) => {
    if (node.notes && node.notes.length > 0) {
      existingNotesMap[node.label.trim().toLowerCase()] = node.notes.map((n) => ({ ...n }));
      existingNotesMap[node.label.trim()] = node.notes.map((n) => ({ ...n }));
    }
    node.children?.forEach(collectNotes);
  };

  collectNotes(targetRoot);
  return { existingNotesMap, existingRootNotes };
}

/**
 * Hitung offset koordinat berikutnya ketika menambah root diagram baru ke kanvas
 */
export function calculateNextRootOffset(
  layout: MindMapLayout,
  count: number
): { x: number; y: number } {
  if (layout === "vertical-tree") {
    return { x: count * 850, y: 0 };
  } else if (layout === "horizontal-tree" || layout === "fishbone") {
    return { x: 0, y: count * 700 };
  } else {
    return { x: count * 950, y: 0 };
  }
}

export interface BuildUpdatedRootParams {
  targetRoot: MindMapNode;
  namesList: string[];
  rawNamesText: string;
  title: string;
  subtitle: string;
  strategy: GroupingStrategy;
  customConfig: CustomGroupingConfig;
  layout: MindMapLayout;
  theme: ColorTheme;
  connectorStyle: ConnectorStyle;
  nodeShape: NodeShape;
  currentFolder: DocumentFolder;
}

/**
 * Memperbarui root node yang sedang aktif, menjaga posisi, catatan, dan anak cabang jika hanya judul yang berubah
 */
export function buildUpdatedRoot(params: BuildUpdatedRootParams): MindMapNode {
  const {
    targetRoot,
    namesList,
    rawNamesText,
    title,
    subtitle,
    strategy,
    customConfig,
    layout,
    theme,
    connectorStyle,
    nodeShape,
    currentFolder,
  } = params;

  let updatedRoot: MindMapNode;

  // Jika nama cabang kosong namun targetRoot sudah memiliki anak, pengguna hanya mengedit judul/subjudul
  if (namesList.length === 0 && targetRoot.children && targetRoot.children.length > 0) {
    updatedRoot = {
      ...targetRoot,
      label: title.trim() || targetRoot.label,
      subtitle: subtitle.trim(),
      notes: targetRoot.notes ? targetRoot.notes.map((n) => ({ ...n })) : undefined,
      rawNamesText,
    };
  } else {
    const { existingNotesMap, existingRootNotes } = collectNodeNotes(targetRoot);

    updatedRoot = buildSingleRootNode(
      {
        topicTitle: title,
        topicSubtitle: subtitle,
        namesList,
        strategy,
        cfg: customConfig,
        layout,
        theme,
        connectorStyle,
        nodeShape,
        currentFolder,
        nodeNotesMap: Object.keys(existingNotesMap).length > 0 ? existingNotesMap : undefined,
        rootNotesList: existingRootNotes,
      },
      targetRoot.id
    );
  }

  updatedRoot.xOffset = targetRoot.xOffset;
  updatedRoot.yOffset = targetRoot.yOffset;
  updatedRoot.scale = targetRoot.scale;
  updatedRoot.rawNamesText = rawNamesText;

  return updatedRoot;
}

export interface CreateMainTopicParams {
  title: string;
  subtitle: string;
  defaultPresetTitle: string;
  activeHistoryId: string | null;
  layout: MindMapLayout;
  theme: ColorTheme;
  connectorStyle: ConnectorStyle;
  nodeShape: NodeShape;
  currentFolder: DocumentFolder;
  groupingStrategy: GroupingStrategy;
  customConfig: CustomGroupingConfig;
  additionalRoots?: MindMapNode[];
}

/**
 * Membuat data mind map awal baru yang hanya berisi topik utama di kanvas
 */
export function createMainTopicOnlyMap(params: CreateMainTopicParams): {
  cleanTitle: string;
  cleanSubtitle: string;
  newMap: MindMapData;
} {
  const isPresetTitle = params.title.trim() === params.defaultPresetTitle;
  const cleanTitle = isPresetTitle ? "Topik Utama" : params.title.trim() || "Topik Utama";
  const cleanSubtitle = isPresetTitle ? "" : params.subtitle.trim();

  const newRoot: MindMapNode = {
    id: `root-${Date.now()}`,
    label: cleanTitle,
    subtitle: cleanSubtitle || undefined,
    children: [],
  };

  const newMap: MindMapData = {
    id: params.activeHistoryId || `map-${Date.now()}`,
    title: cleanTitle,
    subtitle: cleanSubtitle,
    rawNamesText: "",
    layout: params.layout,
    theme: params.theme,
    connectorStyle: params.connectorStyle,
    nodeShape: params.nodeShape,
    folder: params.currentFolder,
    groupingStrategy: params.groupingStrategy,
    customConfig: params.customConfig,
    createdAt: new Date().toISOString(),
    isUserSaved: false,
    root: newRoot,
    additionalRoots: params.additionalRoots,
  };

  return { cleanTitle, cleanSubtitle, newMap };
}
