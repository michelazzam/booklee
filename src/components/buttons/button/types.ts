import { TextStyle, ViewStyle } from "react-native";

type ButtonLayoutStyle = Pick<ViewStyle, "height" | "borderRadius">;
type LabelStyleType = Pick<
  TextStyle,
  "fontSize" | "fontWeight" | "fontFamily" | "letterSpacing"
>;

export type ColorVariantType = {
  textColor: string;
  borderColor?: string;
  backgroundColor: string;
};

export type ErrorTextStyleType = {
  textColor: string;
  borderColor: string;
};

export type ButtonVariantType = "outline" | "ghost" | "default";

export type ButtonStylesConfigType = {
  labelStyle: LabelStyleType;
  errorText: ErrorTextStyleType;
  buttonLayout: ButtonLayoutStyle;
  variants: Record<ButtonVariantType, ColorVariantType>;
};