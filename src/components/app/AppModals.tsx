import React from "react";
import { NodeEditorModal } from "../NodeEditorModal";
import { NodeNotesModal } from "../NodeNotesModal";
import { HistoryDrawer } from "../HistoryDrawer";
import { UploadModal } from "../UploadModal";
import { GroupingSettingsModal } from "../GroupingSettingsModal";
import { ConfirmClearCanvasModal } from "../modals/ConfirmClearCanvasModal";
import { ConfirmLoadPresetModal } from "../modals/ConfirmLoadPresetModal";
import {
  MindMapData,
  MindMapNode,
  NodeNote,
  DocumentFolder,
  GroupingStrategy,
  CustomGroupingConfig,
  PresetTemplate,
} from "../../types";

export interface AppModalsProps {
  // Node Editor
  selectedNode: MindMapNode | null;
  rootNode?: MindMapNode;
  onCloseNodeEditor: () => void;
  onSaveNode: (node: MindMapNode) => void;
  onAddChildNode: (parentId: string, label: string) => void;
  onAddMultipleChildren?: (parentId: string, labels: string[]) => void;
  onDeleteNode: (id: string) => void;
  onReparentNode: (nodeId: string, newParentId: string) => void;
  onOpenNotesFromEditor: (node: MindMapNode) => void;

  // Node Notes
  selectedNodeForNotes: MindMapNode | null;
  onCloseNotes: () => void;
  onSaveNotes: (nodeId: string, notes: NodeNote[]) => void;

  // History Drawer
  showHistory: boolean;
  onCloseHistory: () => void;
  savedHistory: MindMapData[];
  onMoveFolder?: (id: string, newFolder: DocumentFolder) => void;
  onNewDocumentInFolder?: (folder: DocumentFolder) => void;
  onLoadMap: (map: MindMapData) => void;
  onDeleteMap: (id: string) => void;
  onClearAllHistory: () => void;
  hasCurrentMap?: boolean;
  onSaveCurrentMap?: () => void;

  // Upload Modal
  showUploadModal: boolean;
  onOpenUploadModal?: () => void;
  onCloseUploadModal: () => void;
  onImportMindMap: (
    data: MindMapData,
    options?: {
      mode?: "overwrite" | "copy";
      customTitle?: string;
      targetExistingId?: string;
    }
  ) => void;
  onImportMultipleMindMaps?: (
    maps: MindMapData[],
    options?: { mode?: "overwrite" | "copy" | "skip" }
  ) => void;
  onImportRawText: (
    title: string,
    subtitle: string,
    names: string[],
    folder: DocumentFolder,
    options?: { mode?: "overwrite" | "copy"; customTitle?: string }
  ) => void;
  currentFolder: DocumentFolder;

  // Grouping Settings
  showSettingsModal: boolean;
  onCloseSettingsModal: () => void;
  settingsStrategy: GroupingStrategy;
  setSettingsStrategy: (strat: GroupingStrategy) => void;
  customConfig: CustomGroupingConfig;
  setCustomConfig: (cfg: CustomGroupingConfig) => void;
  onApplySettings: (cfg: CustomGroupingConfig) => void;

  // Clear Canvas Confirmation
  showClearConfirmModal?: boolean;
  onCloseClearConfirmModal?: () => void;
  onConfirmClearCanvas?: (alsoClearInputs: boolean) => void;
  mapTitle?: string;
  totalMapsCount?: number;

  // Load Preset Confirmation
  pendingPreset?: PresetTemplate | null;
  onCloseLoadPresetModal?: () => void;
  onConfirmLoadPreset?: () => void;
  hasExistingCanvasData?: boolean;
}

export function AppModals({
  selectedNode,
  rootNode,
  onCloseNodeEditor,
  onSaveNode,
  onAddChildNode,
  onAddMultipleChildren,
  onDeleteNode,
  onReparentNode,
  onOpenNotesFromEditor,
  selectedNodeForNotes,
  onCloseNotes,
  onSaveNotes,
  showHistory,
  onCloseHistory,
  savedHistory,
  onMoveFolder,
  onNewDocumentInFolder,
  onLoadMap,
  onDeleteMap,
  onClearAllHistory,
  hasCurrentMap,
  onSaveCurrentMap,
  showUploadModal,
  onOpenUploadModal,
  onCloseUploadModal,
  onImportMindMap,
  onImportMultipleMindMaps,
  onImportRawText,
  currentFolder,
  showSettingsModal,
  onCloseSettingsModal,
  settingsStrategy,
  setSettingsStrategy,
  customConfig,
  setCustomConfig,
  onApplySettings,
  showClearConfirmModal,
  onCloseClearConfirmModal,
  onConfirmClearCanvas,
  mapTitle,
  totalMapsCount,
  pendingPreset,
  onCloseLoadPresetModal,
  onConfirmLoadPreset,
  hasExistingCanvasData,
}: AppModalsProps) {
  return (
    <>
      {/* Node Editor Modal */}
      {selectedNode && (
        <NodeEditorModal
          node={selectedNode}
          rootNode={rootNode}
          onClose={onCloseNodeEditor}
          onSaveNode={onSaveNode}
          onAddChildNode={onAddChildNode}
          onAddMultipleChildren={onAddMultipleChildren}
          onDeleteNode={onDeleteNode}
          onReparentNode={onReparentNode}
          onOpenNotes={onOpenNotesFromEditor}
          isRoot={selectedNode?.id === rootNode?.id}
        />
      )}

      {/* Node Notes Modal */}
      {selectedNodeForNotes && (
        <NodeNotesModal
          node={selectedNodeForNotes}
          onClose={onCloseNotes}
          onSaveNotes={onSaveNotes}
        />
      )}

      {/* Saved Mindmaps History Drawer */}
      <HistoryDrawer
        isOpen={showHistory}
        onClose={onCloseHistory}
        savedMaps={savedHistory}
        hasCurrentMap={hasCurrentMap}
        onSaveCurrentMap={onSaveCurrentMap}
        onLoadMap={onLoadMap}
        onDeleteMap={onDeleteMap}
        onClearAllHistory={onClearAllHistory}
        onOpenUpload={onOpenUploadModal}
      />

      {/* Upload Mind Map Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={onCloseUploadModal}
        savedHistory={savedHistory}
        onImportMindMap={onImportMindMap}
        onImportMultipleMindMaps={onImportMultipleMindMaps}
        onImportRawText={onImportRawText}
        currentFolder={currentFolder}
      />

      {/* Grouping Custom Settings Modal */}
      <GroupingSettingsModal
        isOpen={showSettingsModal}
        onClose={onCloseSettingsModal}
        activeStrategy={settingsStrategy}
        setActiveStrategy={setSettingsStrategy}
        config={customConfig}
        onChangeConfig={setCustomConfig}
        onApplyConfig={onApplySettings}
      />

      {/* Clear Canvas Confirmation Modal */}
      {showClearConfirmModal && onCloseClearConfirmModal && onConfirmClearCanvas && (
        <ConfirmClearCanvasModal
          isOpen={showClearConfirmModal}
          onClose={onCloseClearConfirmModal}
          onConfirm={onConfirmClearCanvas}
          mapTitle={mapTitle}
          totalMapsCount={totalMapsCount}
        />
      )}

      {/* Load Preset Confirmation Modal */}
      {pendingPreset && onCloseLoadPresetModal && onConfirmLoadPreset && (
        <ConfirmLoadPresetModal
          isOpen={Boolean(pendingPreset)}
          onClose={onCloseLoadPresetModal}
          onConfirm={onConfirmLoadPreset}
          preset={pendingPreset}
          hasExistingCanvasData={hasExistingCanvasData}
        />
      )}
    </>
  );
}
