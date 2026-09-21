import React from "react";
import {
  Layers,
  Play,
  SlidersHorizontal,
  Pencil,
  Scan,
  Palette,
  HardDrive,
  Zap,
} from "lucide-react";
import { GuideCategoryInfo } from "./types";

export const GUIDE_CATEGORIES: GuideCategoryInfo[] = [
  { id: "all", label: "Semua", icon: <Layers className="w-3.5 h-3.5 text-white" /> },
  { id: "quickstart", label: "Mulai Cepat", icon: <Play className="w-3.5 h-3.5 text-white" /> },
  { id: "input", label: "Buat Ide & Cabang", icon: <SlidersHorizontal className="w-3.5 h-3.5 text-white" /> },
  { id: "nodes", label: "Edit & Geser Kotak", icon: <Pencil className="w-3.5 h-3.5 text-white" /> },
  { id: "canvas", label: "Navigasi Kanvas", icon: <Scan className="w-3.5 h-3.5 text-white" /> },
  { id: "themes", label: "Bentuk & Warna", icon: <Palette className="w-3.5 h-3.5 text-white" /> },
  { id: "storage", label: "Simpan & Ekspor", icon: <HardDrive className="w-3.5 h-3.5 text-white" /> },
  { id: "shortcuts", label: "Pintasan & Tips", icon: <Zap className="w-3.5 h-3.5 text-white" /> },
];
