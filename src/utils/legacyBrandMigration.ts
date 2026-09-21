import { safeStorage } from "./safeStorage";

/**
 * Migrasi kunci penyimpanan lama (branding "Mate") ke kunci baru ("My Hippocampus").
 *
 * Kunci lama tetap dibaca sekali saat aplikasi pertama kali dimulai setelah rebranding:
 * nilainya disalin ke kunci baru (hanya bila kunci baru belum pernah diisi), lalu kunci
 * lama dihapus. Dengan begitu pengaturan, playlist musik YouTube, riwayat chat bot, dan
 * preferensi mode offline MILIK PENGGUNA LAMA tidak hilang.
 */

/** Pasangan [kunci lama, kunci baru] seluruh data yang disimpan di localStorage. */
export const BRAND_STORAGE_KEY_MIGRATIONS: ReadonlyArray<
  readonly [legacyKey: string, currentKey: string]
> = [
  ["mate_yt_music_url", "my_hippocampus_yt_music_url"],
  ["mate_yt_music_volume", "my_hippocampus_yt_music_volume"],
  ["mate_yt_music_muted", "my_hippocampus_yt_music_muted"],
  ["mate_yt_music_show_floating", "my_hippocampus_yt_music_show_floating"],
  ["mate_yt_music_playlist", "my_hippocampus_yt_music_playlist"],
  ["mate_yt_music_auto_advance", "my_hippocampus_yt_music_auto_advance"],
  ["mate_yt_music_active_track", "my_hippocampus_yt_music_active_track"],
  ["mate_website_guide_settings", "my_hippocampus_website_guide_settings"],
  ["mate_website_guide_messages", "my_hippocampus_website_guide_messages"],
  ["mate_pwa_offline_confirmed", "my_hippocampus_pwa_offline_confirmed"],
];

/**
 * Jalankan sekali saat aplikasi dimulai (lihat `src/main.tsx`).
 * Aman dipanggil berkali-kali: kunci lama yang sudah tidak ada hanya dilewati.
 */
export function migrateLegacyBrandStorageKeys(): void {
  if (typeof window === "undefined") return;

  for (const [legacyKey, currentKey] of BRAND_STORAGE_KEY_MIGRATIONS) {
    const legacyValue = safeStorage.getItem(legacyKey);
    if (legacyValue === null) continue;

    if (safeStorage.getItem(currentKey) === null) {
      safeStorage.setItem(currentKey, legacyValue);
    }

    safeStorage.removeItem(legacyKey);
  }
}
