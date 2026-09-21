import { ThemePalette } from "./types";

export const pastelPalette: ThemePalette = {
  name: "Pastel Aurora",
  canvasBg: "bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40",
  isDark: false,
  rootBg: "bg-indigo-600 shadow-xl shadow-indigo-200/50",
  rootBorder: "border-indigo-400",
  rootText: "text-white font-bold",
  branchColors: [
    {
      bg: "bg-rose-100/90",
      border: "border-rose-300",
      text: "text-rose-900",
      link: "#f43f5e",
    },
    {
      bg: "bg-amber-100/90",
      border: "border-amber-300",
      text: "text-amber-900",
      link: "#f59e0b",
    },
    {
      bg: "bg-emerald-100/90",
      border: "border-emerald-300",
      text: "text-emerald-900",
      link: "#10b981",
    },
    {
      bg: "bg-sky-100/90",
      border: "border-sky-300",
      text: "text-sky-900",
      link: "#0284c7",
    },
    {
      bg: "bg-violet-100/90",
      border: "border-violet-300",
      text: "text-violet-900",
      link: "#8b5cf6",
    },
    {
      bg: "bg-fuchsia-100/90",
      border: "border-fuchsia-300",
      text: "text-fuchsia-900",
      link: "#d946ef",
    },
  ],
  leafBg: "bg-white/95 shadow-sm hover:shadow-md",
  leafBorder: "border-slate-200/80 hover:border-slate-300",
  leafText: "text-slate-800",
  defaultLink: "#64748b",
  gridDotColor: "#cbd5e1",
};

export const sunsetPalette: ThemePalette = {
  name: "Sunset Warmth",
  canvasBg: "bg-gradient-to-br from-orange-50/50 via-amber-50/30 to-rose-50/40",
  isDark: false,
  rootBg: "bg-gradient-to-r from-orange-600 to-rose-600 shadow-lg shadow-orange-200",
  rootBorder: "border-orange-300",
  rootText: "text-white font-bold",
  branchColors: [
    {
      bg: "bg-amber-100",
      border: "border-amber-400",
      text: "text-amber-950",
      link: "#f59e0b",
    },
    {
      bg: "bg-orange-100",
      border: "border-orange-400",
      text: "text-orange-950",
      link: "#ea580c",
    },
    {
      bg: "bg-rose-100",
      border: "border-rose-400",
      text: "text-rose-950",
      link: "#e11d48",
    },
    {
      bg: "bg-red-100",
      border: "border-red-400",
      text: "text-red-950",
      link: "#dc2626",
    },
    {
      bg: "bg-yellow-100",
      border: "border-yellow-400",
      text: "text-yellow-950",
      link: "#ca8a04",
    },
  ],
  leafBg: "bg-white shadow-sm hover:shadow",
  leafBorder: "border-amber-200",
  leafText: "text-stone-800",
  defaultLink: "#f97316",
  gridDotColor: "#fde68a",
};

export const corporatePalette: ThemePalette = {
  name: "Corporate Indigo",
  canvasBg: "bg-slate-100/80",
  isDark: false,
  rootBg: "bg-slate-900 shadow-xl shadow-slate-300",
  rootBorder: "border-slate-700",
  rootText: "text-white font-bold",
  branchColors: [
    {
      bg: "bg-blue-100",
      border: "border-blue-300",
      text: "text-blue-900",
      link: "#2563eb",
    },
    {
      bg: "bg-indigo-100",
      border: "border-indigo-300",
      text: "text-indigo-900",
      link: "#4f46e5",
    },
    {
      bg: "bg-teal-100",
      border: "border-teal-300",
      text: "text-teal-900",
      link: "#0d9488",
    },
    {
      bg: "bg-slate-200",
      border: "border-slate-400",
      text: "text-slate-900",
      link: "#475569",
    },
    {
      bg: "bg-sky-100",
      border: "border-sky-300",
      text: "text-sky-900",
      link: "#0284c7",
    },
  ],
  leafBg: "bg-white shadow-sm border border-slate-200",
  leafBorder: "border-slate-300",
  leafText: "text-slate-900",
  defaultLink: "#3b82f6",
  gridDotColor: "#94a3b8",
};

export const emeraldPalette: ThemePalette = {
  name: "Emerald Forest",
  canvasBg: "bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-stone-100",
  isDark: false,
  rootBg: "bg-emerald-700 shadow-lg shadow-emerald-200",
  rootBorder: "border-emerald-400",
  rootText: "text-white font-bold",
  branchColors: [
    {
      bg: "bg-emerald-100",
      border: "border-emerald-300",
      text: "text-emerald-950",
      link: "#059669",
    },
    {
      bg: "bg-teal-100",
      border: "border-teal-300",
      text: "text-teal-950",
      link: "#0d9488",
    },
    {
      bg: "bg-lime-100",
      border: "border-lime-300",
      text: "text-lime-950",
      link: "#65a30d",
    },
    {
      bg: "bg-cyan-100",
      border: "border-cyan-300",
      text: "text-cyan-950",
      link: "#0891b2",
    },
  ],
  leafBg: "bg-white shadow-sm hover:shadow",
  leafBorder: "border-emerald-200",
  leafText: "text-emerald-950",
  defaultLink: "#10b981",
  gridDotColor: "#a7f3d0",
};

export const monochromePalette: ThemePalette = {
  name: "Monochrome Clean",
  canvasBg: "bg-stone-50",
  isDark: false,
  rootBg: "bg-black shadow-lg",
  rootBorder: "border-zinc-800",
  rootText: "text-white font-bold",
  branchColors: [
    {
      bg: "bg-zinc-200",
      border: "border-zinc-400",
      text: "text-zinc-900",
      link: "#52525b",
    },
    {
      bg: "bg-stone-200",
      border: "border-stone-400",
      text: "text-stone-900",
      link: "#78716c",
    },
    {
      bg: "bg-neutral-200",
      border: "border-neutral-400",
      text: "text-neutral-900",
      link: "#525252",
    },
  ],
  leafBg: "bg-white border border-zinc-300 shadow-xs",
  leafBorder: "border-zinc-300",
  leafText: "text-black",
  defaultLink: "#71717a",
  gridDotColor: "#d6d3d1",
};
