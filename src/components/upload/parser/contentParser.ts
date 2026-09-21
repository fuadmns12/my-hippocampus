import { MindMapData } from "../../../types";
import { ParsedTextInfo } from "./types";
import { extractMapsFromJson } from "./jsonNormalizer";
import { parseRawTextFile } from "./textParser";

export interface ProcessContentResult {
  parsedData: MindMapData | null;
  parsedBackupMaps: MindMapData[] | null;
  parsedTextInfo: ParsedTextInfo | null;
  errorMsg: string | null;
}

/**
 * Parses raw text or JSON string (from file upload or direct clipboard paste)
 * into a structured MindMapData or outline text.
 */
export function parseUploadedOrPastedContent(
  rawContent: string,
  sourceName = "Tempelan Gemini"
): ProcessContentResult {
  const content = rawContent.trim();
  if (!content) {
    return {
      parsedData: null,
      parsedBackupMaps: null,
      parsedTextInfo: null,
      errorMsg: null,
    };
  }

  // 1. Strip Markdown code fences if user copied ```json ... ``` from Gemini
  let cleanedJson = content;
  if (cleanedJson.startsWith("```")) {
    cleanedJson = cleanedJson
      .replace(/^```(?:json)?\s*\n?/i, "")
      .replace(/\n?```\s*$/i, "")
      .trim();
  }

  // 2. Check if content looks like JSON object or array
  const isLikelyJson =
    (cleanedJson.startsWith("{") && cleanedJson.endsWith("}")) ||
    (cleanedJson.startsWith("[") && cleanedJson.endsWith("]"));

  if (isLikelyJson) {
    try {
      const parsed = JSON.parse(cleanedJson);
      const maps = extractMapsFromJson(parsed, sourceName);

      if (maps.length === 1) {
        return {
          parsedData: maps[0],
          parsedBackupMaps: null,
          parsedTextInfo: null,
          errorMsg: null,
        };
      } else if (maps.length > 1) {
        return {
          parsedData: maps[0],
          parsedBackupMaps: maps,
          parsedTextInfo: null,
          errorMsg: null,
        };
      } else {
        return {
          parsedData: null,
          parsedBackupMaps: null,
          parsedTextInfo: null,
          errorMsg:
            "Format berkas atau teks JSON tidak dikenali sebagai Mind Map. Pastikan memiliki struktur cabang atau backup yang valid.",
        };
      }
    } catch {
      return {
        parsedData: null,
        parsedBackupMaps: null,
        parsedTextInfo: null,
        errorMsg: "Gagal mengurai teks JSON. Format sintaks tidak valid.",
      };
    }
  }

  // 3. Treat as Outline / Markdown List / Plain Text
  const textResult = parseRawTextFile(content, sourceName);
  if (textResult.error) {
    return {
      parsedData: null,
      parsedBackupMaps: null,
      parsedTextInfo: null,
      errorMsg: textResult.error,
    };
  }

  return {
    parsedData: null,
    parsedBackupMaps: null,
    parsedTextInfo: textResult.data || null,
    errorMsg: null,
  };
}
