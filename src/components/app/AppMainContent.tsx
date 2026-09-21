import React from "react";
import { InputPanel } from "../InputPanel";
import { LayoutThemeSelector } from "../LayoutThemeSelector";
import { MindMapCanvas } from "../MindMapCanvas";
import { OutlineViewModal } from "../OutlineViewModal";
import { EmptyCanvasState } from "../canvas/EmptyCanvasState";
import { PresetTemplate } from "../../types";
import { findRootContainingNode } from "../../utils/nodeTreeOperations";
import { useMindMapInputs } from "../../hooks/useMindMapInputs";
import { useMindMapTree } from "../../hooks/useMindMapTree";
import { useMindMapActions } from "../../hooks/useMindMapActions";

export interface AppMainContentProps {
  inputs: ReturnType<typeof useMindMapInputs>;
  tree: ReturnType<typeof useMindMapTree>;
  actions: ReturnType<typeof useMindMapActions>;
  isFullscreen: boolean;
  handleToggleFullscreen: () => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
  onOpenNotesForName: (name: string) => void;
  getNodeNotesCount: (name: string) => number;
  onClearCanvas: () => void;
  isClearConfirmOpen?: boolean;
  onRequestPreset: (preset: PresetTemplate) => void;
}

export const AppMainContent: React.FC<AppMainContentProps> = ({
  inputs,
  tree,
  actions,
  isFullscreen,
  handleToggleFullscreen,
  svgRef,
  onOpenNotesForName,
  getNodeNotesCount,
  onClearCanvas,
  isClearConfirmOpen = false,
  onRequestPreset,
}) => {
  return (
    <main
      className={`flex-1 w-full ${
        isFullscreen ? "p-0" : "px-2 sm:px-3 md:px-4 py-3 sm:py-4 space-y-3.5 sm:space-y-4"
      }`}
    >
      {!isFullscreen && !inputs.isInputCollapsed && (
        <InputPanel
          title={inputs.title}
          setTitle={inputs.setTitle}
          subtitle={inputs.subtitle}
          setSubtitle={inputs.setSubtitle}
          folder={inputs.currentFolder}
          setFolder={inputs.setCurrentFolder}
          namesText={inputs.namesText}
          setNamesText={inputs.setNamesText}
          groupingStrategy={inputs.groupingStrategy}
          setGroupingStrategy={actions.handleStrategyChange}
          customConfig={inputs.customConfig}
          onOpenSettings={(strat) => {
            inputs.setSettingsStrategy(strat);
            inputs.setGroupingStrategy(strat);
            inputs.setShowSettingsModal(true);
          }}
          onGenerate={actions.handleGenerate}
          onAddToCanvas={actions.handleAddToCanvas}
          onResetNew={actions.handleResetForm}
          isEditingMode={Boolean(tree.mindMapData)}
          isAiLoading={inputs.isAiLoading}
          isCollapsed={inputs.isInputCollapsed}
          setIsCollapsed={inputs.setIsInputCollapsed}
          onOpenNotesForName={onOpenNotesForName}
          getNodeNotesCount={getNodeNotesCount}
          isSettingsOpen={inputs.showSettingsModal}
          settingsStrategy={inputs.settingsStrategy}
        />
      )}

      {!isFullscreen && inputs.isLayoutThemeOpen && (
        <LayoutThemeSelector
          currentLayout={inputs.layout}
          setLayout={actions.handleSelectLayout}
          currentTheme={inputs.theme}
          setTheme={inputs.setTheme}
          currentConnector={inputs.connectorStyle}
          setConnector={inputs.setConnectorStyle}
          currentNodeShape={inputs.nodeShape}
          setNodeShape={inputs.setNodeShape}
          onClose={() => inputs.setIsLayoutThemeOpen(false)}
        />
      )}

      {tree.mindMapData ? (
        <div className="space-y-4">
          {inputs.activeTab === "canvas" ? (
            <MindMapCanvas
              data={tree.mindMapData}
              layout={inputs.layout}
              theme={inputs.theme}
              connectorStyle={inputs.connectorStyle}
              nodeShape={inputs.nodeShape}
              isFullscreen={isFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
              onSelectNode={(n) => {
                tree.setSelectedNode(n);
                const roots = tree.getAllRoots();
                if (roots.length > 1) {
                  const containingRoot = findRootContainingNode(roots, n.id);
                  if (containingRoot && containingRoot.id !== tree.mindMapData?.activeRootId) {
                    actions.handleSelectRoot(containingRoot.id);
                  }
                }
              }}
              onOpenNotes={(n) => tree.setSelectedNodeForNotes(n)}
              onToggleCollapseNode={tree.handleToggleCollapseNode}
              onReparentNode={tree.handleReparentNode}
              onDetachNodeAsRoot={tree.handleDetachNodeAsRoot}
              onAddConnection={tree.handleAddConnection}
              onRemoveConnection={tree.handleRemoveConnection}
              onUpdateNodeOffset={tree.handleUpdateNodeOffset}
              onUpdateNodeScale={tree.handleUpdateNodeScale}
              onResetNodeOffsets={tree.handleResetNodeOffsets}
              onSelectRoot={actions.handleSelectRoot}
              onRemoveMindMap={tree.handleRemoveMindMap}
              onClearCanvas={onClearCanvas}
              isClearConfirmOpen={isClearConfirmOpen}
              onAddNewMindMap={() => {
                inputs.setIsInputCollapsed(false);
                actions.handleResetForm();
                setTimeout(() => {
                  const inputEl = document.getElementById("input-panel-section");
                  if (inputEl) {
                    inputEl.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }, 50);
              }}
              onGenerateBranchesFromList={actions.handleGenerate}
              namesCount={
                inputs.namesText
                  .split("\n")
                  .map((l) => l.trim())
                  .filter(Boolean).length
              }
              svgRef={svgRef}
              canUndo={tree.canUndo}
              canRedo={tree.canRedo}
              onUndo={tree.handleUndo}
              onRedo={tree.handleRedo}
            />
          ) : (
            <OutlineViewModal
              data={tree.mindMapData}
              onClose={() => inputs.setActiveTab("canvas")}
            />
          )}
        </div>
      ) : (
        <EmptyCanvasState
          onStartWithMainTopicOnly={actions.handleStartWithMainTopicOnly}
          onGenerateAll={actions.handleGenerate}
          topicTitle={inputs.title.trim() || "Topik Utama"}
          namesCount={
            inputs.namesText
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean).length
          }
          onSelectPreset={onRequestPreset}
        />
      )}
    </main>
  );
};
