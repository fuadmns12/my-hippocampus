import React from "react";
import { CustomGroupingConfig } from "../../types";
import { PieChart, Check } from "lucide-react";
import { useThemeMode } from "../../context/ThemeModeContext";

interface BalancedSpokesSettingsSectionProps {
  config: CustomGroupingConfig;
  updateConfig: <K extends keyof CustomGroupingConfig>(
    field: K,
    value: CustomGroupingConfig[K]
  ) => void;
}

export const BalancedSpokesSettingsSection: React.FC<
  BalancedSpokesSettingsSectionProps
> = ({ config, updateConfig }) => {
  const themeModeCtx = useThemeMode();
  const isLight = themeModeCtx?.isLight ?? false;

  return (
    <div className="space-y-4 animate-fade-in">
      <div
        className={`p-3 rounded-xl flex items-start gap-2 border transition-colors ${
          isLight
            ? "bg-cyan-50/70 border-cyan-200 text-slate-800"
            : "bg-black border-cyan-500/40 text-white"
        }`}
      >
        <PieChart
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
            Custom Distribusi Seimbang
          </p>
          <p
            className={`text-[11px] ${
              isLight ? "text-slate-600" : "text-white"
            }`}
          >
            Bagi jumlah nama secara merata ke dalam beberapa cabang utama.
          </p>
        </div>
      </div>

      <div>
        <label
          className={`block font-medium mb-1.5 ${
            isLight ? "text-slate-800" : "text-white"
          }`}
        >
          Jumlah Cabang Utama:{" "}
          <span className={`font-bold ${isLight ? "text-cyan-700" : "text-white"}`}>
            {config.balancedBranchCount} Cabang
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {[2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => updateConfig("balancedBranchCount", num)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                config.balancedBranchCount === num
                  ? isLight
                    ? "bg-cyan-50 text-cyan-950 border-cyan-500 shadow-xs ring-1 ring-cyan-400"
                    : "bg-black text-white border-cyan-400 shadow-md ring-1 ring-cyan-400"
                  : isLight
                  ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                  : "bg-black border-cyan-500/30 text-white hover:bg-neutral-800"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          className={`block font-medium mb-1 ${
            isLight ? "text-slate-800" : "text-white"
          }`}
        >
          Awalan Nama Cabang / Kelompok
        </label>
        <input
          type="text"
          value={config.balancedBranchPrefix}
          onChange={(e) => updateConfig("balancedBranchPrefix", e.target.value)}
          placeholder="misal: Kelompok, Cabang, Tim, Grup, Zone"
          className={`w-full px-3.5 py-2 rounded-xl text-xs transition-all focus:outline-none focus:border-cyan-400 ${
            isLight
              ? "bg-white border border-slate-300 text-slate-900 placeholder-slate-400"
              : "bg-black border border-cyan-500/30 text-white placeholder-neutral-500"
          }`}
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[
            "Kelompok",
            "Cabang",
            "Tim",
            "Grup",
            "Cluster",
            "Zona",
            "Sektor",
          ].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => updateConfig("balancedBranchPrefix", p)}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer border ${
                isLight
                  ? "bg-white hover:bg-slate-100 border-slate-300 text-slate-700"
                  : "bg-black hover:bg-neutral-800 border-cyan-500/30 text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          className={`block font-medium mb-1.5 ${
            isLight ? "text-slate-800" : "text-white"
          }`}
        >
          Mode Alokasi Nama
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              updateConfig("balancedDistributionMode", "round-robin")
            }
            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              config.balancedDistributionMode === "round-robin"
                ? isLight
                  ? "bg-cyan-50 border-cyan-500 text-cyan-950 font-semibold shadow-xs ring-1 ring-cyan-400"
                  : "bg-black border-cyan-400 text-white font-semibold"
                : isLight
                ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                : "bg-black border-cyan-500/30 text-white hover:bg-neutral-900"
            }`}
          >
            <div>
              <p
                className={`text-xs font-medium ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                Selang-Seling (Round-Robin)
              </p>
              <p
                className={`text-[10px] mt-0.5 ${
                  isLight ? "text-slate-500" : "text-neutral-400"
                }`}
              >
                Nama 1 ke Cabang 1, Nama 2 ke Cabang 2, dst.
              </p>
            </div>
            {config.balancedDistributionMode === "round-robin" && (
              <Check className={`w-4 h-4 shrink-0 ${isLight ? "text-cyan-600" : "text-cyan-400"}`} />
            )}
          </button>

          <button
            type="button"
            onClick={() => updateConfig("balancedDistributionMode", "chunk")}
            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              config.balancedDistributionMode === "chunk"
                ? isLight
                  ? "bg-cyan-50 border-cyan-500 text-cyan-950 font-semibold shadow-xs ring-1 ring-cyan-400"
                  : "bg-black border-cyan-400 text-white font-semibold"
                : isLight
                ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                : "bg-black border-cyan-500/30 text-white hover:bg-neutral-900"
            }`}
          >
            <div>
              <p
                className={`text-xs font-medium ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                Blok Urut (Chunking)
              </p>
              <p
                className={`text-[10px] mt-0.5 ${
                  isLight ? "text-slate-500" : "text-neutral-400"
                }`}
              >
                Mengisi Cabang 1 sampai penuh, baru ke Cabang 2.
              </p>
            </div>
            {config.balancedDistributionMode === "chunk" && (
              <Check className={`w-4 h-4 shrink-0 ${isLight ? "text-cyan-600" : "text-cyan-400"}`} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
