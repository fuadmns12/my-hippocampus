import { useEffect } from "react";
import { PRESET_TEMPLATES } from "../data/presets";
import {
  MindMapActionsProps,
  MindMapActionsReturn,
  useMapGenerationActions,
  useMapHistoryActions,
  useMapNavigationActions,
} from "./mindMapActions";

export type { MindMapActionsProps, MindMapActionsReturn };

export function useMindMapActions({
  inputs,
  tree,
  persistence,
  showToast,
}: MindMapActionsProps): MindMapActionsReturn {
  const defaultPreset = PRESET_TEMPLATES[0];

  // Initial Mount - configure defaults without automatically generating the map into canvas
  useEffect(() => {
    const p = defaultPreset;
    if (p.suggestedConnectorStyle) inputs.setConnectorStyle(p.suggestedConnectorStyle);
    if (p.suggestedNodeShape) inputs.setNodeShape(p.suggestedNodeShape);
    const strat = p.suggestedGroupingStrategy || "alphabetical";
    inputs.setGroupingStrategy(strat);
    if (p.customConfig) {
      inputs.setCustomConfig((prev) => ({ ...prev, ...p.customConfig }));
    }
  }, []);

  // 1. Generation & Creation actions
  const {
    buildCurrentMap,
    handleStrategyChange,
    handleGenerate,
    handleAddToCanvas,
    handleApplySettings,
    handleStartWithMainTopicOnly,
  } = useMapGenerationActions({
    inputs,
    tree,
    persistence,
    showToast,
  });

  // 2. Preset, History & Import actions
  const {
    handleSelectPreset,
    handleLoadMapFromHistory,
    handleImportMindMap,
    handleImportMultipleMindMaps,
    handleImportRawText,
  } = useMapHistoryActions({
    inputs,
    tree,
    persistence,
    showToast,
    buildCurrentMap,
  });

  // 3. Navigation, Switching & Reset actions
  const {
    handleSelectRoot,
    handleResetForm,
    handleSelectLayout,
    handleReset,
    handleOpenNewMindMap,
    handleOpenEditMindMap,
  } = useMapNavigationActions({
    inputs,
    tree,
    persistence,
    showToast,
  });

  return {
    handleStrategyChange,
    handleGenerate,
    handleStartWithMainTopicOnly,
    handleAddToCanvas,
    handleSelectRoot,
    handleResetForm,
    handleApplySettings,
    handleSelectPreset,
    handleLoadMapFromHistory,
    handleImportMindMap,
    handleImportMultipleMindMaps,
    handleImportRawText,
    handleSelectLayout,
    handleReset,
    handleOpenNewMindMap,
    handleOpenEditMindMap,
  };
}
