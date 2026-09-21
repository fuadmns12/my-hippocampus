export type MindMapLayout =
  | "radial"
  | "horizontal-tree"
  | "vertical-tree"
  | "fishbone"
  | "bubble-cluster"
  | "bilateral-bracket"
  | "grid-network";

export type LayoutType = MindMapLayout;

export type ColorTheme =
  | "pastel"
  | "neon-dark"
  | "sunset"
  | "corporate"
  | "emerald"
  | "monochrome"
  | "my-version";

export type ConnectorStyle =
  | "bezier"
  | "straight"
  | "angled"
  | "dotted"
  | "animated-dashed";

export type NodeShape =
  | "rounded"
  | "pill"
  | "sharp"
  | "oval"
  | "hexagon"
  | "circle";

export type GroupingStrategy =
  | "alphabetical"
  | "balanced-spokes"
  | "flat-direct";

export interface NodeNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  subtitle?: string;
  emoji?: string;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  collapsed?: boolean;
  scale?: number; // Custom node size scaling factor (e.g. 0.8, 1.0, 1.25, 1.5, 2.0)
  children?: MindMapNode[];
  // Custom layout offsets if dragged
  xOffset?: number;
  yOffset?: number;
  sourceAnchorSide?: AnchorSide;
  targetAnchorSide?: AnchorSide;
  notes?: NodeNote[];
  rawNamesText?: string;
}

export interface MindMapCategory {
  id: string;
  name: string;
  emoji?: string;
  color: string;
  items: Array<{
    name: string;
    roleOrNote?: string;
    emoji?: string;
  }>;
}

export type DocumentFolder = "Umum" | "Spesifik";

export type AnchorSide = "top" | "bottom" | "left" | "right";

export interface CustomConnection {
  id: string;
  sourceNodeId: string;
  sourceAnchorSide: AnchorSide;
  targetNodeId: string;
  targetAnchorSide: AnchorSide;
  label?: string;
  color?: string;
  style?: ConnectorStyle;
}

export interface BoundaryGroup {
  id: string;
  title: string;
  nodeIds: string[];
  color?: string;
  style?: "cloud" | "rounded" | "dashed";
}

export interface MindMapData {
  id: string;
  title: string;
  subtitle?: string;
  rawNamesText?: string;
  root: MindMapNode;
  additionalRoots?: MindMapNode[];
  activeRootId?: string;
  categories?: MindMapCategory[];
  createdAt: string;
  layout: MindMapLayout;
  theme: ColorTheme;
  connectorStyle?: ConnectorStyle;
  nodeShape?: NodeShape;
  groupingStrategy?: GroupingStrategy;
  customConfig?: CustomGroupingConfig;
  folder?: DocumentFolder;
  isUserSaved?: boolean;
  connections?: CustomConnection[];
  boundaries?: BoundaryGroup[];
  showBranchBoundaries?: boolean;
}

export interface CustomGroupingConfig {
  // Alphabetical
  alphabetMode: "range" | "count";
  alphabetRanges: string; // e.g. "A-G, H-M, N-S, T-Z"
  alphabetNumGroups: number; // e.g. 4
  alphabetIncludeOthers: boolean;

  // Balanced Spokes
  balancedBranchCount: number; // e.g. 4
  balancedBranchPrefix: string; // e.g. "Kelompok"
  balancedDistributionMode: "round-robin" | "chunk";

  // Flat Direct
  flatEmoji: string; // e.g. "👤"
  flatSortOrder: "original" | "asc" | "desc";
}

export interface PresetTemplate {
  id: string;
  title: string;
  subtitle: string;
  names: string[];
  suggestedLayout: MindMapLayout;
  suggestedTheme: ColorTheme;
  suggestedConnectorStyle?: ConnectorStyle;
  suggestedNodeShape?: NodeShape;
  suggestedGroupingStrategy?: GroupingStrategy;
  customConfig?: Partial<CustomGroupingConfig>;
  folder?: DocumentFolder;
  rootNotes?: NodeNote[];
  nodeNotes?: Record<string, NodeNote[]>;
  badgeLabel?: string;
}

export type ImportConflictResolution = "overwrite" | "copy" | "skip";
