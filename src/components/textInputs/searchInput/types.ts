import { ViewStyle } from 'react-native';

// Updated types for SearchInput component

export type SearchInputProps = {
  value?: string;
  autoFocus?: boolean;
  onClear?: () => void;
  placeholder?: string;
  onFocus?: () => void;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  placeholderTextColor?: string;
  onSearch?: (query: string) => void;
};

export type SearchInputRef = {
  focus: () => void;
  blur: () => void;
  clear: () => void;
};
