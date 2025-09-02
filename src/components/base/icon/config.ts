import { IconStyleConfig } from "./types";

export const ICON_CONFIG: IconStyleConfig = {
  /*** Default Values ***/
  defaults: {
    size: 24,
    hitSlop: 10,
    color: "#000000",
    activeOpacity: 0.7,
  },

  /*** Background Style ***/
  background: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#000000",
  },

  /*** Animation Settings ***/
  animation: {
    fill: {
      duration: 1000,
    },
    sequence: {
      duration: 1000,
    },
  },

  /*** Loading State ***/
  loading: {
    backgroundOpacity: "rgba(255,255,255,0.2)",
  },
};