import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

interface HistoryFolderTabsProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  totalCount: number;
  filteredCount: number;
  sortBy: "newest" | "title";
  setSortBy: (sort: "newest" | "title") => void;
}

export const HistoryFolderTabs: React.FC<HistoryFolderTabsProps> = ({
  searchQuery,
  setSearchQuery,
  totalCount,
  filteredCount,
  sortBy,
  setSortBy,
}) => {
  return (
    <>
      {/* Search Bar & Sorting Controls */}
      <div className="px-5 py-3 border-b border-cyan-500/20 bg-black space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white" />
            <input
              id="search-memory-card"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul mind map atau konten..."
              className="w-full pl-8 pr-8 py-1.5 bg-black border border-cyan-500/30 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white hover:text-white cursor-pointer p-0.5"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5 text-rose-400" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 select-none">
            <button
              id="btn-sort-newest"
              type="button"
              onClick={() => {
                soundFx.play("toggle");
                setSortBy("newest");
              }}
              title="Urutkan dari yang terbaru"
              className={`inline-flex items-center px-2.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-150 active:scale-95 border cursor-pointer shadow-sm ${
                sortBy === "newest"
                  ? "bg-black text-white border-cyan-500/50"
                  : "bg-black text-neutral-300 border-neutral-700/80 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              TERBARU
            </button>
            <button
              id="btn-sort-az"
              type="button"
              onClick={() => {
                soundFx.play("toggle");
                setSortBy("title");
              }}
              title="Urutkan berdasarkan abjad A-Z"
              className={`inline-flex items-center px-2.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-150 active:scale-95 border cursor-pointer shadow-sm ${
                sortBy === "title"
                  ? "bg-black text-white border-cyan-500/50"
                  : "bg-black text-neutral-300 border-neutral-700/80 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              A-Z
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-5 py-2 bg-black border-b border-cyan-500/20 text-[11px] flex items-center justify-between text-white">
        <span className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3 h-3 text-white" />
          {searchQuery ? (
            <span className="text-white">
              Hasil pencarian untuk &ldquo;<span className="text-white font-semibold">{searchQuery}</span>&rdquo;
            </span>
          ) : (
            <span className="text-white">Daftar Mind Map Tersimpan</span>
          )}
        </span>

        <span className="text-[11px] font-mono text-white">
          {searchQuery
            ? `${filteredCount} dari ${totalCount} ditemukan`
            : `${totalCount} Mind Map`}
        </span>
      </div>
    </>
  );
};

