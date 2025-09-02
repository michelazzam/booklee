import { ViewStyle } from "react-native";

/****************** Types ******************/
type BackgroundStyle = Pick<
  ViewStyle,
  "width" | "height" | "borderWidth" | "borderRadius" | "borderColor"
>;

type AnimationConfig = {
  duration: number;
};

export type IconStyleConfig = {
  background: BackgroundStyle;
  defaults: {
    size: number;
    color: string;
    hitSlop: number;
    activeOpacity: number;
  };
  animation: {
    fill: AnimationConfig;
    sequence: AnimationConfig;
  };
  loading: {
    backgroundOpacity: string;
  };
};