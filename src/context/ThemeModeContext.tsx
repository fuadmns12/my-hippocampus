import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { safeStorage } from "../utils/safeStorage";

export type ThemeMode = "dark" | "light";

export interface ThemeModeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  isDark: boolean;
  isLight: boolean;
}

const THEME_MODE_STORAGE_KEY = "hippocampus_theme_mode";

const ThemeModeContext = createContext<ThemeModeContextType | null>(null);

export const ThemeModeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = safeStorage.getItem(THEME_MODE_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    // Default is dark mode as the current state of website
    return "dark";
  });

  const applyThemeToDOM = useCallback((mode: ThemeMode) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const body = document.body;

    if (mode === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";

      body.classList.remove("bg-black", "text-slate-100", "text-white");
      body.classList.add("bg-slate-100", "text-slate-900");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";

      body.classList.remove("bg-slate-100", "text-slate-900");
      body.classList.add("bg-black", "text-slate-100");
    }
  }, []);

  useEffect(() => {
    applyThemeToDOM(themeMode);
  }, [themeMode, applyThemeToDOM]);

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      setThemeModeState(mode);
      safeStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
      applyThemeToDOM(mode);
    },
    [applyThemeToDOM]
  );

  const toggleThemeMode = useCallback(() => {
    setThemeModeState((prev) => {
      const next: ThemeMode = prev === "dark" ? "light" : "dark";
      safeStorage.setItem(THEME_MODE_STORAGE_KEY, next);
      applyThemeToDOM(next);
      return next;
    });
  }, [applyThemeToDOM]);

  return (
    <ThemeModeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        toggleThemeMode,
        isDark: themeMode === "dark",
        isLight: themeMode === "light",
      }}
    >
      {children}
    </ThemeModeContext.Provider>
  );
};

export function useThemeMode(): ThemeModeContextType {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return context;
}
