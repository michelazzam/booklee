import type { TextStyle } from "react-native";

export type ContainerStyle = {
  readonly gap: number;
};

export type BoxStyle = {
  readonly width: number;
  readonly height: number;
  readonly borderWidth: number;
  readonly borderRadius: number;
};

export type TypographyStyle = {
  readonly fontSize: number;
  readonly fontFamily: string;
  readonly letterSpacing: number;
  readonly fontWeight: TextStyle["fontWeight"];
};

export type ColorStyle = {
  readonly text: string;
  readonly placeholder: string;
  readonly border: {
    readonly error: string;
    readonly filled: string;
    readonly default: string;
  };
};

export type CodeInputsStyles = {
  readonly box: BoxStyle;
  readonly colors: ColorStyle;
  readonly container: ContainerStyle;
  readonly typography: TypographyStyle;
};