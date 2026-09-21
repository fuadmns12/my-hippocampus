import { useCallback } from "react";
import {
  GroupingStrategy,
  CustomGroupingConfig,
  MindMapLayout,
  NodeNote,
} from "../../types";
import { soundFx } from "../../utils/soundEffects";
import { PRESET_TEMPLATES } from "../../data/presets";
import { parseNames, buildMindMapData, buildSingleRootNode } from "../../utils/mindMapTreeBuilder";
import {
  MindMapActionsProps,
  calculateNextRootOffset,
  buildUpdatedRoot,
  createMainTopicOnlyMap,
} from "./index";

export function useMapGenerationActions({
  inputs,
  tree,
  persistence,
  showToast,
}: MindMapActionsProps) {
  const defaultPreset = PRESET_TEMPLATES[0];

  // Core builder
  const buildCurrentMap = useCallback(
    (
      topicTitle: string,
      topicSubtitle: string,
      namesList: string[],
      strategy: GroupingStrategy,
      cfg: CustomGroupingConfig = inputs.customConfig,
      overrideLayout?: MindMapLayout,
      nodeNotesMap?: Record<string, NodeNote[]>,
      rootNotesList?: NodeNote[]
    ) => {
      const newMap = buildMindMapData({
        topicTitle,
        topicSubtitle,
        namesList,
        strategy,
        cfg,
        layout: overrideLayout || inputs.layout,
        theme: inputs.theme,
        connectorStyle: inputs.connectorStyle,
        nodeShape: inputs.nodeShape,
        currentFolder: inputs.currentFolder,
        mapId: persistence.activeHistoryId || tree.mindMapData?.id,
        nodeNotesMap,
        rootNotesList,
      });

      if (tree.mindMapData?.additionalRoots) {
        newMap.additionalRoots = tree.mindMapData.additionalRoots;
      }
      if (tree.mindMapData?.activeRootId) {
        newMap.activeRootId = tree.mindMapData.activeRootId;
      }
      if (tree.mindMapData?.connections) {
        newMap.connections = tree.mindMapData.connections;
      }
      tree.setMindMapData(newMap);
    },
    [inputs, persistence.activeHistoryId, tree]
  );

  const handleStrategyChange = (newStrat: GroupingStrategy) => {
    inputs.setGroupingStrategy(newStrat);
    const list = parseNames(inputs.namesText);
    if (tree.mindMapData && list.length > 0) {
      buildCurrentMap(inputs.title, inputs.subtitle, list, newStrat);
    }
  };

  const handleGenerate = () => {
    soundFx.play("spawn");
    const list = parseNames(inputs.namesText);
    const isEditing = Boolean(tree.mindMapData);

    if (isEditing && tree.mindMapData) {
      const activeRoot = tree.getActiveRoot();
      const targetRoot = activeRoot || tree.mindMapData.root;

      const updatedRoot = buildUpdatedRoot({
        targetRoot,
        namesList: list,
        rawNamesText: inputs.namesText,
        title: inputs.title,
        subtitle: inputs.subtitle,
        strategy: inputs.groupingStrategy,
        customConfig: inputs.customConfig,
        layout: inputs.layout,
        theme: inputs.theme,
        connectorStyle: inputs.connectorStyle,
        nodeShape: inputs.nodeShape,
        currentFolder: inputs.currentFolder,
      });

      const isMain = targetRoot.id === tree.mindMapData.root.id;

      tree.setMindMapData((prev) => {
        if (!prev) return prev;
        if (isMain) {
          return {
            ...prev,
            title: updatedRoot.label,
            subtitle: updatedRoot.subtitle || "",
            rawNamesText: inputs.namesText,
            root: updatedRoot,
          };
        } else {
          return {
            ...prev,
            additionalRoots: prev.additionalRoots?.map((r) =>
              r.id === targetRoot.id ? updatedRoot : r
            ),
          };
        }
      });

      inputs.setIsInputCollapsed(false);
      showToast(`Mind Map "${inputs.title || "Mind Map"}" berhasil diperbarui di kanvas!`);
    } else {
      buildCurrentMap(
        inputs.title,
        inputs.subtitle,
        list,
        inputs.groupingStrategy,
        inputs.customConfig
      );
      inputs.setIsInputCollapsed(false);
      showToast(
        `Mind Map "${inputs.title || "Mind Map"}" berhasil dibuat! Panel ini sekarang menjadi tempat edit.`
      );
    }
  };

  // Add a new independent mind map to canvas without replacing existing ones
  const handleAddToCanvas = () => {
    soundFx.play("spawn");
    const list = parseNames(inputs.namesText);
    if (list.length === 0 && !inputs.title.trim()) {
      showToast("Masukkan topik atau daftar nama terlebih dahulu!");
      return;
    }

    if (!tree.mindMapData) {
      handleGenerate();
      return;
    }

    const allRoots = tree.getAllRoots();
    const count = allRoots.length;
    const cleanTitle = inputs.title.trim() || `Mind Map ${count + 1}`;
    const offset = calculateNextRootOffset(inputs.layout, count);

    const newRoot = buildSingleRootNode({
      topicTitle: cleanTitle,
      topicSubtitle: inputs.subtitle,
      namesList: list,
      strategy: inputs.groupingStrategy,
      cfg: inputs.customConfig,
      layout: inputs.layout,
      theme: inputs.theme,
      connectorStyle: inputs.connectorStyle,
      nodeShape: inputs.nodeShape,
      currentFolder: inputs.currentFolder,
    });

    newRoot.xOffset = offset.x;
    newRoot.yOffset = offset.y;
    newRoot.rawNamesText = inputs.namesText;

    tree.handleAddMindMap(newRoot);
    showToast(`Mind Map "${cleanTitle}" berhasil ditambahkan ke kanvas! (Total: ${count + 1} Mind Map)`);

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("mindmap:fit-screen"));
    }, 100);
  };

  const handleApplySettings = (newCfg: CustomGroupingConfig) => {
    soundFx.play("click");
    inputs.setCustomConfig(newCfg);
    inputs.setGroupingStrategy(inputs.settingsStrategy);
    inputs.setShowSettingsModal(false);
    const list = parseNames(inputs.namesText);
    if (tree.mindMapData && list.length > 0) {
      buildCurrentMap(inputs.title, inputs.subtitle, list, inputs.settingsStrategy, newCfg);
    }
  };

  // Start mind map on canvas with ONLY the main topic
  const handleStartWithMainTopicOnly = () => {
    soundFx.play("spawn");
    const { cleanTitle, cleanSubtitle, newMap } = createMainTopicOnlyMap({
      title: inputs.title,
      subtitle: inputs.subtitle,
      defaultPresetTitle: defaultPreset.title,
      activeHistoryId: persistence.activeHistoryId,
      layout: inputs.layout,
      theme: inputs.theme,
      connectorStyle: inputs.connectorStyle,
      nodeShape: inputs.nodeShape,
      currentFolder: inputs.currentFolder,
      groupingStrategy: inputs.groupingStrategy,
      customConfig: inputs.customConfig,
      additionalRoots: tree.mindMapData?.additionalRoots,
    });

    tree.setMindMapData(newMap);
    inputs.setTitle(cleanTitle);
    inputs.setSubtitle(cleanSubtitle);
    inputs.setNamesText("");
    inputs.setIsInputCollapsed(false);
    showToast(`Mind Map dimulai dengan Topik Utama "${cleanTitle}". Kanvas siap digunakan!`);
  };

  return {
    buildCurrentMap,
    handleStrategyChange,
    handleGenerate,
    handleAddToCanvas,
    handleApplySettings,
    handleStartWithMainTopicOnly,
  };
}
