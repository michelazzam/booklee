import { ViewStyle } from 'react-native';

// Updated types for SearchInput component

export type SearchInputProps = {
  placeholder?: string;
  containerStyle?: ViewStyle;
  onSearch: (query: string) => void;
  onFocus?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
};
