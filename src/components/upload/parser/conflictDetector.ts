import { MindMapData } from "../../../types";
import { ParsedTextInfo } from "./types";

/**
 * Mencari konflik jika ada peta pikiran di Memory Card yang memiliki ID atau judul yang sama dengan data yang diunggah
 */
export function findConflictingMap(
  savedHistory: MindMapData[] | undefined,
  parsedData: MindMapData | null,
  parsedTextInfo: ParsedTextInfo | null
): MindMapData | null {
  if (!savedHistory || savedHistory.length === 0) return null;

  if (parsedData) {
    return (
      savedHistory.find(
        (m) =>
          m.id === parsedData.id ||
          m.title.trim().toLowerCase() === parsedData.title.trim().toLowerCase()
      ) || null
    );
  }

  if (parsedTextInfo) {
    return (
      savedHistory.find(
        (m) =>
          m.title.trim().toLowerCase() === parsedTextInfo.title.trim().toLowerCase()
      ) || null
    );
  }

  return null;
}

/**
 * Mencari daftar peta pikiran di dalam file cadangan (backup) yang berkonflik dengan Memory Card
 */
export function findConflictingBackupMaps(
  savedHistory: MindMapData[] | undefined,
  parsedBackupMaps: MindMapData[] | null
): MindMapData[] {
  if (!savedHistory || savedHistory.length === 0 || !parsedBackupMaps) return [];

  return parsedBackupMaps.filter((bm) =>
    savedHistory.some(
      (sm) =>
        sm.id === bm.id ||
        sm.title.trim().toLowerCase() === bm.title.trim().toLowerCase()
    )
  );
}
