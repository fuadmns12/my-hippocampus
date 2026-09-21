import React, { useState, useMemo } from "react";
import { CustomGroupingConfig } from "../../types";
import { LayoutGrid, Search, Smile, X, Trash2 } from "lucide-react";
import { EMOJI_CATEGORIES, ALL_EMOJIS } from "./emojiPresets";
import { useThemeMode } from "../../context/ThemeModeContext";

interface FlatDirectSettingsSectionProps {
  config: CustomGroupingConfig;
  updateConfig: <K extends keyof CustomGroupingConfig>(
    field: K,
    value: CustomGroupingConfig[K]
  ) => void;
}

export const FlatDirectSettingsSection: React.FC<
  FlatDirectSettingsSectionProps
> = ({ config, updateConfig }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customEmojiInput, setCustomEmojiInput] = useState<string>("");

  const themeModeCtx = useThemeMode();
  const isLight = themeModeCtx?.isLight ?? false;

  // Daftar emoji berdasarkan kategori yang aktif atau pencarian
  const displayedEmojis = useMemo(() => {
    let list = ALL_EMOJIS;
    if (selectedCategory !== "all") {
      const cat = EMOJI_CATEGORIES.find((c) => c.id === selectedCategory);
      if (cat) {
        list = cat.emojis;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((e) => e.includes(q));
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const handleApplyCustomEmoji = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmojiInput.trim()) {
      updateConfig("flatEmoji", customEmojiInput.trim());
      setCustomEmojiInput("");
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div
        className={`p-3 rounded-xl flex items-start gap-2 border transition-colors ${
          isLight
            ? "bg-cyan-50/70 border-cyan-200 text-slate-800"
            : "bg-black border-cyan-500/40 text-white"
        }`}
      >
        <LayoutGrid
          className={`w-4 h-4 shrink-0 mt-0.5 ${
            isLight ? "text-cyan-700" : "text-white"
          }`}
        />
        <div>
          <p
            className={`font-semibold text-xs ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Custom Spoke Langsung
          </p>
          <p
            className={`text-[11px] ${
              isLight ? "text-slate-600" : "text-white"
            }`}
          >
            Menghubungkan semua nama langsung ke titik pusat mind map.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            className={`font-medium flex items-center gap-1.5 ${
              isLight ? "text-slate-800" : "text-white"
            }`}
          >
            <Smile
              className={`w-4 h-4 ${
                isLight ? "text-cyan-600" : "text-cyan-400"
              }`}
            />
            <span>Ikon Emoji Default Item ({ALL_EMOJIS.length}+ Pilihan)</span>
          </label>
          <div className="flex items-center gap-2">
            {config.flatEmoji ? (
              <div
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border transition-colors ${
                  isLight
                    ? "bg-slate-100 border-slate-300 text-slate-900 shadow-xs"
                    : "bg-neutral-900 border-cyan-500/40 text-white"
                }`}
              >
                <span
                  className={`text-[10px] ${
                    isLight ? "text-slate-500 font-medium" : "text-neutral-400"
                  }`}
                >
                  Terpilih:
                </span>
                <span className="text-sm">{config.flatEmoji}</span>
                <button
                  type="button"
                  onClick={() => updateConfig("flatEmoji", "")}
                  className={`p-1 rounded-md transition-colors cursor-pointer ml-1 inline-flex items-center justify-center ${
                    isLight
                      ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200"
                      : "text-red-500 hover:text-red-400 hover:bg-red-950/40 border border-red-500/40"
                  }`}
                  title="Hapus ikon terpilih"
                  aria-label="Hapus ikon terpilih"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                </button>
              </div>
            ) : (
              <span
                className={`text-[10px] italic ${
                  isLight ? "text-slate-500" : "text-neutral-400"
                }`}
              >
                Tanpa Ikon
              </span>
            )}
          </div>
        </div>

        {/* Input Kustom Emoji & Pencarian Cepat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Pencarian Emoji */}
          <div className="relative">
            <Search
              className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${
                isLight ? "text-slate-400" : "text-neutral-400"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ikon / emoji..."
              className={`w-full rounded-xl pl-8 pr-7 py-1.5 text-xs transition-all focus:outline-none focus:border-cyan-400 ${
                isLight
                  ? "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400"
                  : "bg-black border border-neutral-800 text-white placeholder:text-neutral-500"
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${
                  isLight
                    ? "text-slate-400 hover:text-slate-700"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Form Emoji Kustom */}
          <form onSubmit={handleApplyCustomEmoji} className="flex gap-1.5">
            <input
              type="text"
              value={customEmojiInput}
              onChange={(e) => setCustomEmojiInput(e.target.value)}
              placeholder="Ketik/paste emoji kustom..."
              className={`flex-1 rounded-xl px-2.5 py-1.5 text-xs transition-all focus:outline-none focus:border-cyan-400 ${
                isLight
                  ? "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400"
                  : "bg-black border border-neutral-800 text-white placeholder:text-neutral-500"
              }`}
              maxLength={4}
            />
            <button
              type="submit"
              disabled={!customEmojiInput.trim()}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer ${
                isLight
                  ? "bg-cyan-50 border border-cyan-300 text-cyan-800 hover:bg-cyan-100"
                  : "bg-black border border-cyan-500/40 text-cyan-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              Pakai
            </button>
          </form>
        </div>

        {/* Kategori Tab Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedCategory === "all"
                ? isLight
                  ? "bg-cyan-100 text-cyan-900 border border-cyan-400 shadow-xs font-semibold"
                  : "bg-black text-white border border-cyan-400 shadow-xs"
                : isLight
                ? "bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-200"
                : "bg-black text-neutral-400 border border-neutral-800 hover:text-white"
            }`}
          >
            Semua ({ALL_EMOJIS.length})
          </button>
          {EMOJI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchQuery("");
              }}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? isLight
                    ? "bg-cyan-100 text-cyan-900 border border-cyan-400 shadow-xs font-semibold"
                    : "bg-black text-white border border-cyan-400 shadow-xs"
                  : isLight
                  ? "bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-200"
                  : "bg-black text-neutral-400 border border-neutral-800 hover:text-white"
              }`}
            >
              {cat.name} ({cat.emojis.length})
            </button>
          ))}
        </div>

        {/* Container Tombol Emoji dengan scroll yang rapi */}
        <div
          className={`p-2.5 rounded-xl max-h-56 overflow-y-auto border transition-colors ${
            isLight
              ? "bg-slate-50 border-slate-200 scrollbar-thin scrollbar-thumb-slate-300"
              : "bg-black border-neutral-800/80 scrollbar-thin scrollbar-thumb-neutral-700"
          }`}
        >
          <div className="flex flex-wrap gap-2">
            {/* Tombol Tanpa Ikon */}
            <button
              type="button"
              onClick={() => updateConfig("flatEmoji", "")}
              className={`px-2.5 h-9 rounded-xl text-xs flex items-center gap-1.5 border transition-all cursor-pointer shrink-0 ${
                !config.flatEmoji
                  ? isLight
                    ? "bg-cyan-50 text-cyan-950 font-bold border-cyan-500 ring-2 ring-cyan-400/40"
                    : "bg-black text-white font-bold border-cyan-400 ring-2 ring-cyan-400/50"
                  : isLight
                  ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400"
                  : "bg-black border-cyan-500/30 text-white hover:bg-neutral-900"
              }`}
            >
              <span>🚫</span>
              <span>Tanpa Ikon</span>
            </button>

            {/* Jika ada custom emoji yang sedang terpilih namun tidak ada di displayedEmojis, tampilkan di depan */}
            {config.flatEmoji && !displayedEmojis.includes(config.flatEmoji) && (
              <button
                type="button"
                onClick={() => updateConfig("flatEmoji", config.flatEmoji)}
                className={`w-9 h-9 rounded-xl text-base flex items-center justify-center border transition-all cursor-pointer font-bold ${
                  isLight
                    ? "bg-cyan-50 text-slate-900 border-cyan-500 ring-2 ring-cyan-400/40"
                    : "bg-black text-white border-cyan-400 ring-2 ring-cyan-400/50"
                }`}
                title={`Ikon Kustom ${config.flatEmoji}`}
              >
                {config.flatEmoji}
              </button>
            )}

            {displayedEmojis.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => updateConfig("flatEmoji", e)}
                className={`w-9 h-9 rounded-xl text-base flex items-center justify-center border transition-all cursor-pointer ${
                  config.flatEmoji === e
                    ? isLight
                      ? "bg-cyan-50 text-slate-900 font-bold border-cyan-500 ring-2 ring-cyan-400/40 shadow-xs"
                      : "bg-black text-white font-bold border-cyan-400 ring-2 ring-cyan-400/50"
                    : isLight
                    ? "bg-white border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300"
                    : "bg-black border-cyan-500/30 text-white hover:bg-neutral-900"
                }`}
                title={`Pilih ikon ${e}`}
              >
                {e}
              </button>
            ))}

            {displayedEmojis.length === 0 && (
              <div
                className={`w-full py-4 text-center text-xs ${
                  isLight ? "text-slate-500" : "text-neutral-400"
                }`}
              >
                Tidak ada ikon yang cocok dengan pencarian "{searchQuery}".
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label
          className={`block font-medium mb-1.5 ${
            isLight ? "text-slate-800" : "text-white"
          }`}
        >
          Pengurutan Nama Item
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "original" as const, label: "Sesuai Input Teks" },
            { key: "asc" as const, label: "Urut Abjad A - Z" },
            { key: "desc" as const, label: "Urut Abjad Z - A" },
          ].map((sort) => (
            <button
              key={sort.key}
              type="button"
              onClick={() => updateConfig("flatSortOrder", sort.key)}
              className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                config.flatSortOrder === sort.key
                  ? isLight
                    ? "bg-cyan-50 text-cyan-950 border-cyan-500 font-semibold shadow-xs ring-1 ring-cyan-400"
                    : "bg-black text-white border-cyan-400 font-semibold shadow-md ring-1 ring-cyan-400"
                  : isLight
                  ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                  : "bg-black border-cyan-500/30 text-white hover:bg-neutral-900"
              }`}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
