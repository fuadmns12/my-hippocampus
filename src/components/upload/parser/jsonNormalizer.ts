import { MindMapData, MindMapNode } from "../../../types";

/**
 * Normalisasi struktur objek node secara rekursif agar id, label, dan array children terjamin valid
 */
export function normalizeNode(raw: any, fallbackLabel = "Cabang"): MindMapNode {
  if (!raw || typeof raw !== "object") {
    return {
      id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      label: String(raw || fallbackLabel),
    };
  }

  const label =
    String(
      raw.label || raw.name || raw.text || raw.title || raw.topic || fallbackLabel
    ).trim() || fallbackLabel;

  const id = String(
    raw.id || `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  );

  const children = Array.isArray(raw.children)
    ? raw.children.map((c: any, idx: number) =>
        normalizeNode(c, `Sub-cabang ${idx + 1}`)
      )
    : undefined;

  return {
    id,
    label,
    subtitle: typeof raw.subtitle === "string" ? raw.subtitle : undefined,
    emoji: typeof raw.emoji === "string" ? raw.emoji : undefined,
    color: typeof raw.color === "string" ? raw.color : undefined,
    bgColor: typeof raw.bgColor === "string" ? raw.bgColor : undefined,
    borderColor: typeof raw.borderColor === "string" ? raw.borderColor : undefined,
    collapsed: Boolean(raw.collapsed),
    scale: typeof raw.scale === "number" ? raw.scale : undefined,
    children,
    xOffset: typeof raw.xOffset === "number" ? raw.xOffset : undefined,
    yOffset: typeof raw.yOffset === "number" ? raw.yOffset : undefined,
    sourceAnchorSide: raw.sourceAnchorSide,
    targetAnchorSide: raw.targetAnchorSide,
    notes: Array.isArray(raw.notes) ? raw.notes : undefined,
    rawNamesText: typeof raw.rawNamesText === "string" ? raw.rawNamesText : undefined,
  };
}

/**
 * Konversi objek mentah apa pun menjadi format MindMapData yang valid dan siap dirender
 */
export function normalizeMindMap(
  raw: any,
  defaultTitle = "Mind Map"
): MindMapData | null {
  if (!raw || typeof raw !== "object") return null;

  // Jika dibungkus dalam data atau mindMap: e.g. { data: { title, root } }
  let target = raw;
  if (target.data && typeof target.data === "object" && !Array.isArray(target.data)) {
    target = target.data;
  } else if (target.mindMap && typeof target.mindMap === "object") {
    target = target.mindMap;
  }

  // Cari objek root utama
  let rootObj = target.root || target.rootNode || target.tree;
  if (!rootObj) {
    if (Array.isArray(target.children) || target.label || target.name) {
      rootObj = target;
    }
  }

  if (!rootObj || typeof rootObj !== "object") {
    return null;
  }

  const title =
    String(
      target.title ||
        rootObj.label ||
        rootObj.title ||
        rootObj.name ||
        defaultTitle
    ).trim() || defaultTitle;

  const subtitle =
    typeof target.subtitle === "string"
      ? target.subtitle
      : typeof rootObj.subtitle === "string"
      ? rootObj.subtitle
      : "";

  const normalizedRoot = normalizeNode(rootObj, title);

  const additionalRoots = Array.isArray(target.additionalRoots)
    ? target.additionalRoots
        .filter((r: any) => r && typeof r === "object")
        .map((r: any, idx: number) =>
          normalizeNode(r, `Root Tambahan ${idx + 1}`)
        )
    : undefined;

  const connections = Array.isArray(target.connections)
    ? target.connections
        .filter(
          (c: any) =>
            c && typeof c === "object" && c.sourceNodeId && c.targetNodeId
        )
        .map((c: any, idx: number) => ({
          id: String(c.id || `conn-${Date.now()}-${idx}`),
          sourceNodeId: String(c.sourceNodeId),
          sourceAnchorSide: c.sourceAnchorSide || "right",
          targetNodeId: String(c.targetNodeId),
          targetAnchorSide: c.targetAnchorSide || "left",
          label: typeof c.label === "string" ? c.label : undefined,
          color: typeof c.color === "string" ? c.color : undefined,
          style: c.style,
        }))
    : undefined;

  return {
    id: String(
      target.id || `map-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    ),
    title,
    subtitle,
    rawNamesText:
      typeof target.rawNamesText === "string" ? target.rawNamesText : undefined,
    root: normalizedRoot,
    additionalRoots,
    activeRootId:
      typeof target.activeRootId === "string" ? target.activeRootId : undefined,
    connections,
    categories: Array.isArray(target.categories) ? target.categories : undefined,
    folder: target.folder,
    createdAt:
      typeof target.createdAt === "string"
        ? target.createdAt
        : new Date().toISOString(),
    layout: target.layout || "radial",
    theme: target.theme || "cyber-cyan",
    connectorStyle: target.connectorStyle || "bezier",
    nodeShape: target.nodeShape || "rounded",
    groupingStrategy: target.groupingStrategy || "alphabetical",
    customConfig: target.customConfig,
    isUserSaved: true,
  };
}

/**
 * Ekstraksi array objek MindMapData dari file JSON (bisa berupa single map, array maps, atau objek backup)
 */
export function extractMapsFromJson(
  parsed: any,
  defaultTitle = "Mind Map"
): MindMapData[] {
  if (!parsed || typeof parsed !== "object") return [];

  // Kasus 1: Array of mind maps [ {...}, {...} ]
  if (Array.isArray(parsed)) {
    return parsed
      .map((item, idx) =>
        normalizeMindMap(item, `${defaultTitle} ${idx + 1}`)
      )
      .filter((m): m is MindMapData => m !== null);
  }

  // Kasus 2: Backup object dengan properti `maps` array (misal dari exportAllHistoryToJsonFile: { maps: [...] })
  if (Array.isArray(parsed.maps)) {
    return parsed.maps
      .map((item: any, idx: number) =>
        normalizeMindMap(item, `${defaultTitle} ${idx + 1}`)
      )
      .filter((m: any): m is MindMapData => m !== null);
  }

  // Kasus 3: Backup object dengan properti `items` atau `data` array
  if (Array.isArray(parsed.items)) {
    return parsed.items
      .map((item: any, idx: number) =>
        normalizeMindMap(item, `${defaultTitle} ${idx + 1}`)
      )
      .filter((m: any): m is MindMapData => m !== null);
  }
  if (Array.isArray(parsed.data)) {
    return parsed.data
      .map((item: any, idx: number) =>
        normalizeMindMap(item, `${defaultTitle} ${idx + 1}`)
      )
      .filter((m: any): m is MindMapData => m !== null);
  }

  // Kasus 4: Objek Mind Map tunggal
  const single = normalizeMindMap(parsed, defaultTitle);
  if (single) {
    return [single];
  }

  return [];
}
