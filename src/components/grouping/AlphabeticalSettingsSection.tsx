import React from "react";
import { CustomGroupingConfig } from "../../types";
import { Check } from "lucide-react";
import { useThemeMode } from "../../context/ThemeModeContext";

interface AlphabeticalSettingsSectionProps {
  config: CustomGroupingConfig;
  updateConfig: <K extends keyof CustomGroupingConfig>(
    field: K,
    value: CustomGroupingConfig[K]
  ) => void;
}

export const AlphabeticalSettingsSection: React.FC<
  AlphabeticalSettingsSectionProps
> = ({ config, updateConfig }) => {
  const themeModeCtx = useThemeMode();
  const isLight = themeModeCtx?.isLight ?? false;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Mode Selection */}
      <div>
        <label
          className={`block font-medium mb-2 ${
            isLight ? "text-slate-800" : "text-white"
          }`}
        >
          Mode Pembagian Abjad
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => updateConfig("alphabetMode", "range")}
            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              config.alphabetMode === "range"
                ? isLight
                  ? "bg-cyan-50 border-cyan-500 text-cyan-950 font-semibold shadow-xs ring-1 ring-cyan-400"
                  : "bg-black border-cyan-400 text-white font-semibold"
                : isLight
                ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                : "bg-black border-cyan-500/30 text-white hover:bg-neutral-900"
            }`}
          >
            <span>Rentang Huruf Kustom</span>
            {config.alphabetMode === "range" && (
              <Check className={`w-4 h-4 ${isLight ? "text-cyan-600" : "text-cyan-400"}`} />
            )}
          </button>

          <button
            type="button"
            onClick={() => updateConfig("alphabetMode", "count")}
            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              config.alphabetMode === "count"
                ? isLight
                  ? "bg-cyan-50 border-cyan-500 text-cyan-950 font-semibold shadow-xs ring-1 ring-cyan-400"
                  : "bg-black border-cyan-400 text-white font-semibold"
                : isLight
                ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                : "bg-black border-cyan-500/30 text-white hover:bg-neutral-900"
            }`}
          >
            <span>Bagi Berdasarkan Jumlah Kelompok</span>
            {config.alphabetMode === "count" && (
              <Check className={`w-4 h-4 ${isLight ? "text-cyan-600" : "text-cyan-400"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mode 1: Custom Ranges */}
      {config.alphabetMode === "range" ? (
        <div
          className={`space-y-3 p-3.5 rounded-xl border transition-colors ${
            isLight
              ? "bg-slate-50 border-slate-200 text-slate-900"
              : "bg-black border border-cyan-500/30 text-white"
          }`}
        >
          <div>
            <label
              className={`block font-medium mb-1 ${
                isLight ? "text-slate-800" : "text-white"
              }`}
            >
              Ketik Rentang Abjad (Dipisah Koma)
            </label>
            <input
              type="text"
              value={config.alphabetRanges}
              onChange={(e) => updateConfig("alphabetRanges", e.target.value)}
              placeholder="misal: A-G, H-M, N-S, T-Z"
              className={`w-full px-3.5 py-2 rounded-xl font-mono text-xs transition-all focus:outline-none focus:border-cyan-400 ${
                isLight
                  ? "bg-white border border-slate-300 text-slate-900 placeholder-slate-400"
                  : "bg-black border border-cyan-500/30 text-white placeholder-neutral-500"
              }`}
            />
            <p
              className={`text-[11px] mt-1 ${
                isLight ? "text-slate-600" : "text-white"
              }`}
            >
              Format: Gunakan rentang dengan tanda strip (misal:{" "}
              <code className={isLight ? "text-cyan-800 font-bold" : "text-cyan-300"}>
                A-E, F-K, L-P, Q-U, V-Z
              </code>
              )
            </p>
          </div>

          {/* Preset Buttons */}
          <div>
            <label
              className={`block text-[11px] mb-1 ${
                isLight ? "text-slate-700 font-medium" : "text-white"
              }`}
            >
              Atau pilih preset rentang cepat:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                {
                  label: "4 Kelompok (A-G, H-M, N-S, T-Z)",
                  val: "A-G, H-M, N-S, T-Z",
                },
                { label: "2 Kelompok (A-M, N-Z)", val: "A-M, N-Z" },
                { label: "3 Kelompok (A-I, J-R, S-Z)", val: "A-I, J-R, S-Z" },
                {
                  label: "6 Kelompok (A-D, E-H, I-L, M-P, Q-T, U-Z)",
                  val: "A-D, E-H, I-L, M-P, Q-T, U-Z",
                },
              ].map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => updateConfig("alphabetRanges", preset.val)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer border ${
                    isLight
                      ? "bg-white hover:bg-slate-100 border-slate-300 text-slate-700"
                      : "bg-black hover:bg-neutral-800 border-cyan-500/30 text-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Number of Groups */
        <div
          className={`space-y-3 p-3.5 rounded-xl border transition-colors ${
            isLight
              ? "bg-slate-50 border-slate-200 text-slate-900"
              : "bg-black border border-cyan-500/30 text-white"
          }`}
        >
          <label
            className={`block font-medium mb-1 ${
              isLight ? "text-slate-800" : "text-white"
            }`}
          >
            Target Jumlah Kelompok Abjad
          </label>
          <div className="flex flex-wrap gap-2">
            {[2, 3, 4, 5, 6, 8].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => updateConfig("alphabetNumGroups", num)}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  config.alphabetNumGroups === num
                    ? isLight
                      ? "bg-cyan-50 text-cyan-950 border-cyan-500 shadow-xs ring-1 ring-cyan-400"
                      : "bg-black text-white border-cyan-400 shadow-md ring-1 ring-cyan-400"
                    : isLight
                    ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                    : "bg-black border-cyan-500/30 text-white hover:bg-neutral-800"
                }`}
              >
                {num} Kelompok
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Include others option */}
      <label className="flex items-center gap-2 cursor-pointer pt-1 select-none">
        <input
          type="checkbox"
          checked={config.alphabetIncludeOthers}
          onChange={(e) => updateConfig("alphabetIncludeOthers", e.target.checked)}
          className={`w-4 h-4 rounded cursor-pointer ${
            isLight
              ? "bg-white border-slate-300 text-cyan-600 focus:ring-cyan-500"
              : "bg-black border-cyan-500/30 text-white focus:ring-cyan-500"
          }`}
        />
        <span
          className={`text-xs ${
            isLight ? "text-slate-700 font-medium" : "text-white"
          }`}
        >
          Buat kelompok "Lainnya" untuk nama yang diawali angka atau karakter khusus
        </span>
      </label>
    </div>
  );
};
