import { ToggleSettingsType } from "@/types/Settings";

export const ToggleSettingsLabels: Record<keyof ToggleSettingsType, string> = {
  dynamicBackground: "Dynamic Background",
  showCardBackground: "Show Card Background",
  showTrackNumber: "Show Track Number",
  showAnimations: "Show Swipe Animations",
  getLatestSong: "Get Latest Song",
};

export const SliderSettingsLabels: Record<string, string> = {
  fadeInBackgroundDuration: "Fade In Background",
};
