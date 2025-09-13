import React, { useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '~/src/components/base';
import { theme } from '~/src/constants/theme';
import { useDebouncing } from '~/src/hooks';

interface CustomSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onDebouncedSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  debounceTime?: number;
}

const CustomSearchInput: React.FC<CustomSearchInputProps> = ({
  value,
  onChangeText,
  onDebouncedSearch,
  placeholder = 'Store, location, or service',
  autoFocus = false,
  debounceTime = 800,
}) => {
  const debouncedValue = useDebouncing(value, debounceTime);

  // Trigger search when debounced value changes and has content
  useEffect(() => {
    if (debouncedValue.length >= 2) {
      onDebouncedSearch(debouncedValue);
    }
  }, [debouncedValue, onDebouncedSearch]);

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <Icon name="magnify" size={20} color={theme.colors.lightText} style={styles.searchIcon} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.lightText}
        style={styles.input}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Icon name="close" size={18} color={theme.colors.lightText} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white.DEFAULT,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.darkText[100],
    paddingVertical: 0, // Remove default padding for better control
  },
  clearButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
});

export default CustomSearchInput;
