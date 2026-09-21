import { NodeNote } from "../../types";

/**
 * Format string tanggal ISO ke format pembacaan lokal Indonesia (id-ID).
 */
export function formatNoteDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

/**
 * Membuat objek catatan baru yang kosong.
 */
export function createEmptyNote(): NodeNote {
  return {
    id: `note-${Date.now()}`,
    title: "",
    content: "",
    createdAt: new Date().toISOString(),
  };
}

/**
 * Menyaring catatan yang benar-benar kosong (tanpa judul dan tanpa isi).
 */
export function filterValidNotes(notes: NodeNote[]): NodeNote[] {
  return notes.filter(
    (n) => n.title.trim() !== "" || n.content.trim() !== ""
  );
}

/**
 * Memperbarui properti catatan tertentu di dalam daftar catatan.
 */
export function updateNoteInList(
  list: NodeNote[],
  noteId: string,
  updates: Partial<NodeNote>
): NodeNote[] {
  return list.map((n) => (n.id === noteId ? { ...n, ...updates } : n));
}
