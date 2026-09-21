import {
  MindMapLayout,
  ColorTheme,
  ConnectorStyle,
  NodeShape,
} from "../types";
import { THEME_PALETTES } from "../utils/colorThemes";
import { CustomSelectOption } from "./common/CustomSelect";

export const LAYOUT_OPTIONS: Array<{
  id: MindMapLayout;
  label: string;
  desc: string;
}> = [
  {
    id: "radial",
    label: "Radial Centered",
    desc: "Peta bintang melingkar 360°",
  },
  {
    id: "horizontal-tree",
    label: "Pohon Horisontal",
    desc: "Cabang kiri ke kanan",
  },
  {
    id: "vertical-tree",
    label: "Hirarki Atas-Bawah",
    desc: "Struktur organisasi klasik",
  },
  {
    id: "bilateral-bracket",
    label: "Bracket Dua Sisi",
    desc: "Seimbang kiri & kanan",
  },
  {
    id: "fishbone",
    label: "Diagram Tulang Ikan",
    desc: "Pola Ishikawa diagonal",
  },
  {
    id: "bubble-cluster",
    label: "Kluster Gelembung",
    desc: "Orbit lingkaran gravitasional",
  },
  {
    id: "grid-network",
    label: "Jaringan Matriks",
    desc: "Kartu terhubung teratur",
  },
];

export const getLayoutSelectOptions = (): CustomSelectOption[] =>
  LAYOUT_OPTIONS.map((opt) => ({
    value: opt.id,
    label: opt.label,
    subLabel: opt.desc,
  }));

export const getThemeSelectOptions = (): CustomSelectOption[] =>
  (Object.keys(THEME_PALETTES) as ColorTheme[]).map((tKey) => {
    const pal = THEME_PALETTES[tKey];
    return {
      value: tKey,
      label: pal.name,
      colorSwatch: pal.rootBg || pal.branchColors[0]?.link,
      subLabel: pal.isDark ? "Gelap" : "Terang",
    };
  });

export const CONNECTOR_SELECT_OPTIONS: CustomSelectOption[] = [
  { value: "bezier", label: "Lengkung Smooth", subLabel: "Kurva Bezier Alami" },
  { value: "angled", label: "Siku Tekuk", subLabel: "Garis Diagonal Berpatah" },
  { value: "straight", label: "Lurus Langsung", subLabel: "Garis Lurus Minimalis" },
  { value: "dotted", label: "Putus-putus", subLabel: "Garis Titik-titik" },
  {
    value: "animated-dashed",
    label: "Putus-putus Bergerak",
    subLabel: "Animasi Aliran Pusat ke Cabang",
  },
];

export const NODE_SHAPE_SELECT_OPTIONS: CustomSelectOption[] = [
  { value: "rounded", label: "Persegi Lengkung", subLabel: "Rounded Card" },
  { value: "pill", label: "Kapsul / Pill", subLabel: "Oval Penuh Memanjang" },
  { value: "sharp", label: "Persegi Siku", subLabel: "Sudut Tajam Modern" },
  { value: "oval", label: "Oval / Elips", subLabel: "Bentuk Melengkung Halus" },
  { value: "circle", label: "Lingkaran", subLabel: "Bulat Simetris" },
  { value: "hexagon", label: "Heksagon", subLabel: "Sudut Segi Enam Geometris" },
];
