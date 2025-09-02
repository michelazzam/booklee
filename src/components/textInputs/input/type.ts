import { TextStyle, ViewStyle } from "react-native";

type InputLayoutStyle = Pick<ViewStyle, "borderRadius">;
type InputTextStyle = Pick<TextStyle, "fontSize" | "fontWeight" | "fontFamily">;
type LabelStyle = Pick<TextStyle, "fontSize" | "fontWeight" | "fontFamily">;

export type BorderStyle = {
  width: {
    default: number;
    focused: number;
  };
  color: {
    error: string;
    default: string;
    focused: string;
  };
};

export type ColorScheme = {
  background: string;
  text: {
    input: string;
    error: string;
    subText: string;
    label: {
      default: string;
      focused: string;
    };
  };
  icon: {
    default: string;
    focused: string;
  };
};

export type DropdownStyle = {
    background: string;
  borderRadius: number;
  itemBackground: {
    default: string;    
    focused: string;
  };
};

export type InputStyles = {
  label: LabelStyle;
  border: BorderStyle;
  colors: ColorScheme;
  dropdown: DropdownStyle;
  layout: InputLayoutStyle;
  inputText: InputTextStyle;
  errorText: Pick<TextStyle, "fontSize" | "fontWeight">;
};