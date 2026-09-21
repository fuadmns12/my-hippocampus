import { MindMapLayout } from "../../types";
import { soundFx } from "../../utils/soundEffects";
import { extractLeafNamesFromTree } from "../../utils/nodeTreeOperations";
import { MindMapActionsProps } from "./index";

export function useMapNavigationActions({
  inputs,
  tree,
  persistence,
  showToast,
}: MindMapActionsProps) {
  // Switch which mind map is currently being edited in the Input Panel
  const handleSelectRoot = (rootId: string) => {
    soundFx.play("click");
    tree.handleSetActiveRoot(rootId);
    const all = tree.getAllRoots();
    const target = all.find((r) => r.id === rootId);
    if (target) {
      inputs.setTitle(target.label);
      inputs.setSubtitle(target.subtitle || "");
      if (target.rawNamesText) {
        inputs.setNamesText(target.rawNamesText);
      } else {
        const leafNames = extractLeafNamesFromTree(target);
        inputs.setNamesText(leafNames.join("\n"));
      }
      showToast(`Beralih mengedit Mind Map "${target.label}".`);
    }
  };

  // Clear form fields to start typing a new mind map easily
  const handleResetForm = () => {
    soundFx.play("click");
    inputs.setTitle("");
    inputs.setSubtitle("");
    inputs.setNamesText("");
    showToast("Form dikosongkan. Masukkan topik baru untuk menambah Mind Map ke kanvas.");
  };

  const handleSelectLayout = (newLayout: MindMapLayout) => {
    soundFx.play("toggle");
    inputs.setLayout(newLayout);
    tree.handleResetNodeOffsets();
  };

  const handleReset = () => {
    soundFx.play("delete");
    inputs.setTitle("");
    inputs.setSubtitle("");
    inputs.setNamesText("");
    inputs.setGroupingStrategy("alphabetical");
    tree.setMindMapData(null);
    persistence.setActiveHistoryId(null);
    inputs.setIsInputCollapsed(false);
    showToast("Form dikosongkan. Silakan buat Mind Map baru!");
  };

  // Buka panel form dalam kondisi bersih untuk memasukkan Mind Mapping baru
  const handleOpenNewMindMap = () => {
    soundFx.play("click");
    inputs.setTitle("");
    inputs.setSubtitle("");
    inputs.setNamesText("");
    inputs.setIsInputCollapsed(false);
    inputs.setIsLayoutThemeOpen(true);
    showToast("Form siap untuk memasukkan Mind Mapping baru.");
    setTimeout(() => {
      const inputEl = document.getElementById("input-panel-section");
      if (inputEl) {
        inputEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      const titleInput = document.getElementById("input-topic-title");
      if (titleInput) {
        titleInput.focus();
      }
    }, 80);
  };

  // Buka panel form dalam mode edit untuk memodifikasi Mind Map yang aktif di kanvas
  const handleOpenEditMindMap = () => {
    soundFx.play("click");
    if (tree.mindMapData) {
      const target = tree.getActiveRoot() || tree.mindMapData.root;
      if (target) {
        inputs.setTitle(target.label);
        inputs.setSubtitle(target.subtitle || "");
        if (target.rawNamesText !== undefined && target.rawNamesText.trim().length > 0) {
          inputs.setNamesText(target.rawNamesText);
        } else {
          const leafNames = extractLeafNamesFromTree(target);
          inputs.setNamesText(leafNames.join("\n"));
        }
      }
    }

    const isPanelOpen = !inputs.isInputCollapsed || inputs.isLayoutThemeOpen;
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
  };

  return {
    handleSelectRoot,
    handleResetForm,
    handleSelectLayout,
    handleReset,
    handleOpenNewMindMap,
    handleOpenEditMindMap,
  };
}
