import { useRef, useCallback, useState, useMemo } from "react";
import { MindMapData, MindMapNode, NodeNote, PresetTemplate } from "../types";
import { findRootContainingNode, findNodeByLabelInTrees } from "../utils/nodeTreeOperations";
import { useFullscreen } from "./useFullscreen";
import { useToast } from "./useToast";
import { useMindMapInputs } from "./useMindMapInputs";
import { useMindMapTree } from "./useMindMapTree";
import { useMindMapPersistence } from "./useMindMapPersistence";
import { useMindMapExporters } from "./useMindMapExporters";
import { useMindMapActions } from "./useMindMapActions";
import { useGlobalAsyncErrorListener } from "./useGlobalAsyncErrorListener";

export function useAppOrchestrator() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [pendingPreset, setPendingPreset] = useState<PresetTemplate | null>(null);

  // Core Hook Integrations
  const { toastMessage, showToast } = useToast();
  useGlobalAsyncErrorListener({ onNotifyError: showToast });
  const inputs = useMindMapInputs();
  const { isFullscreen, handleToggleFullscreen } = useFullscreen();

  const { setTitle, setSubtitle } = inputs;
  const handleTitleSubtitleChange = useCallback(
    (newTitle: string, newSubtitle: string) => {
      setTitle(newTitle);
      setSubtitle(newSubtitle);
    },
    [setTitle, setSubtitle]
  );

  const tree = useMindMapTree(handleTitleSubtitleChange, showToast);

  const persistenceDeps = useMemo(
    () => ({
      mindMapData: tree.mindMapData,
      title: inputs.title,
      subtitle: inputs.subtitle,
      namesText: inputs.namesText,
      currentFolder: inputs.currentFolder,
      layout: inputs.layout,
      theme: inputs.theme,
      connectorStyle: inputs.connectorStyle,
      nodeShape: inputs.nodeShape,
      groupingStrategy: inputs.groupingStrategy,
      customConfig: inputs.customConfig,
    }),
    [
      tree.mindMapData,
      inputs.title,
      inputs.subtitle,
      inputs.namesText,
      inputs.currentFolder,
      inputs.layout,
      inputs.theme,
      inputs.connectorStyle,
      inputs.nodeShape,
      inputs.groupingStrategy,
      inputs.customConfig,
    ]
  );

  const persistence = useMindMapPersistence(persistenceDeps, showToast);

  const exporters = useMindMapExporters(
    svgRef,
    tree.mindMapData,
    inputs.theme,
    showToast
  );

  const actions = useMindMapActions({
    inputs,
    tree,
    persistence,
    showToast,
  });

  const handleConfirmClearCanvas = useCallback(
    (alsoClearInputs: boolean) => {
      tree.setMindMapData(null);
      tree.setSelectedNode(null);
      tree.setSelectedNodeForNotes(null);
      persistence.setActiveHistoryId(null);
      if (alsoClearInputs) {
        inputs.setTitle("");
        inputs.setSubtitle("");
        inputs.setNamesText("");
      }
      setShowClearConfirmModal(false);
      showToast("Kanvas mind mapping berhasil dikosongkan.");
    },
    [tree, persistence, inputs, showToast]
  );

  const handleRequestPreset = useCallback((preset: PresetTemplate) => {
    setPendingPreset(preset);
  }, []);

  const handleConfirmLoadPreset = useCallback(() => {
    if (pendingPreset) {
      actions.handleSelectPreset(pendingPreset);
      showToast(`Template "${pendingPreset.title}" berhasil dimuat.`);
      setPendingPreset(null);
    }
  }, [pendingPreset, actions, showToast]);

  const handleCloseLoadPresetModal = useCallback(() => {
    setPendingPreset(null);
  }, []);

  const isPanelOpen = !inputs.isInputCollapsed || inputs.isLayoutThemeOpen;

  const activeRootNode =
    tree.selectedNode && tree.mindMapData
      ? findRootContainingNode(tree.getAllRoots(), tree.selectedNode.id) || tree.mindMapData.root
      : tree.mindMapData?.root;

  const handleToggleCombinedPanels = useCallback(() => {
    if (isPanelOpen) {
      inputs.setIsInputCollapsed(true);
      inputs.setIsLayoutThemeOpen(false);
    } else {
      inputs.setIsInputCollapsed(false);
      inputs.setIsLayoutThemeOpen(true);
      setTimeout(() => {
        const inputEl = document.getElementById("input-panel-section");
        if (inputEl) {
          inputEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  }, [isPanelOpen, inputs]);

  const handleOpenNotesForName = useCallback(
    (name: string) => {
      if (!tree.mindMapData) {
        showToast("Buat atau terapkan Mind Map ke kanvas terlebih dahulu untuk mengisi catatan.");
        return;
      }

      const allRoots = tree.getAllRoots();
      let foundNode = findNodeByLabelInTrees(allRoots, name);

      if (!foundNode) {
        // Jika nama belum ada di pohon kanvas (misalnya baru ditambahkan di form),
        // tautkan sebagai node anak di root aktif agar dapat langsung menerima dan menyimpan catatan
        const activeRoot = tree.getActiveRoot() || tree.mindMapData.root;
        const newNode: MindMapNode = {
          id: `node-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          label: name,
          emoji: "👤",
          notes: [],
        };

        tree.setMindMapData((prev) => {
          if (!prev) return prev;
          const isMain = activeRoot.id === prev.root.id;
          if (isMain) {
            return {
              ...prev,
              root: {
                ...prev.root,
                children: [...(prev.root.children || []), newNode],
              },
            };
          } else {
            return {
              ...prev,
              additionalRoots: prev.additionalRoots?.map((r) =>
                r.id === activeRoot.id
                  ? { ...r, children: [...(r.children || []), newNode] }
                  : r
              ),
            };
          }
        });
        foundNode = newNode;
      }

      tree.setSelectedNodeForNotes(foundNode);
    },
    [tree, showToast]
  );

  const getNodeNotesCount = useCallback(
    (name: string): number => {
      if (!tree.mindMapData) return 0;
      const allRoots = tree.getAllRoots();
      const found = findNodeByLabelInTrees(allRoots, name);
      return found?.notes?.length || 0;
    },
    [tree]
  );

  return {
    svgRef,
    hasEntered,
    setHasEntered,
    showClearConfirmModal,
    setShowClearConfirmModal,
    pendingPreset,
    toastMessage,
    showToast,
    inputs,
    isFullscreen,
    handleToggleFullscreen,
    tree,
    persistence,
    exporters,
    actions,
    handleConfirmClearCanvas,
    handleRequestPreset,
    handleConfirmLoadPreset,
    handleCloseLoadPresetModal,
    isPanelOpen,
    activeRootNode,
    handleToggleCombinedPanels,
    handleOpenNotesForName,
    getNodeNotesCount,
  };
}

export type AppOrchestratorReturn = ReturnType<typeof useAppOrchestrator>;
