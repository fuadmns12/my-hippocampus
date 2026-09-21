import React from "react";
import { Search, X } from "lucide-react";
import { soundFx } from "../../../utils/soundEffects";

interface PresetFilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedFolder: "ALL" | "Umum" | "Spesifik";
  setSelectedFolder: (folder: "ALL" | "Umum" | "Spesifik") => void;
  totalCount: number;
  filteredCount: number;
}

export const PresetFilterBar: React.FC<PresetFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedFolder,
  setSelectedFolder,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="px-5 py-3 border-b border-cyan-500/20 bg-black space-y-2.5 select-none">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          id="search-preset-templates"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari contoh dataset atau kategori..."
          className="w-full pl-8 pr-8 py-1.5 bg-black border border-cyan-500/30 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer p-0.5"
            title="Hapus pencarian"
          >
            <X className="w-3.5 h-3.5 text-rose-400" />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-between gap-1.5 pt-0.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              soundFx.play("toggle");
              setSelectedFolder("ALL");
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border text-white bg-black ${
              selectedFolder === "ALL"
                ? "border-cyan-400 shadow-sm shadow-cyan-500/30 font-semibold"
                : "border-cyan-500/20 hover:border-cyan-400 text-white/90"
            }`}
          >
            Semua ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.play("toggle");
              setSelectedFolder("Umum");
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border text-white bg-black ${
              selectedFolder === "Umum"
                ? "border-cyan-400 shadow-sm shadow-cyan-500/30 font-semibold"
                : "border-cyan-500/20 hover:border-cyan-400 text-white/90"
            }`}
          >
            Akademik & Acara
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.play("toggle");
              setSelectedFolder("Spesifik");
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border text-white bg-black ${
              selectedFolder === "Spesifik"
                ? "border-cyan-400 shadow-sm shadow-cyan-500/30 font-semibold"
                : "border-cyan-500/20 hover:border-cyan-400 text-white/90"
            }`}
          >
            Tim & Proyek
          </button>
        </div>

        {searchQuery && (
          <span className="text-[10px] text-white font-mono">
            {filteredCount} hasil
          </span>
        )}
      </div>
    </div>
  );
};
