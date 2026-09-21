import { useState } from "react";
import {
  MindMapLayout,
  ColorTheme,
  ConnectorStyle,
  NodeShape,
  GroupingStrategy,
  CustomGroupingConfig,
  DocumentFolder,
} from "../types";
import { PRESET_TEMPLATES } from "../data/presets";

export function useMindMapInputs() {
  const [title, setTitle] = useState("Topik Utama");
  const [subtitle, setSubtitle] = useState("");
  const [namesText, setNamesText] = useState("");
  const [currentFolder, setCurrentFolder] = useState<DocumentFolder>("Umum");
  const [groupingStrategy, setGroupingStrategy] =
    useState<GroupingStrategy>("alphabetical");

  const [customConfig, setCustomConfig] = useState<CustomGroupingConfig>({
    alphabetMode: "range",
    alphabetRanges: "A-G, H-M, N-S, T-Z",
    alphabetNumGroups: 4,
    alphabetIncludeOthers: true,
    balancedBranchCount: 4,
    balancedBranchPrefix: "Kelompok",
    balancedDistributionMode: "round-robin",
    flatEmoji: "👤",
    flatSortOrder: "original",
  });

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsStrategy, setSettingsStrategy] =
    useState<GroupingStrategy>("alphabetical");

  const [layout, setLayout] = useState<MindMapLayout>("radial");
  const [theme, setTheme] = useState<ColorTheme>("neon-dark");
  const [connectorStyle, setConnectorStyle] =
    useState<ConnectorStyle>("bezier");
  const [nodeShape, setNodeShape] = useState<NodeShape>("rounded");

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isInputCollapsed, setIsInputCollapsed] = useState(true);
  const [isLayoutThemeOpen, setIsLayoutThemeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"canvas" | "outline">("canvas");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return {
    title,
    setTitle,
    subtitle,
    setSubtitle,
    namesText,
    setNamesText,
    currentFolder,
    setCurrentFolder,
    groupingStrategy,
    setGroupingStrategy,
    customConfig,
    setCustomConfig,
    showSettingsModal,
    setShowSettingsModal,
    settingsStrategy,
    setSettingsStrategy,
    layout,
    setLayout,
    theme,
    setTheme,
    connectorStyle,
    setConnectorStyle,
    nodeShape,
    setNodeShape,
    isAiLoading,
    setIsAiLoading,
    isInputCollapsed,
    setIsInputCollapsed,
    isLayoutThemeOpen,
    setIsLayoutThemeOpen,
    activeTab,
    setActiveTab,
    showUploadModal,
    setShowUploadModal,
    showHistory,
    setShowHistory,
  };
}
