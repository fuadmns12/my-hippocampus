import { PresetTemplate, MindMapData, CustomGroupingConfig } from "../types";
import { buildMindMapData } from "./mindMapTreeBuilder";

export function generateMindMapFromPreset(preset: PresetTemplate): MindMapData {
  const strat = preset.suggestedGroupingStrategy || "alphabetical";
  const cfg: CustomGroupingConfig = {
    alphabetMode: "range",
    alphabetRanges: "A-G, H-M, N-S, T-Z",
    alphabetNumGroups: 4,
    alphabetIncludeOthers: true,
    balancedBranchCount: 4,
    balancedBranchPrefix: "Kelompok",
    balancedDistributionMode: "round-robin",
    flatEmoji: "👤",
    flatSortOrder: "original",
    ...(preset.customConfig || {}),
  };

  return buildMindMapData({
    topicTitle: preset.title,
    topicSubtitle: preset.subtitle,
    namesList: preset.names,
    strategy: strat,
    cfg,
    layout: preset.suggestedLayout,
    theme: preset.suggestedTheme,
    connectorStyle: preset.suggestedConnectorStyle || "bezier",
    nodeShape: preset.suggestedNodeShape || "rounded",
    currentFolder: preset.folder || "Umum",
    mapId: `doc-${preset.id}`,
    nodeNotesMap: preset.nodeNotes,
    rootNotesList: preset.rootNotes,
  });
}

export function getDefaultSeedDocuments(presets: PresetTemplate[]): MindMapData[] {
  return presets.map((p) => generateMindMapFromPreset(p));
}
