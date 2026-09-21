import React from "react";
import { Sparkles } from "lucide-react";
import { useThemeMode } from "../../../context/ThemeModeContext";
import { useSoundEffects } from "../../../hooks/useSoundEffects";

export const ThemeModeSection: React.FC = () => {
  const { themeMode, setThemeMode, isDark, isLight } = useThemeMode();
  const { playSound } = useSoundEffects();

  const handleSelectDark = () => {
    if (themeMode !== "dark") {
      playSound("click");
      setThemeMode("dark");
    }
  };

  const handleSelectLight = () => {
    if (themeMode !== "light") {
      playSound("click");
      setThemeMode("light");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3
          className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 theme-section-heading ${
            isLight ? "text-slate-900" : "text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tema Tampilan Website</span>
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase border transition-colors ${
              isDark
                ? "bg-cyan-950 text-cyan-300 border-cyan-500/40"
                : "bg-amber-100 text-amber-800 border-amber-400/50"
            }`}
          >
            {isDark ? "Mode Gelap (Aktif)" : "Mode Terang (Aktif)"}
          </span>

          {/* Scaled Mechanical Rocker Switch (Uiverse) */}
          <div
            className="ui-rocker-switch"
            title={isDark ? "Klik untuk beralih ke Mode Terang" : "Klik untuk beralih ke Mode Gelap"}
          >
            <input
              id="toggle-theme-mode-header"
              type="checkbox"
              checked={isDark}
              onChange={(e) => {
                if (e.target.checked) {
                  handleSelectDark();
                } else {
                  handleSelectLight();
                }
              }}
              aria-label="Ganti Tema Website (Mode Gelap / Terang)"
            />
            <label htmlFor="toggle-theme-mode-header">
              <i />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
