import { PresetTemplate } from "../../../types";
import { techTeamPreset } from "./techTeamPreset";
import { appFeaturesPreset } from "./appFeaturesPreset";
import { startupLaunchPreset } from "./startupLaunchPreset";
import { cloudArchitecturePreset } from "./cloudArchitecturePreset";

export {
  techTeamPreset,
  appFeaturesPreset,
  startupLaunchPreset,
  cloudArchitecturePreset,
};

export const SPECIFIC_PRESETS: PresetTemplate[] = [
  techTeamPreset,
  appFeaturesPreset,
  startupLaunchPreset,
  cloudArchitecturePreset,
];
