import { PresetTemplate } from "../types";
import {
  SPECIFIC_PRESETS,
  techTeamPreset,
  appFeaturesPreset,
  startupLaunchPreset,
  cloudArchitecturePreset,
} from "./presets/specificPresets";
import {
  GENERAL_PRESETS,
  class10aPreset,
  eventCommitteePreset,
} from "./presets/generalPresets";

/**
 * Full list of preset templates organized across domains (Spesifik & Umum)
 * Preserves the exact original order for consistent UI and initialization.
 */
export const PRESET_TEMPLATES: PresetTemplate[] = [
  ...SPECIFIC_PRESETS,
  ...GENERAL_PRESETS,
];

// Grouped aliases for folder categorization
export const SPESIFIK_PRESETS = SPECIFIC_PRESETS;
export const UMUM_PRESETS = GENERAL_PRESETS;

// Helper to look up preset by identifier
export function getPresetById(id: string): PresetTemplate | undefined {
  return PRESET_TEMPLATES.find((p) => p.id === id);
}

// Re-export individual presets
export {
  techTeamPreset,
  appFeaturesPreset,
  startupLaunchPreset,
  cloudArchitecturePreset,
  class10aPreset,
  eventCommitteePreset,
  SPECIFIC_PRESETS,
  GENERAL_PRESETS,
};
