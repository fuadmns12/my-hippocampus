/**
 * Definisi aksi panduan interaktif website.
 * Mengubah perintah teks/tombol pada pesan bot panduan menjadi tombol interaktif
 * yang dapat langsung mengarahkan tampilan (smooth scroll view) atau memunculkan popup (modal).
 */

export type GuideActionType =
  | "OPEN_INPUT_PANEL"
  | "OPEN_LAYOUT_THEME"
  | "OPEN_SETTINGS"
  | "OPEN_SETTINGS_MUSIC"
  | "OPEN_HISTORY"
  | "OPEN_UPLOAD"
  | "OPEN_EXPORT_MENU"
  | "EXPORT_PNG"
  | "EXPORT_SVG"
  | "EXPORT_JSON"
  | "EXPORT_MARKDOWN"
  | "SAVE_MINDMAP"
  | "SCROLL_CANVAS"
  | "TOGGLE_FULLSCREEN"
  | "GENERATE_MINDMAP"
  | "ADD_TO_CANVAS";

export interface GuideActionMeta {
  type: GuideActionType;
  label: string;
  kind: "scroll" | "popup" | "action";
  badgeText: string;
  description: string;
}

export const GUIDE_ACTION_EVENT = "mate-guide-action";
