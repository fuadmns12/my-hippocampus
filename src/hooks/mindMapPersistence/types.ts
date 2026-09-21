import {
  MindMapData,
  MindMapLayout,
  ColorTheme,
  ConnectorStyle,
  NodeShape,
  GroupingStrategy,
  CustomGroupingConfig,
  DocumentFolder,
} from "../../types";

export interface AutoSaveDependencies {
  mindMapData: MindMapData | null;
  title: string;
  subtitle: string;
  namesText: string;
  currentFolder: DocumentFolder;
  layout: MindMapLayout;
  theme: ColorTheme;
  connectorStyle: ConnectorStyle;
  nodeShape: NodeShape;
  groupingStrategy: GroupingStrategy;
  customConfig: CustomGroupingConfig;
}

export interface SaveToHistoryOptions {
  mode?: "overwrite" | "copy";
  targetId?: string;
}

export interface SaveMultipleToHistoryOptions {
  mode?: "overwrite" | "copy" | "skip";
}
