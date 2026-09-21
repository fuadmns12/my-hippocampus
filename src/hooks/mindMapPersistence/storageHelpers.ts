import { MindMapData } from "../../types";
import { PRESET_TEMPLATES } from "../../data/presets";
import { SaveToHistoryOptions, SaveMultipleToHistoryOptions } from "./types";

export const STORAGE_KEY = "mindmap_generator_history";

export const PRESET_MAP_IDS = new Set(PRESET_TEMPLATES.map((p) => `map-${p.id}`));
export const PRESET_IDS = new Set(PRESET_TEMPLATES.map((p) => p.id));
export const PRESET_TITLES = new Set(
  PRESET_TEMPLATES.map((p) => p.title.trim().toLowerCase())
);

export interface PersistResult {
  success: boolean;
  prunedCount: number;
  error?: unknown;
}

export const persistHistory = (items: MindMapData[]): PersistResult => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return { success: true, prunedCount: 0 };
  } catch (e: any) {
    console.warn("Gagal menyimpan riwayat ke localStorage (kemungkinan kuota penuh):", e);

    const isQuotaError =
      e?.name === "QuotaExceededError" ||
      e?.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
      e?.code === 22 ||
      e?.code === 1014;

    // Jika terjadi kuota penuh dan terdapat lebih dari 1 peta, pangkas item terlama dari belakang
    if (isQuotaError && items.length > 1) {
      const candidate = [...items];
      let pruned = 0;
      while (candidate.length > 1) {
        candidate.pop();
        pruned++;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(candidate));
          console.info(`Berhasil menyimpan riwayat setelah memangkas ${pruned} item terlama.`);
          return { success: true, prunedCount: pruned };
        } catch {
          // Lanjutkan proses pangkas
        }
      }
    }

    return { success: false, prunedCount: 0, error: e };
  }
};

export const loadHistoryFromLocalStorage = (): MindMapData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) return [];

    const userSavedOnly: MindMapData[] = [];
    const seen = new Set<string>();

    for (const item of parsed) {
      // Exclude seeded preset datasets that were not explicitly saved by the user
      const isPresetSeed =
        !item.isUserSaved &&
        (PRESET_MAP_IDS.has(item.id) ||
          PRESET_IDS.has(item.id) ||
          (item.title && PRESET_TITLES.has(item.title.trim().toLowerCase())));

      if (isPresetSeed) continue;

      const key = item.id || (item.title ? item.title.trim().toLowerCase() : "");
      if (key && !seen.has(key)) {
        seen.add(key);
        userSavedOnly.push({
          ...item,
          isUserSaved: true,
          folder:
            item.folder ||
            (item.title && /Tech|Startup|Fitur/.test(item.title) ? "Spesifik" : "Umum"),
        });
      }
    }
    return userSavedOnly;
  } catch (e) {
    console.error("Gagal membaca riwayat dari localStorage:", e);
    return [];
  }
};

export const insertOrUpdateHistoryItem = (
  prev: MindMapData[],
  map: MindMapData,
  options?: SaveToHistoryOptions
): MindMapData[] => {
  if (options?.mode === "copy") {
    // Keep both: always prepend without overwriting existing
    return [map, ...prev].slice(0, 50);
  }

  // Overwrite mode or default: find existing by targetId, map.id, or matching title
  const existingIdx = prev.findIndex(
    (m) =>
      (options?.targetId && m.id === options.targetId) ||
      m.id === map.id ||
      m.title.trim().toLowerCase() === map.title.trim().toLowerCase()
  );

  if (existingIdx >= 0) {
    const remaining = prev.filter((_, idx) => idx !== existingIdx);
    return [{ ...map, id: prev[existingIdx].id }, ...remaining].slice(0, 50);
  } else {
    return [map, ...prev].slice(0, 50);
  }
};

export const insertOrUpdateMultipleHistoryItems = (
  prev: MindMapData[],
  maps: MindMapData[],
  options?: SaveMultipleToHistoryOptions
): MindMapData[] => {
  if (maps.length === 0) return prev;
  const mode = options?.mode || "overwrite";
  const current = [...prev];

  for (const map of maps) {
    const existingIdx = current.findIndex(
      (m) =>
        m.id === map.id ||
        m.title.trim().toLowerCase() === map.title.trim().toLowerCase()
    );

    if (existingIdx >= 0) {
      if (mode === "overwrite") {
        current[existingIdx] = { ...map, id: current[existingIdx].id };
      } else if (mode === "copy") {
        const copyMap: MindMapData = {
          ...map,
          id: `map-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: `${map.title} (Salinan)`,
          root: {
            ...map.root,
            label: `${map.root.label || map.title} (Salinan)`,
          },
        };
        current.unshift(copyMap);
      }
      // if mode === "skip", do not overwrite existing map
    } else {
      current.unshift(map);
    }
  }

  return current.slice(0, 50);
};
