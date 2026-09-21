import React, { useState } from "react";
import {
  MindMapLayout,
  ColorTheme,
  ConnectorStyle,
  NodeShape,
} from "../types";
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import { LayoutThemeControlsGrid } from "./LayoutThemeControlsGrid";
import { soundFx } from "../utils/soundEffects";

interface LayoutThemeSelectorProps {
  currentLayout: MindMapLayout;
  setLayout: (l: MindMapLayout) => void;
  currentTheme: ColorTheme;
  setTheme: (t: ColorTheme) => void;
  currentConnector: ConnectorStyle;
  setConnector: (c: ConnectorStyle) => void;
  currentNodeShape: NodeShape;
  setNodeShape: (s: NodeShape) => void;
  onClose?: () => void;
}

export const LayoutThemeSelector: React.FC<LayoutThemeSelectorProps> = ({
  currentLayout,
  setLayout,
  currentTheme,
  setTheme,
  currentConnector,
  setConnector,
  currentNodeShape,
  setNodeShape,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    soundFx.play("toggle");
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      id="layout-theme-selector"
      className="bg-black border border-cyan-500/40 rounded-2xl shadow-2xl transition-all"
    >
      {/* Header bar with summary badge & collapse toggle */}
      <div
        id="layout-theme-header"
        onClick={handleToggle}
        className={`p-3 sm:p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-950 transition-colors select-none ${
          isCollapsed ? "rounded-2xl" : "rounded-t-2xl"
        }`}
        title={isCollapsed ? "Buka Pengaturan Tata Letak & Gaya" : "Tutup Pengaturan Tata Letak & Gaya"}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-black border border-cyan-500/30 text-white">
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xs font-semibold text-white">
              Pengaturan Tata Letak & Gaya Visual
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="close-layout-theme-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className="p-1.5 rounded-lg bg-black border border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 hover:bg-neutral-900 transition-colors cursor-pointer flex items-center justify-center shadow-xs"
            title={isCollapsed ? "Buka Pengaturan Tata Letak & Gaya" : "Tutup Pengaturan Tata Letak & Gaya"}
            aria-label={isCollapsed ? "Buka Pengaturan" : "Tutup Pengaturan"}
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-cyan-400" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Options Content */}
      {!isCollapsed && (
        <div
          id="layout-theme-options-content"
          className="p-4 pt-2.5 border-t border-cyan-500/30 bg-black rounded-b-2xl"
        >
          <LayoutThemeControlsGrid
            currentLayout={currentLayout}
            setLayout={setLayout}
            currentTheme={currentTheme}
            setTheme={setTheme}
            currentConnector={currentConnector}
            setConnector={setConnector}
            currentNodeShape={currentNodeShape}
            setNodeShape={setNodeShape}
          />
        </div>
      )}
    </div>
  );
};

