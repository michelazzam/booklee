import { TextStyle, ViewStyle } from 'react-native';

type InputLayoutStyle = Pick<ViewStyle, 'borderRadius'>;
type InputTextStyle = Pick<TextStyle, 'fontSize' | 'fontWeight' | 'fontFamily'>;
type ExternalLabelStyle = Pick<
  TextStyle,
  'fontSize' | 'fontWeight' | 'fontFamily' | 'color' | 'marginBottom'
>;

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
    placeholder: string;
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
  border: BorderStyle;
  colors: ColorScheme;
  dropdown: DropdownStyle;
  layout: InputLayoutStyle;
  inputText: InputTextStyle;
  externalLabel: ExternalLabelStyle;
  errorText: Pick<TextStyle, 'fontSize' | 'fontWeight'>;
};
