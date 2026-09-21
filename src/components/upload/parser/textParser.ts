import { ParsedTextInfo } from "./types";

export interface TextParseResult {
  data?: ParsedTextInfo;
  error?: string;
}

/**
 * Parsing konten teks biasa (.txt) atau dokumen markdown (.md) menjadi struktur judul, subjudul, dan daftar cabang
 */
export function parseRawTextFile(
  content: string,
  fileName: string
): TextParseResult {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { error: "Berkas teks kosong." };
  }

  let extractedTitle = fileName.replace(/\.[^/.]+$/, "");
  let extractedSubtitle = "Diimpor dari berkas teks";
  const names: string[] = [];

  for (const line of lines) {
    if (line.startsWith("# ")) {
      extractedTitle = line.replace("# ", "").trim();
    } else if (
      line.startsWith("## ") ||
      line.startsWith("_") ||
      line.startsWith("*")
    ) {
      extractedSubtitle = line.replace(/^[#_*]+|[#_*]+$/g, "").trim();
    } else {
      // Hapus bullet points markdown seperti "- ", "* ", "1. ", "• "
      const cleanLine = line.replace(/^[-*•]\s+|\d+\.\s+/, "").trim();
      if (cleanLine.length > 0) {
        names.push(cleanLine);
      }
    }
  }

  if (names.length === 0) {
    return {
      error: "Tidak ditemukan daftar nama/item yang dapat dibaca di dalam berkas teks.",
    };
  }

  return {
    data: {
      title: extractedTitle,
      subtitle: extractedSubtitle,
      names,
    },
  };
}
