export interface ColorPreset {
  id: string;
  name: string;
  bgColor: string;
  borderColor: string;
}

export const NODE_COLOR_PRESETS: ColorPreset[] = [
  {
    id: "indigo",
    name: "Indigo Klasik",
    bgColor: "#4f46e5",
    borderColor: "#818cf8",
  },
  {
    id: "cyan",
    name: "Cyber Cyan",
    bgColor: "#083344",
    borderColor: "#06b6d4",
  },
  {
    id: "emerald",
    name: "Emerald Hijau",
    bgColor: "#064e3b",
    borderColor: "#10b981",
  },
  {
    id: "amber",
    name: "Amber Emas",
    bgColor: "#78350f",
    borderColor: "#f59e0b",
  },
  {
    id: "rose",
    name: "Rose Crimson",
    bgColor: "#881337",
    borderColor: "#f43f5e",
  },
  {
    id: "violet",
    name: "Violet Ungu",
    bgColor: "#581c87",
    borderColor: "#c084fc",
  },
  {
    id: "blue",
    name: "Ocean Biru",
    bgColor: "#1e3a8a",
    borderColor: "#60a5fa",
  },
  {
    id: "obsidian",
    name: "Hitam Pekat",
    bgColor: "#09090b",
    borderColor: "#22d3ee",
  },
  {
    id: "slate",
    name: "Slate Abu",
    bgColor: "#1e293b",
    borderColor: "#94a3b8",
  },
];
