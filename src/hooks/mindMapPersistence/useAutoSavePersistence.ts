import React from "react";
import { MindMapData } from "../../types";
import { AutoSaveDependencies } from "./types";

/**
 * Hook Auto-Save (Dinonaktifkan sesuai permintaan pengguna).
 * Penyimpanan mind map tidak lagi dilakukan secara otomatis di latar belakang,
 * melainkan HANYA dipicu secara eksplisit saat tombol Simpan diklik.
 */
export function useAutoSavePersistence(
  _deps: AutoSaveDependencies,
  _activeHistoryId: string | null,
  _setSavedHistory: React.Dispatch<React.SetStateAction<MindMapData[]>>
) {
  // Auto-save dinonaktifkan secara total.
  // Tidak ada timeout atau efek latar belakang yang menyimpan data secara diam-diam.
}

