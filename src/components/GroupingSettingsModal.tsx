import React from "react";
import { CustomGroupingConfig, GroupingStrategy } from "../types";
import {
  Settings,
  X,
  SortAsc,
  PieChart,
  LayoutGrid,
  Check,
  RotateCcw,
} from "lucide-react";
import { AlphabeticalSettingsSection } from "./grouping/AlphabeticalSettingsSection";
import { BalancedSpokesSettingsSection } from "./grouping/BalancedSpokesSettingsSection";
import { FlatDirectSettingsSection } from "./grouping/FlatDirectSettingsSection";
import { soundFx } from "../utils/soundEffects";
import { useThemeMode } from "../context/ThemeModeContext";

interface GroupingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStrategy: GroupingStrategy;
  setActiveStrategy?: (s: GroupingStrategy) => void;
  config: CustomGroupingConfig;
  onChangeConfig: (newConfig: CustomGroupingConfig) => void;
  onApplyConfig?: (newConfig: CustomGroupingConfig) => void;
}

export const GroupingSettingsModal: React.FC<GroupingSettingsModalProps> = ({
  isOpen,
  onClose,
  activeStrategy,
  config,
  onChangeConfig,
  onApplyConfig,
}) => {
  const themeModeCtx = useThemeMode();
  const isLight = themeModeCtx?.isLight ?? false;

  if (!isOpen) return null;

  const updateConfig = <K extends keyof CustomGroupingConfig>(
    field: K,
    value: CustomGroupingConfig[K]
  ) => {
    onChangeConfig({
      ...config,
      [field]: value,
    });
  };

  const handleResetDefaults = () => {
    onChangeConfig({
      alphabetMode: "range",
      alphabetRanges: "A-G, H-M, N-S, T-Z",
      alphabetNumGroups: 4,
      alphabetIncludeOthers: true,
      balancedBranchCount: 4,
      balancedBranchPrefix: "Kelompok",
      balancedDistributionMode: "round-robin",
      flatEmoji: "👤",
      flatSortOrder: "original",
    });
  };

  const getStrategyHeader = () => {
    switch (activeStrategy) {
      case "alphabetical":
        return {
          title: "Pengaturan Kustom - Kelompok Abjad (A-Z)",
          subtitle: "Atur rentang huruf abjad kustom atau target jumlah kelompok",
          icon: <SortAsc className={`w-5 h-5 ${isLight ? "text-cyan-700" : "text-white"}`} />,
          bg: isLight ? "bg-cyan-50 border border-cyan-200" : "bg-black border border-cyan-500/30",
        };
      case "balanced-spokes":
        return {
          title: "Pengaturan Kustom - Distribusi Seimbang",
          subtitle:
            "Atur jumlah cabang utama, awalan kelompok, dan metode alokasi nama",
          icon: <PieChart className={`w-5 h-5 ${isLight ? "text-cyan-700" : "text-white"}`} />,
          bg: isLight ? "bg-cyan-50 border border-cyan-200" : "bg-black border border-cyan-500/30",
        };
      case "flat-direct":
        return {
          title: "Pengaturan Kustom - Spoke Langsung",
          subtitle: "Atur ikon emoji default dan pengurutan nama item",
          icon: <LayoutGrid className={`w-5 h-5 ${isLight ? "text-cyan-700" : "text-white"}`} />,
          bg: isLight ? "bg-cyan-50 border border-cyan-200" : "bg-black border border-cyan-500/30",
        };
      default:
        return {
          title: "Pengaturan Kustom Strategi",
          subtitle: "Atur konfigurasi khusus pengelompokan nama",
          icon: <Settings className={`w-5 h-5 ${isLight ? "text-cyan-700" : "text-white"}`} />,
          bg: isLight ? "bg-cyan-50 border border-cyan-200" : "bg-black border border-cyan-500/30",
        };
    }
  };

  const header = getStrategyHeader();

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-fade-in ${
        isLight ? "bg-slate-900/50" : "bg-black/80"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="grouping-settings-modal"
        className={`rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] border transition-colors ${
          isLight
            ? "bg-white border-slate-300 text-slate-900"
            : "bg-black border-cyan-500/40 text-white"
        }`}
      >
        {/* Header */}
        <div
          className={`px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between border-b transition-colors ${
            isLight
              ? "bg-slate-50/80 border-slate-200"
              : "bg-black border-cyan-500/30"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${header.bg}`}>{header.icon}</div>
            <div>
              <h2
                className={`text-sm font-bold ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {header.title}
              </h2>
              <p
                className={`text-xs ${
                  isLight ? "text-slate-500" : "text-neutral-400"
                }`}
              >
                {header.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center border ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700"
                : "bg-black border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 hover:bg-neutral-900"
            }`}
            id="btn-close-grouping-modal"
            title="Tutup Modal"
            aria-label="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Specific Strategy Form Component */}
        <div
          className={`flex-1 overflow-y-auto p-5 space-y-5 text-xs transition-colors ${
            isLight ? "bg-white text-slate-800" : "bg-black text-white"
          }`}
        >
          {/* Phase 1: Alphabetical Settings Section */}
          {activeStrategy === "alphabetical" && (
            <AlphabeticalSettingsSection
              config={config}
              updateConfig={updateConfig}
            />
          )}

          {/* Phase 2: Balanced Spokes Settings Section */}
          {activeStrategy === "balanced-spokes" && (
            <BalancedSpokesSettingsSection
              config={config}
              updateConfig={updateConfig}
            />
          )}

          {/* Phase 2: Flat Direct Settings Section */}
          {activeStrategy === "flat-direct" && (
            <FlatDirectSettingsSection
              config={config}
              updateConfig={updateConfig}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 flex items-center justify-between gap-3 select-none border-t transition-colors ${
            isLight
              ? "bg-white border-slate-200"
              : "bg-black border-cyan-500/30"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              soundFx.play("click");
              handleResetDefaults();
            }}
            id="btn-reset-grouping-defaults"
            title="Reset Pengaturan ke Default"
            aria-label="Reset Pengaturan"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-150 active:scale-95 cursor-pointer shadow-xs border ${
              isLight
                ? "bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:text-black"
                : "bg-black text-neutral-300 border-neutral-700/80 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLight ? "text-slate-700" : "text-white"}`} />
            <span>RESET</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.play("click");
              if (onApplyConfig) {
                onApplyConfig(config);
              } else {
                onClose();
              }
            }}
            id="btn-apply-grouping-config"
            title="Terapkan Pengaturan"
            aria-label="Terapkan Pengaturan"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-150 active:scale-95 cursor-pointer shadow-sm border ${
              isLight
                ? "bg-white text-black hover:bg-slate-50 border-slate-300 hover:border-cyan-600 shadow-xs"
                : "bg-black text-white border-cyan-500/50 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white shadow-cyan-950/50"
            }`}
          >
            <Check className={`w-4 h-4 ${isLight ? "text-black" : "text-white"}`} />
            <span>TERAPKAN PENGATURAN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
