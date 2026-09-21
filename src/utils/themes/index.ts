import { ColorTheme } from "../../types";
import { ThemePalette } from "./types";
import {
  pastelPalette,
  sunsetPalette,
  corporatePalette,
  emeraldPalette,
  monochromePalette,
} from "./lightThemes";
import { neonDarkPalette, myVersionPalette } from "./darkThemes";

export * from "./types";
export * from "./lightThemes";
export * from "./darkThemes";

export const THEME_PALETTES: Record<ColorTheme, ThemePalette> = {
  pastel: pastelPalette,
  "neon-dark": neonDarkPalette,
  sunset: sunsetPalette,
  corporate: corporatePalette,
  emerald: emeraldPalette,
  monochrome: monochromePalette,
  "my-version": myVersionPalette,
};

export function getThemePalette(theme: ColorTheme): ThemePalette {
  return THEME_PALETTES[theme] ?? THEME_PALETTES["my-version"];
}
