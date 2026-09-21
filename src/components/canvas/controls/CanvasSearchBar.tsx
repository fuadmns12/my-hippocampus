import React from "react";
import { Search } from "lucide-react";
import { useThemeMode } from "../../../context/ThemeModeContext";

export interface CanvasSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  matchCount?: number;
}

export const CanvasSearchBar: React.FC<CanvasSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  matchCount,
}) => {
  const themeModeCtx = useThemeMode();
  const isLight = themeModeCtx?.isLight ?? false;

  return (
    <>
      {/* Search Bar inside Canvas */}
      <div className="relative flex items-center">
        <Search
          className={`w-3.5 h-3.5 absolute left-3 pointer-events-none transition-colors ${
            isLight ? "text-slate-400" : "text-white"
          }`}
        />
        <input
          id="canvas-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama dalam peta..."
          title="Cari topik, nama, catatan (note), atau subtitle dalam kartu ide"
          className={`pl-8 pr-8 py-1.5 w-44 sm:w-60 backdrop-blur rounded-xl text-xs transition-all focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-xl ${
            isLight
              ? "bg-white text-slate-900 placeholder-slate-400 border border-slate-300 shadow-slate-200/50"
              : "bg-black/95 text-white placeholder-neutral-500 border border-cyan-500/40"
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 cursor-pointer font-bold"
            title="Bersihkan pencarian"
          >
            ✕
          </button>
        )}
      </div>

      {/* Match count badge */}
      {searchQuery.trim().length > 0 && matchCount !== undefined && (
        <div
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl backdrop-blur border shadow-xl ${
            isLight
              ? "bg-white border-cyan-500/50 text-slate-900 shadow-slate-200/50"
              : "bg-black/95 border border-cyan-500/40 text-white"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping" />
          <span
            className={`text-[11px] font-semibold ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            {matchCount > 0 ? `${matchCount} kartu ditemukan` : "Tidak ditemukan"}
          </span>
        </div>
      )}
    </>
  );
};
