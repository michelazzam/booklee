import type { MaterialCommunityIcons } from "@expo/vector-icons";

export type IconType = keyof typeof MaterialCommunityIcons.glyphMap;
export type ToastType = "success" | "error" | "info" | "warning";

export type ToastStyleConfig = {
  title: string;
  icon: IconType;
  subtitle: string;
  iconColor: string;
  textColor: string;
  subtitleColor: string;
  closeIconColor: string;
  backgroundColor: string;
  progressBarColor: string;
  progressTrackColor: string;
}

export type ToastConfigType = {
  [key: string]: ToastStyleConfig;
}

export type ToastThemeConfig = {
  colors: {
    info: ToastStyleConfig;
    error: ToastStyleConfig;
    success: ToastStyleConfig;
    warning: ToastStyleConfig;
  };
  defaults: {
    duration: number;
    iconSize: number;
    fontFamily: string;
    borderRadius: number;
    closeIconSize: number;
    showProgress: boolean;
  };
}
