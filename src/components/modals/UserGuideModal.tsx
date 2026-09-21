import React, { useState, useEffect, useMemo } from "react";
import { HelpCircle, X, Search, Info } from "lucide-react";
import {
  GuideCategory,
  GUIDE_CATEGORIES,
  GUIDE_ITEMS,
  GuideCard,
} from "./userGuide";
import { soundFx } from "../../utils/soundEffects";

export interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<GuideCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Dismiss on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter items based on active category and search query
  const filteredItems = useMemo(() => {
    return GUIDE_ITEMS.filter((item) => {
      const matchCategory =
        activeCategory === "all" || item.category === activeCategory;

      if (!searchQuery.trim()) return matchCategory;

      const q = searchQuery.toLowerCase();
      const matchSearch =
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.steps.some((s) => s.toLowerCase().includes(q)) ||
        (item.tips && item.tips.toLowerCase().includes(q)) ||
        item.badge.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      id="user-guide-modal-overlay"
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="user-guide-modal"
        className="bg-black border border-cyan-500/40 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl shadow-cyan-950/50 relative text-white overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/30 bg-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-black border border-cyan-500/30 text-white shadow-sm shadow-cyan-500/20">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Panduan Cara Penggunaan Mind Map
              </h2>
              <p className="text-xs text-neutral-300 mt-0.5">
                Langkah praktis membuat ide, mengedit cabang, menata letak, dan menyimpan diagram Anda
              </p>
            </div>
          </div>

          <button
            id="close-user-guide-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black border border-cyan-400 hover:border-cyan-300 hover:bg-neutral-900 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
            title="Tutup Panduan"
            aria-label="Tutup Panduan"
          >
            <X className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Search & Category Filter Header */}
        <div className="p-3 sm:p-4 bg-black border-b border-neutral-800 shrink-0 space-y-3">
          {/* Quick Search Field */}
          <div className="relative">
            <Search className="w-4 h-4 text-white absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="user-guide-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari cara penggunaan (misal: 'buat cabang', 'geser', 'ganti warna', 'simpan', 'unduh png')..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-black border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40 text-xs text-white placeholder-neutral-400 outline-none transition-all"
            />
            {searchQuery && (
              <button
                id="clear-user-guide-search-btn"
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            )}
          </div>

          {/* Category Cards Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-neutral-800 select-none">
            {GUIDE_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  id={`guide-category-btn-${cat.id}`}
                  type="button"
                  onClick={() => {
                    soundFx.play("toggle");
                    setActiveCategory(cat.id);
                  }}
                  className={`h-10 px-3.5 shrink-0 rounded-xl border transition-all duration-150 flex items-center gap-2 text-xs font-semibold cursor-pointer active:scale-95 shadow-sm whitespace-nowrap ${
                    isActive
                      ? "bg-black border-cyan-500/60 text-white ring-1 ring-cyan-500/30"
                      : "bg-black border-neutral-700/80 text-neutral-300 hover:bg-neutral-900 hover:text-white"
                  }`}
                  title={`${cat.label} - Klik untuk memfilter panduan`}
                >
                  <span className={`shrink-0 ${isActive ? "text-cyan-400" : "text-white"}`}>
                    {cat.icon && React.isValidElement(cat.icon)
                      ? React.cloneElement(cat.icon as React.ReactElement<{ className?: string }>, {
                          className: `w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-white"}`,
                        })
                      : cat.icon}
                  </span>
                  <span className="tracking-wide uppercase">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-bar: Reset Pencarian bila ada */}
          {searchQuery && (
            <div className="flex items-center justify-end pt-1 border-t border-neutral-800/80 text-[11px]">
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                Reset pencarian
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Quick How-To Tip Strip */}
          <div className="rounded-xl border border-cyan-500/30 bg-black px-3.5 py-2.5 text-xs text-white flex items-center gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Tip:</strong> Gunakan kolom pencarian di atas untuk menemukan panduan fitur secara instan, atau klik kategori untuk memfilter topik panduan.
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <HelpCircle className="w-10 h-10 mx-auto mb-3 text-white opacity-60" />
              <p className="text-sm font-semibold text-white">Tidak ada topik yang cocok</p>
              <p className="text-xs text-neutral-400 mt-1">
                Coba gunakan kata kunci lain seperti "buat", "geser", "simpan", "unduh", atau "warna".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              {filteredItems.map((item) => (
                <GuideCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
