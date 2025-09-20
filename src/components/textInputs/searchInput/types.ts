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
  onSearch?: (query: string) => void;
};
