import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import Input from '../textInputs/input';
import { Icon } from '../base';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function SearchBar({
  placeholder = 'Store, location, or service',
  value,
  onChangeText,
  onFilterPress,
  onFocus,
  onBlur,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <Input
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          leadingIcon="magnify"
          style={styles.searchInput}
          inputStyle={styles.inputText}
        />
      </View>

      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress} activeOpacity={0.7}>
        <Icon name="tune" size={24} color={theme.colors.darkText[100]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  searchInputContainer: {
    flex: 1,
  },
  searchInput: {
    marginBottom: 0,
  },
  inputText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.textVariants.bodyPrimaryRegular.fontFamily,
  },
  filterButton: {
    width: 65,
    height: 65,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.white.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
});
