import {
  MindMapData,
  MindMapNode,
  MindMapLayout,
  ColorTheme,
  ConnectorStyle,
  NodeShape,
  GroupingStrategy,
  CustomGroupingConfig,
  NodeNote,
  DocumentFolder,
} from "../types";

export const parseNames = (text: string): string[] => {
  return text
    .split(/\r?\n/)
    .flatMap((line) => line.split(","))
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};

export interface BuildMindMapParams {
  topicTitle: string;
  topicSubtitle: string;
  namesList: string[];
  strategy: GroupingStrategy;
  cfg: CustomGroupingConfig;
  layout: MindMapLayout;
  theme: ColorTheme;
  connectorStyle: ConnectorStyle;
  nodeShape: NodeShape;
  currentFolder: DocumentFolder;
  mapId?: string;
  nodeNotesMap?: Record<string, NodeNote[]>;
  rootNotesList?: NodeNote[];
}

function resolveNodeNotes(
  label: string,
  map?: Record<string, NodeNote[]>
): NodeNote[] | undefined {
  if (!map) return undefined;
  if (map[label] && map[label].length > 0) return map[label].map((n) => ({ ...n }));
  const trimmed = label.trim();
  if (map[trimmed] && map[trimmed].length > 0) return map[trimmed].map((n) => ({ ...n }));
  const lower = trimmed.toLowerCase();
  if (map[lower] && map[lower].length > 0) return map[lower].map((n) => ({ ...n }));
  return undefined;
}

export function buildSingleRootNode(
  params: BuildMindMapParams,
  customRootId?: string
): MindMapNode {
  const {
    topicTitle,
    topicSubtitle,
    namesList,
    strategy,
    cfg,
    nodeNotesMap,
    rootNotesList,
  } = params;

  const cleanTitle = topicTitle.trim() || "Peta Pikiran Utama";
  let childrenNodes: MindMapNode[] = [];

  if (strategy === "alphabetical") {
    const groupsMap: { label: string; start: string; end: string; items: string[] }[] = [];

    if (cfg.alphabetMode === "range") {
      const rawRanges = (cfg.alphabetRanges || "A-G, H-M, N-S, T-Z")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      rawRanges.forEach((r) => {
        const parts = r.split("-").map((p) => p.trim().toUpperCase());
        if (parts.length === 2 && parts[0] && parts[1]) {
          groupsMap.push({ label: `${parts[0]} - ${parts[1]}`, start: parts[0], end: parts[1], items: [] });
        } else if (parts.length === 1 && parts[0].length === 1) {
          groupsMap.push({ label: parts[0], start: parts[0], end: parts[0], items: [] });
        }
      });
    } else {
      const n = cfg.alphabetNumGroups || 4;
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const chunkSize = Math.ceil(26 / n);
      for (let i = 0; i < n; i++) {
        const startIdx = i * chunkSize;
        const endIdx = Math.min(26, (i + 1) * chunkSize) - 1;
        if (startIdx <= 25) {
          const sChar = alphabet[startIdx];
          const eChar = alphabet[Math.max(startIdx, endIdx)];
          groupsMap.push({ label: `${sChar} - ${eChar}`, start: sChar, end: eChar, items: [] });
        }
      }
    }

    const others: string[] = [];
    namesList.forEach((name) => {
      const firstLetter = name.trim().charAt(0).toUpperCase();
      let placed = false;
      for (const g of groupsMap) {
        if (firstLetter >= g.start && firstLetter <= g.end) {
          g.items.push(name);
          placed = true;
          break;
        }
      }
      if (!placed) others.push(name);
    });

    childrenNodes = groupsMap
      .filter((g) => g.items.length > 0)
      .map((g, gIdx) => ({
        id: `node-alpha-${gIdx}-${Date.now()}`,
        label: `Kelompok ${g.label}`,
        subtitle: `${g.items.length} Nama`,
        emoji: "🔤",
        children: g.items.map((n, iIdx) => ({
          id: `node-item-${gIdx}-${iIdx}-${Date.now()}`,
          label: n,
          emoji: "👤",
          notes: resolveNodeNotes(n, nodeNotesMap),
        })),
      }));

    if (others.length > 0) {
      const otherChildren = others.map((n, iIdx) => ({
        id: `node-item-others-${iIdx}-${Date.now()}`,
        label: n,
        emoji: "👤",
        notes: resolveNodeNotes(n, nodeNotesMap),
      }));

      if (cfg.alphabetIncludeOthers || childrenNodes.length === 0) {
        childrenNodes.push({
          id: `node-alpha-others-${Date.now()}`,
          label: cfg.alphabetIncludeOthers ? "Kelompok Lainnya / Angka" : "Daftar Nama",
          subtitle: `${others.length} Nama`,
          emoji: cfg.alphabetIncludeOthers ? "🔢" : "👤",
          children: otherChildren,
        });
      } else {
        const lastGroup = childrenNodes[childrenNodes.length - 1];
        if (lastGroup.children) {
          lastGroup.children.push(...otherChildren);
          lastGroup.subtitle = `${lastGroup.children.length} Nama`;
        }
      }
    }
  } else if (strategy === "balanced-spokes") {
    const numBranches = Math.max(2, Math.min(12, cfg.balancedBranchCount || 4));
    const prefix = cfg.balancedBranchPrefix || "Kelompok";
    const branches: string[][] = Array.from({ length: numBranches }, () => []);

    if (cfg.balancedDistributionMode === "chunk") {
      const chunkSize = Math.ceil(namesList.length / numBranches);
      namesList.forEach((name, idx) => {
        branches[Math.min(numBranches - 1, Math.floor(idx / chunkSize))].push(name);
      });
    } else {
      namesList.forEach((name, idx) => {
        branches[idx % numBranches].push(name);
      });
    }

    const branchEmojis = ["🚀", "💡", "⚡", "🎨", "⚙️", "🌟", "📌", "🏆", "🎯", "💎", "🔥", "🌈"];
    childrenNodes = branches
      .filter((items) => items.length > 0)
      .map((items, bIdx) => ({
        id: `node-spoke-${bIdx}-${Date.now()}`,
        label: `${prefix} ${bIdx + 1}`,
        subtitle: `${items.length} Anggota`,
        emoji: branchEmojis[bIdx % branchEmojis.length],
        children: items.map((n, iIdx) => ({
          id: `node-item-${bIdx}-${iIdx}-${Date.now()}`,
          label: n,
          emoji: "👤",
          notes: resolveNodeNotes(n, nodeNotesMap),
        })),
      }));
  } else {
    // Flat Direct
    const sortedNames = [...namesList];
    if (cfg.flatSortOrder === "asc") sortedNames.sort((a, b) => a.localeCompare(b, "id"));
    else if (cfg.flatSortOrder === "desc") sortedNames.sort((a, b) => b.localeCompare(a, "id"));

    const itemEmoji = cfg.flatEmoji !== undefined ? cfg.flatEmoji : "👤";
    childrenNodes = sortedNames.map((n, idx) => ({
      id: `node-flat-${idx}-${Date.now()}`,
      label: n,
      emoji: itemEmoji ? itemEmoji : undefined,
      notes: resolveNodeNotes(n, nodeNotesMap),
    }));
  }

  const rootNode: MindMapNode = {
    id: customRootId || `node-root-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    label: cleanTitle,
    subtitle: topicSubtitle,
    emoji: "🎯",
    notes: rootNotesList ? [...rootNotesList] : undefined,
    rawNamesText: namesList.join("\n"),
    children: childrenNodes,
  };

  return rootNode;
}

export function buildMindMapData(params: BuildMindMapParams): MindMapData {
  const {
    topicTitle,
    topicSubtitle,
    namesList,
    strategy,
    cfg,
    layout,
    theme,
    connectorStyle,
    nodeShape,
    currentFolder,
    mapId = `map-${Date.now()}`,
  } = params;

  const rootNode = buildSingleRootNode(params);

  return {
    id: mapId,
    title: topicTitle.trim() || "Peta Pikiran Utama",
    subtitle: topicSubtitle,
    rawNamesText: namesList.join("\n"),
    root: rootNode,
    createdAt: new Date().toISOString(),
    layout,
    theme,
    connectorStyle,
    nodeShape,
    groupingStrategy: strategy,
    customConfig: cfg,
    folder: currentFolder,
  };
}
