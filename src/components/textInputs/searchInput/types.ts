import { ViewStyle } from 'react-native';

export type SearchInputProps = {
  placeholder?: string;
  containerStyle?: ViewStyle;
  onSearch: (query: string) => void;
};
