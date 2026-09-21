import { GuideTopicRule } from "./types";
import {
  CREATE_MINDMAP_REPLY,
  LAYOUT_REPLY,
  THEME_AND_STYLE_REPLY,
  EXPORT_REPLY,
  NOTES_AND_LINKS_REPLY,
  YOUTUBE_MUSIC_REPLY,
  CANVAS_NAVIGATION_REPLY,
  KEYBOARD_SHORTCUTS_REPLY,
  HISTORY_AND_FOLDERS_REPLY,
  PWA_AND_OFFLINE_REPLY,
} from "./guideResponses";

const OFF_TOPIC_PATTERNS = [
  /siapa (presiden|kamu|pencipta|pembuat)/i,
  /buatkan (kode|program|skrip|cerita|puisi|pantun|lagu|esai|makalah|resep)/i,
  /cara masak|resep|cuaca|berita|politik|saham|crypto|film|lirik/i,
  /hitung |berapa hasil|terjemahkan|translate/i,
  /python|javascript|php|java|c\+\+|html|css|sql/i,
];

const ON_TOPIC_KEYWORDS = [
  "mind map",
  "kanvas",
  "website",
  "layout",
  "tema",
  "fitur",
];

export function checkIsOffTopic(q: string): boolean {
  const matchesOffTopic = OFF_TOPIC_PATTERNS.some((p) => p.test(q));
  const hasOnTopicKeyword = ON_TOPIC_KEYWORDS.some((kw) => q.includes(kw));
  return matchesOffTopic && !hasOnTopicKeyword;
}

export const TOPIC_RULES: GuideTopicRule[] = [
  {
    keywords: [
      "buat mind map",
      "bikin mind map",
      "cara mulai",
      "cara menggunakan",
      "cara pakai",
      "tambah cabang",
      "input panel",
    ],
    reply: CREATE_MINDMAP_REPLY,
  },
  {
    keywords: [
      "layout",
      "tata letak",
      "radial",
      "fishbone",
      "tree",
      "bracket",
      "bentuk susunan",
    ],
    reply: LAYOUT_REPLY,
  },
  {
    keywords: [
      "tema",
      "warna",
      "dark mode",
      "light mode",
      "mode terang",
      "mode gelap",
      "theme toggle",
      "ganti tema",
      "konektor",
      "garis",
      "bentuk node",
      "bentuk kartu",
      "shape",
      "gaya",
    ],
    reply: THEME_AND_STYLE_REPLY,
  },
  {
    keywords: [
      "ekspor",
      "export",
      "download",
      "unduh",
      "simpan gambar",
      "png",
      "svg",
      "json",
      "markdown",
    ],
    reply: EXPORT_REPLY,
  },
  {
    keywords: ["catatan", "note", "notes", "tautan", "link", "url"],
    reply: NOTES_AND_LINKS_REPLY,
  },
  {
    keywords: [
      "musik",
      "lagu",
      "youtube",
      "playlist",
      "audio",
      "putar musik",
    ],
    reply: YOUTUBE_MUSIC_REPLY,
  },
  {
    keywords: [
      "zoom",
      "geser",
      "pan",
      "drag",
      "lipat",
      "kolaps",
      "collapse",
      "kanvas",
      "fullscreen",
      "layar penuh",
    ],
    reply: CANVAS_NAVIGATION_REPLY,
  },
  {
    keywords: ["shortcut", "tombol pintas", "hotkey", "keyboard"],
    reply: KEYBOARD_SHORTCUTS_REPLY,
  },
  {
    keywords: ["riwayat", "history", "folder", "simpan", "save", "kategori"],
    reply: HISTORY_AND_FOLDERS_REPLY,
  },
  {
    keywords: [
      "offline",
      "pwa",
      "install",
      "pasang",
      "aplikasi mandiri",
      "update",
      "pembaruan",
      "versi baru",
      "perbarui",
    ],
    reply: PWA_AND_OFFLINE_REPLY,
  },
];

export function findTopicAnswer(q: string): string | null {
  for (const rule of TOPIC_RULES) {
    if (rule.keywords.some((kw) => q.includes(kw))) {
      return rule.reply;
    }
  }
  return null;
}
