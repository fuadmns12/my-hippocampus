import React from "react";
import { Network, Palette, Spline, Shapes } from "lucide-react";
import {
  MindMapLayout,
  ColorTheme,
  ConnectorStyle,
  NodeShape,
} from "../types";
import { CustomSelect } from "./common/CustomSelect";
import {
  getLayoutSelectOptions,
  getThemeSelectOptions,
  CONNECTOR_SELECT_OPTIONS,
  NODE_SHAPE_SELECT_OPTIONS,
} from "./layoutThemeOptions";

export interface LayoutThemeControlsGridProps {
  currentLayout: MindMapLayout;
  setLayout: (l: MindMapLayout) => void;
  currentTheme: ColorTheme;
  setTheme: (t: ColorTheme) => void;
  currentConnector: ConnectorStyle;
  setConnector: (c: ConnectorStyle) => void;
  currentNodeShape: NodeShape;
  setNodeShape: (s: NodeShape) => void;
}

export const LayoutThemeControlsGrid: React.FC<LayoutThemeControlsGridProps> = ({
  currentLayout,
  setLayout,
  currentTheme,
  setTheme,
  currentConnector,
  setConnector,
  currentNodeShape,
  setNodeShape,
}) => {
  const layoutSelectOptions = getLayoutSelectOptions();
  const themeSelectOptions = getThemeSelectOptions();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Mind Map Layout Selector */}
      <div id="layout-selector-wrapper">
        <label
          htmlFor="layout-select"
          className="block text-[11px] sm:text-xs font-semibold text-white mb-1.5 sm:mb-2 flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-white" />
            <span className="text-white">Tata Letak (Layout)</span>
          </span>
          <span className="text-[10px] text-white font-medium">7 Model</span>
        </label>
        <CustomSelect
          id="layout-select"
          value={currentLayout}
          onChange={(val) => setLayout(val as MindMapLayout)}
          options={layoutSelectOptions}
          ariaLabel="Pilih Tata Letak Mind Map"
        />
      </div>

      {/* Color Theme Selector */}
      <div id="theme-selector-wrapper">
        <label
          htmlFor="theme-select"
          className="block text-[11px] sm:text-xs font-semibold text-white mb-1.5 sm:mb-2 flex items-center gap-1.5"
        >
          <Palette className="w-3.5 h-3.5 text-white" />
          <span className="text-white">Tema Warna & Gaya Visual</span>
        </label>
        <CustomSelect
          id="theme-select"
          value={currentTheme}
          onChange={(val) => setTheme(val as ColorTheme)}
          options={themeSelectOptions}
          ariaLabel="Pilih Tema Warna"
        />
      </div>

      {/* Connector Line Style Picker */}
      <div id="connector-selector-wrapper">
        <label
          htmlFor="connector-select"
          className="block text-[11px] sm:text-xs font-semibold text-white mb-1.5 sm:mb-2 flex items-center gap-1.5"
        >
          <Spline className="w-3.5 h-3.5 text-white" />
          <span className="text-white">Bentuk Garis Penghubung</span>
        </label>
        <CustomSelect
          id="connector-select"
          value={currentConnector}
          onChange={(val) => setConnector(val as ConnectorStyle)}
          options={CONNECTOR_SELECT_OPTIONS}
          ariaLabel="Pilih Bentuk Garis Penghubung"
        />
      </div>

      {/* Node Shape Picker */}
      <div id="node-shape-selector-wrapper">
        <label
          htmlFor="node-shape-select"
          className="block text-[11px] sm:text-xs font-semibold text-white mb-1.5 sm:mb-2 flex items-center gap-1.5"
        >
          <Shapes className="w-3.5 h-3.5 text-white" />
          <span className="text-white">Bentuk Kartu Ide</span>
        </label>
        <CustomSelect
          id="node-shape-select"
          value={currentNodeShape}
          onChange={(val) => setNodeShape(val as NodeShape)}
          options={NODE_SHAPE_SELECT_OPTIONS}
          ariaLabel="Pilih Bentuk Kartu Ide"
        />
      </div>
    </div>
  );
};
