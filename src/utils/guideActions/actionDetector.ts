import { GuideActionMeta, GuideActionType } from "./types";

interface ActionRule {
  type: GuideActionType;
  label: string;
  kind: "scroll" | "popup" | "action";
  badgeText: string;
  description: string;
  matches: string[];
  startsWith?: string[];
}

const ACTION_RULES: ActionRule[] = [
  {
    type: "OPEN_INPUT_PANEL",
    label: "Buka Panel Input",
    kind: "scroll",
    badgeText: "Scroll",
    description: "Scroll ke formulir pembuatan mind map",
    matches: [
      "buka panel input",
      "panel input",
      "buka panel masukan",
      "panel masukan",
      "buka input",
      "input panel",
    ],
  },
  {
    type: "OPEN_LAYOUT_THEME",
    label: "Tata Letak & Gaya",
    kind: "scroll",
    badgeText: "Scroll",
    description: "Scroll ke pengaturan tata letak, tema warna & konektor",
    matches: [
      "tata letak & gaya",
      "tata letak & gaya visual",
      "panel tata letak",
      "pilih tata letak",
      "bilah tata letak",
      "bilah tata letak & gaya",
    ],
  },
  {
    type: "OPEN_SETTINGS_MUSIC",
    label: "Musik YouTube",
    kind: "popup",
    badgeText: "Popup",
    description: "Buka popup pemutar musik YouTube",
    matches: [
      "musik latar belakang youtube",
      "musik youtube",
      "pemutar musik youtube",
    ],
  },
  {
    type: "OPEN_SETTINGS",
    label: "Pengaturan",
    kind: "popup",
    badgeText: "Popup",
    description: "Buka popup pengaturan website",
    matches: [
      "pengaturan",
      "menu pengaturan",
      "buka pengaturan",
      "settings",
    ],
  },
  {
    type: "OPEN_HISTORY",
    label: "Riwayat",
    kind: "popup",
    badgeText: "Popup",
    description: "Buka daftar riwayat dokumen tersimpan",
    matches: ["riwayat", "buka riwayat", "history", "riwayat dokumen"],
  },
  {
    type: "OPEN_UPLOAD",
    label: "Unggah / Import",
    kind: "popup",
    badgeText: "Popup",
    description: "Buka popup unggah berkas JSON/Text",
    matches: [
      "unggah",
      "buka unggah",
      "upload",
      "impor",
      "import",
      "unggah berkas",
    ],
  },
  {
    type: "EXPORT_PNG",
    label: "Ekspor PNG",
    kind: "action",
    badgeText: "Unduh",
    description: "Unduh gambar PNG mind map",
    matches: ["ekspor png", "export png"],
    startsWith: ["png (gambar"],
  },
  {
    type: "EXPORT_SVG",
    label: "Ekspor SVG",
    kind: "action",
    badgeText: "Unduh",
    description: "Unduh vektor SVG mind map",
    matches: ["ekspor svg", "export svg"],
    startsWith: ["svg (vektor"],
  },
  {
    type: "EXPORT_JSON",
    label: "Ekspor JSON",
    kind: "action",
    badgeText: "Unduh",
    description: "Unduh file cadangan JSON mind map",
    matches: ["ekspor json", "export json"],
    startsWith: ["json (cadangan"],
  },
  {
    type: "EXPORT_MARKDOWN",
    label: "Ekspor Markdown",
    kind: "action",
    badgeText: "Unduh",
    description: "Unduh dokumen Markdown",
    matches: ["ekspor markdown", "export markdown", "markdown (.md)"],
  },
  {
    type: "OPEN_EXPORT_MENU",
    label: "Menu Ekspor",
    kind: "popup",
    badgeText: "Popup",
    description: "Buka menu pilihan ekspor PNG/SVG/JSON",
    matches: ["ekspor", "export", "menu ekspor", "tombol ekspor"],
  },
  {
    type: "SAVE_MINDMAP",
    label: "Simpan",
    kind: "action",
    badgeText: "Aksi",
    description: "Simpan mind map ke browser lokal",
    matches: ["simpan", "save", "simpan mind map"],
  },
  {
    type: "GENERATE_MINDMAP",
    label: "Buat Mind Map",
    kind: "action",
    badgeText: "Aksi",
    description: "Buat atau render peta pikiran baru",
    matches: ["buat mind map", "generate", "buat mind map baru"],
  },
  {
    type: "ADD_TO_CANVAS",
    label: "+ Tambah ke Kanvas",
    kind: "action",
    badgeText: "Aksi",
    description: "Buka formulir untuk menambah mind map baru di kanvas",
    matches: ["+ tambah ke kanvas", "tambah ke kanvas", "multi-root canvas"],
  },
  {
    type: "TOGGLE_FULLSCREEN",
    label: "Layar Penuh",
    kind: "action",
    badgeText: "Aksi",
    description: "Alihkan mode layar penuh",
    matches: ["layar penuh", "fullscreen", "mode layar penuh"],
  },
  {
    type: "SCROLL_CANVAS",
    label: "Lihat Kanvas",
    kind: "scroll",
    badgeText: "Scroll",
    description: "Gulir ke tampilan kanvas utama",
    matches: ["kanvas", "lihat kanvas", "ke kanvas", "tampilan mind map"],
  },
];

/**
 * Mendeteksi apakah suatu teks perintah tombol merujuk ke aksi navigasi/popup di website.
 */
export function detectGuideAction(rawText: string): GuideActionMeta | null {
  if (!rawText) return null;

  // Bersihkan tanda petik di awal/akhir
  const clean = rawText
    .trim()
    .replace(/^["'«“]/, "")
    .replace(/["'»”]$/, "")
    .trim()
    .toLowerCase();

  for (const rule of ACTION_RULES) {
    if (rule.matches.includes(clean)) {
      return {
        type: rule.type,
        label: rule.label,
        kind: rule.kind,
        badgeText: rule.badgeText,
        description: rule.description,
      };
    }
    if (rule.startsWith && rule.startsWith.some((sw) => clean.startsWith(sw))) {
      return {
        type: rule.type,
        label: rule.label,
        kind: rule.kind,
        badgeText: rule.badgeText,
        description: rule.description,
      };
    }
  }

  return null;
}
