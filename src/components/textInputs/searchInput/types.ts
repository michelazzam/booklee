import { ViewStyle } from 'react-native';

// Updated types for SearchInput component

export type SearchInputProps = {
  value?: string;
  autoFocus?: boolean;
  placeholder?: string;
  onFocus?: () => void;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  onSearch?: (query: string) => void;
};
