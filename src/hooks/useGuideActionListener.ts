import { useEffect } from "react";
import {
  GUIDE_ACTION_EVENT,
  GuideActionType,
  flashHighlightElement,
} from "../utils/guideActions";

interface UseGuideActionListenerProps {
  inputs: {
    setIsInputCollapsed: (val: boolean) => void;
    setIsLayoutThemeOpen: (val: boolean) => void;
    setShowSettingsModal: (val: boolean) => void;
    setShowHistory: (val: boolean) => void;
    setShowUploadModal: (val: boolean) => void;
    namesText: string;
  };
  exporters: {
    handleExportPng: () => void;
    handleExportSvg: () => void;
    handleExportJson: () => void;
    handleExportMarkdown: () => void;
  };
  persistence: {
    handleSaveCurrentMap: () => void;
  };
  actions: {
    handleGenerate: () => void;
    handleOpenNewMindMap: () => void;
  };
  handleToggleFullscreen: () => void;
}

export function useGuideActionListener({
  inputs,
  exporters,
  persistence,
  actions,
  handleToggleFullscreen,
}: UseGuideActionListenerProps) {
  useEffect(() => {
    const handleGuideAction = (e: Event) => {
      const customEvent = e as CustomEvent<{ action: GuideActionType }>;
      const action = customEvent.detail?.action;
      if (!action) return;

      switch (action) {
        case "OPEN_INPUT_PANEL": {
          inputs.setIsInputCollapsed(false);
          setTimeout(() => {
            const el =
              document.getElementById("input-panel-section") ||
              document.getElementById("input-panel");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              flashHighlightElement(el);
            }
            const textarea = document.getElementById("names-textarea");
            if (textarea) {
              textarea.focus();
            }
          }, 80);
          break;
        }

        case "OPEN_LAYOUT_THEME": {
          inputs.setIsLayoutThemeOpen(true);
          setTimeout(() => {
            const el = document.getElementById("layout-theme-selector");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              flashHighlightElement(el);
            }
          }, 80);
          break;
        }

        case "OPEN_SETTINGS":
        case "OPEN_SETTINGS_MUSIC": {
          inputs.setShowSettingsModal(true);
          break;
        }

        case "OPEN_HISTORY": {
          inputs.setShowHistory(true);
          break;
        }

        case "OPEN_UPLOAD": {
          inputs.setShowUploadModal(true);
          break;
        }

        case "OPEN_EXPORT_MENU": {
          const exportBtn = document.getElementById("btn-export-dropdown");
          if (exportBtn) {
            exportBtn.click();
            flashHighlightElement(exportBtn);
          } else {
            exporters.handleExportPng();
          }
          break;
        }

        case "EXPORT_PNG": {
          exporters.handleExportPng();
          break;
        }

        case "EXPORT_SVG": {
          exporters.handleExportSvg();
          break;
        }

        case "EXPORT_JSON": {
          exporters.handleExportJson();
          break;
        }

        case "EXPORT_MARKDOWN": {
          exporters.handleExportMarkdown();
          break;
        }

        case "SAVE_MINDMAP": {
          persistence.handleSaveCurrentMap();
          break;
        }

        case "TOGGLE_FULLSCREEN": {
          handleToggleFullscreen();
          break;
        }

        case "GENERATE_MINDMAP": {
          if (inputs.namesText.trim()) {
            actions.handleGenerate();
          } else {
            inputs.setIsInputCollapsed(false);
            setTimeout(() => {
              const el = document.getElementById("input-panel-section");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                flashHighlightElement(el);
              }
            }, 80);
          }
          break;
        }

        case "ADD_TO_CANVAS": {
          inputs.setIsInputCollapsed(false);
          actions.handleOpenNewMindMap();
          setTimeout(() => {
            const el = document.getElementById("input-panel-section");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              flashHighlightElement(el);
            }
          }, 80);
          break;
        }

        case "SCROLL_CANVAS": {
          const canvasEl =
            document.getElementById("canvas-container") ||
            document.getElementById("mind-map-svg") ||
            document.getElementById("empty-canvas-container");
          if (canvasEl) {
            canvasEl.scrollIntoView({ behavior: "smooth", block: "center" });
            flashHighlightElement(canvasEl);
          }
          break;
        }
      }
    };

    window.addEventListener(GUIDE_ACTION_EVENT, handleGuideAction);
    return () => {
      window.removeEventListener(GUIDE_ACTION_EVENT, handleGuideAction);
    };
  }, [inputs, exporters, persistence, actions, handleToggleFullscreen]);
}
