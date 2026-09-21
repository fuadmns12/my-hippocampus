import React from "react";
import {
  SortAsc,
  PieChart,
  LayoutGrid,
  Settings2,
} from "lucide-react";
import { GroupingStrategy, CustomGroupingConfig } from "../../types";
import { soundFx } from "../../utils/soundEffects";

interface GroupingStrategyCardsProps {
  groupingStrategy: GroupingStrategy;
  setGroupingStrategy: (strategy: GroupingStrategy) => void;
  customConfig: CustomGroupingConfig;
  onOpenSettings: (strategy: GroupingStrategy) => void;
  isEditingMode?: boolean;
  isSettingsOpen?: boolean;
  settingsStrategy?: GroupingStrategy;
}

export const GroupingStrategyCards: React.FC<GroupingStrategyCardsProps> = ({
  groupingStrategy,
  setGroupingStrategy,
  customConfig,
  onOpenSettings,
  isEditingMode = false,
  isSettingsOpen = false,
  settingsStrategy,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-white">
          {isEditingMode
            ? "Strategi Pengelompokan (Ubah Struktur Cabang)"
            : "Strategi Pengelompokan Nama ke Mind Map"}
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
        {/* Alphabetical */}
        <div
          id="strategy-card-alphabetical"
          onClick={() => {
            soundFx.play("toggle");
            setGroupingStrategy("alphabetical");
          }}
          className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer group relative bg-black ${
            groupingStrategy === "alphabetical"
              ? "border-cyan-400 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400"
              : "border-cyan-500/30 text-white hover:border-cyan-400/60"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <SortAsc
                  className={`w-4 h-4 ${
                    groupingStrategy === "alphabetical" ? "text-cyan-400" : "text-white"
                  }`}
                />
                <span className="text-white">Kelompok Abjad (A-Z)</span>
              </div>
              <button
                id="btn-settings-alphabetical"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.play("click");
                  onOpenSettings("alphabetical");
                }}
                title="Pengaturan Kustom Kelompok Abjad"
                aria-label="Pengaturan Kustom Kelompok Abjad"
                className={`p-1.5 rounded-lg border transition-all duration-150 active:scale-95 cursor-pointer ${
                  isSettingsOpen && settingsStrategy === "alphabetical"
                    ? "bg-black text-white border-cyan-500/50 shadow-sm"
                    : "bg-black text-neutral-400 border-neutral-700/80 hover:bg-neutral-900 hover:text-white hover:border-cyan-500/40"
                }`}
              >
                <Settings2
                  className={`w-3.5 h-3.5 ${
                    isSettingsOpen && settingsStrategy === "alphabetical"
                      ? "text-cyan-400"
                      : "text-white"
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-white leading-tight">
              Membagi nama berdasarkan rentang alfabetis (A-G, H-M, dll).
            </p>
          </div>

          <span className="inline-block px-2 py-0.5 rounded bg-black border border-cyan-500/30 text-white text-[10px] font-mono truncate max-w-full">
            {customConfig.alphabetMode === "range"
              ? `Rentang: ${customConfig.alphabetRanges}`
              : `${customConfig.alphabetNumGroups} Kelompok Abjad`}
          </span>
        </div>

        {/* Balanced Spokes */}
        <div
          id="strategy-card-balanced-spokes"
          onClick={() => {
            soundFx.play("toggle");
            setGroupingStrategy("balanced-spokes");
          }}
          className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer group relative bg-black ${
            groupingStrategy === "balanced-spokes"
              ? "border-cyan-400 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400"
              : "border-cyan-500/30 text-white hover:border-cyan-400/60"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <PieChart
                  className={`w-4 h-4 ${
                    groupingStrategy === "balanced-spokes" ? "text-cyan-400" : "text-white"
                  }`}
                />
                <span className="text-white">Distribusi Seimbang</span>
              </div>
              <button
                id="btn-settings-balanced-spokes"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.play("click");
                  onOpenSettings("balanced-spokes");
                }}
                title="Pengaturan Kustom Distribusi Seimbang"
                aria-label="Pengaturan Kustom Distribusi Seimbang"
                className={`p-1.5 rounded-lg border transition-all duration-150 active:scale-95 cursor-pointer ${
                  isSettingsOpen && settingsStrategy === "balanced-spokes"
                    ? "bg-black text-white border-cyan-500/50 shadow-sm"
                    : "bg-black text-neutral-400 border-neutral-700/80 hover:bg-neutral-900 hover:text-white hover:border-cyan-500/40"
                }`}
              >
                <Settings2
                  className={`w-3.5 h-3.5 ${
                    isSettingsOpen && settingsStrategy === "balanced-spokes"
                      ? "text-cyan-400"
                      : "text-white"
                  }`}
                />
              </button>
            </div>
            <p className="text-[10.5px] sm:text-[11px] text-white leading-tight">
              Membagi nama secara merata ke dalam cabang utama.
            </p>
          </div>

          <span className="inline-block px-2 py-0.5 rounded bg-black border border-cyan-500/30 text-white text-[10px] font-mono truncate max-w-full">
            {customConfig.balancedBranchCount} {customConfig.balancedBranchPrefix}
          </span>
        </div>

        {/* Flat Direct */}
        <div
          id="strategy-card-flat-direct"
          onClick={() => {
            soundFx.play("toggle");
            setGroupingStrategy("flat-direct");
          }}
          className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer group relative bg-black ${
            groupingStrategy === "flat-direct"
              ? "border-cyan-400 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400"
              : "border-cyan-500/30 text-white hover:border-cyan-400/60"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <LayoutGrid
                  className={`w-4 h-4 ${
                    groupingStrategy === "flat-direct" ? "text-cyan-400" : "text-white"
                  }`}
                />
                <span className="text-white">Spoke Langsung</span>
              </div>
              <button
                id="btn-settings-flat-direct"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.play("click");
                  onOpenSettings("flat-direct");
                }}
                title="Pengaturan Kustom Spoke Langsung"
                aria-label="Pengaturan Kustom Spoke Langsung"
                className={`p-1.5 rounded-lg border transition-all duration-150 active:scale-95 cursor-pointer ${
                  isSettingsOpen && settingsStrategy === "flat-direct"
                    ? "bg-black text-white border-cyan-500/50 shadow-sm"
                    : "bg-black text-neutral-400 border-neutral-700/80 hover:bg-neutral-900 hover:text-white hover:border-cyan-500/40"
                }`}
              >
                <Settings2
                  className={`w-3.5 h-3.5 ${
                    isSettingsOpen && settingsStrategy === "flat-direct"
                      ? "text-cyan-400"
                      : "text-white"
                  }`}
                />
              </button>
            </div>
            <p className="text-[10.5px] sm:text-[11px] text-white leading-tight">
              Menghubungkan semua nama langsung ke pusat topik utama.
            </p>
          </div>

          <span className="inline-block px-2 py-0.5 rounded bg-black border border-cyan-500/30 text-white text-[10px] font-mono truncate max-w-full">
            Ikon: {customConfig.flatEmoji || "👤"} | Urutan:{" "}
            {customConfig.flatSortOrder === "asc"
              ? "A-Z"
              : customConfig.flatSortOrder === "desc"
              ? "Z-A"
              : "Asli"}
          </span>
        </div>
      </div>
    </div>
  );
};
