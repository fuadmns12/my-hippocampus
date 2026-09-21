import { useMindMapInputs } from "../useMindMapInputs";
import { useMindMapTree } from "../useMindMapTree";
import { useMindMapPersistence } from "../useMindMapPersistence";
import {
  GroupingStrategy,
  CustomGroupingConfig,
  PresetTemplate,
  MindMapData,
  DocumentFolder,
  MindMapLayout,
} from "../../types";

export interface MindMapActionsProps {
  inputs: ReturnType<typeof useMindMapInputs>;
  tree: ReturnType<typeof useMindMapTree>;
  persistence: ReturnType<typeof useMindMapPersistence>;
  showToast: (msg: string) => void;
}

export interface MindMapActionsReturn {
  handleStrategyChange: (newStrat: GroupingStrategy) => void;
  handleGenerate: () => void;
  handleStartWithMainTopicOnly: () => void;
  handleAddToCanvas: () => void;
  handleSelectRoot: (rootId: string) => void;
  handleResetForm: () => void;
  handleApplySettings: (newCfg: CustomGroupingConfig) => void;
  handleSelectPreset: (p: PresetTemplate) => void;
  handleLoadMapFromHistory: (map: MindMapData) => void;
  handleImportMindMap: (
    data: MindMapData,
    options?: {
      mode?: "overwrite" | "copy";
      customTitle?: string;
      targetExistingId?: string;
    }
  ) => void;
  handleImportMultipleMindMaps: (
    maps: MindMapData[],
    options?: { mode?: "overwrite" | "copy" | "skip" }
  ) => void;
  handleImportRawText: (
    newTitle: string,
    newSubtitle: string,
    names: string[],
    folder: DocumentFolder,
    options?: { mode?: "overwrite" | "copy"; customTitle?: string }
  ) => void;
  handleSelectLayout: (newLayout: MindMapLayout) => void;
  handleReset: () => void;
  handleOpenNewMindMap: () => void;
  handleOpenEditMindMap: () => void;
}
