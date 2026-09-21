import {
  MindMapData,
  PresetTemplate,
  DocumentFolder,
  GroupingStrategy,
  CustomGroupingConfig,
  MindMapLayout,
  NodeNote,
} from "../../types";
import { soundFx } from "../../utils/soundEffects";
import { buildMindMapData } from "../../utils/mindMapTreeBuilder";
import {
  MindMapActionsProps,
  extractAllLeafNames,
  prepareImportMap,
  resolveRawImportTitle,
} from "./index";

export interface UseMapHistoryActionsParams extends MindMapActionsProps {
  buildCurrentMap: (
    topicTitle: string,
    topicSubtitle: string,
    namesList: string[],
    strategy: GroupingStrategy,
    cfg?: CustomGroupingConfig,
    overrideLayout?: MindMapLayout,
    nodeNotesMap?: Record<string, NodeNote[]>,
    rootNotesList?: NodeNote[]
  ) => void;
}

export function useMapHistoryActions({
  inputs,
  tree,
  persistence,
  showToast,
  buildCurrentMap,
}: UseMapHistoryActionsParams) {
  const handleSelectPreset = (p: PresetTemplate) => {
    soundFx.play("success");
    inputs.setTitle(p.title);
    inputs.setSubtitle(p.subtitle);
    inputs.setNamesText(p.names.join("\n"));
    inputs.setLayout(p.suggestedLayout);
    inputs.setTheme(p.suggestedTheme);
    if (p.suggestedConnectorStyle) inputs.setConnectorStyle(p.suggestedConnectorStyle);
    if (p.suggestedNodeShape) inputs.setNodeShape(p.suggestedNodeShape);
    const strat = p.suggestedGroupingStrategy || "alphabetical";
    inputs.setGroupingStrategy(strat);
    const cfg = {
      ...inputs.customConfig,
      ...(p.customConfig || {}),
    };
    inputs.setCustomConfig(cfg);
    inputs.setCurrentFolder(p.folder || "Umum");

    const newMap = buildMindMapData({
      topicTitle: p.title,
      topicSubtitle: p.subtitle,
      namesList: p.names,
      strategy: strat,
      cfg,
      layout: p.suggestedLayout,
      theme: p.suggestedTheme,
      connectorStyle: p.suggestedConnectorStyle || "bezier",
      nodeShape: p.suggestedNodeShape || "rounded",
      currentFolder: p.folder || "Umum",
      nodeNotesMap: p.nodeNotes,
      rootNotesList: p.rootNotes,
    });
    tree.setMindMapData(newMap);
    inputs.setIsInputCollapsed(false);
  };

  const handleLoadMapFromHistory = (map: MindMapData) => {
    soundFx.play("success");
    persistence.setActiveHistoryId(map.id);
    tree.setMindMapData(map);
    inputs.setTitle(map.title);
    inputs.setSubtitle(map.subtitle || "");
    if (map.folder) inputs.setCurrentFolder(map.folder);
    if (map.rawNamesText) {
      inputs.setNamesText(map.rawNamesText);
    } else if (map.root) {
      const leafNames = extractAllLeafNames(map);
      if (leafNames.length > 0) {
        inputs.setNamesText(leafNames.join("\n"));
      }
    }
    if (map.layout) inputs.setLayout(map.layout);
    if (map.theme) inputs.setTheme(map.theme);
    if (map.connectorStyle) inputs.setConnectorStyle(map.connectorStyle);
    if (map.nodeShape) inputs.setNodeShape(map.nodeShape);
    if (map.groupingStrategy) inputs.setGroupingStrategy(map.groupingStrategy);
    if (map.customConfig) inputs.setCustomConfig(map.customConfig);
    inputs.setIsInputCollapsed(false);
  };

  const handleImportMindMap = (
    data: MindMapData,
    options?: {
      mode?: "overwrite" | "copy";
      customTitle?: string;
      targetExistingId?: string;
    }
  ) => {
    soundFx.play("success");
    const finalData = prepareImportMap(data, options);

    if (options?.mode === "copy") {
      persistence.saveToHistory({ ...finalData, isUserSaved: true }, { mode: "copy" });
    } else {
      persistence.saveToHistory(
        { ...finalData, isUserSaved: true },
        { mode: "overwrite", targetId: options?.targetExistingId }
      );
    }

    handleLoadMapFromHistory(finalData);
    showToast(
      options?.mode === "copy"
        ? `Mind map disimpan sebagai salinan baru "${finalData.title}" & dimuat!`
        : `Mind map "${finalData.title}" berhasil diperbarui & dimuat!`
    );
  };

  const handleImportMultipleMindMaps = (
    maps: MindMapData[],
    options?: { mode?: "overwrite" | "copy" | "skip" }
  ) => {
    if (!maps || maps.length === 0) return;
    soundFx.play("success");
    const userSavedMaps = maps.map((m) => ({ ...m, isUserSaved: true }));
    persistence.saveMultipleToHistory(userSavedMaps, options);
    handleLoadMapFromHistory(userSavedMaps[0]);
    showToast(
      `Berhasil mengimpor ${maps.length} mind map ke Memory Card! "${userSavedMaps[0].title}" dimuat ke kanvas.`
    );
  };

  const handleImportRawText = (
    newTitle: string,
    newSubtitle: string,
    names: string[],
    folder: DocumentFolder,
    options?: { mode?: "overwrite" | "copy"; customTitle?: string }
  ) => {
    soundFx.play("success");
    const finalTitle = resolveRawImportTitle(newTitle, options);

    inputs.setTitle(finalTitle);
    inputs.setSubtitle(newSubtitle);
    inputs.setNamesText(names.join("\n"));
    inputs.setCurrentFolder(folder);
    buildCurrentMap(finalTitle, newSubtitle, names, inputs.groupingStrategy);
    inputs.setIsInputCollapsed(false);
    showToast(`Daftar ${names.length} item berhasil diimpor ke mind map "${finalTitle}"!`);
  };

  return {
    handleSelectPreset,
    handleLoadMapFromHistory,
    handleImportMindMap,
    handleImportMultipleMindMaps,
    handleImportRawText,
  };
}
