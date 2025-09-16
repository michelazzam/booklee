import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput, View, Keyboard } from 'react-native';
import { useEffect, useState } from 'react';

import { useDebouncing } from '~/src/hooks';

import { searchInputStyles, searchInputConfig } from './config';
import { SearchInputProps } from './types';

// SearchInput component with enhanced props

const SearchInput = ({
  onSearch,
  containerStyle,
  placeholder = searchInputConfig.placeholder,
  onFocus,
  value,
  onChangeText,
  onSubmitEditing,
  autoFocus = false,
}: SearchInputProps) => {
  /***** States ******/
  const [internalSearchQuery, setInternalSearchQuery] = useState('');

  /***** Constants ******/
  const searchQuery = value !== undefined ? value : internalSearchQuery;
  const setSearchQuery = onChangeText || setInternalSearchQuery;

  /***** Constants ******/
  const debouncedQuery = useDebouncing(searchQuery);

  useEffect(() => {
    if (debouncedQuery.length > searchInputConfig.minQueryLength) {
      Keyboard.dismiss();
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  return (
    <View style={[searchInputStyles.container, containerStyle]}>
      <MaterialCommunityIcons
        name="magnify"
        size={searchInputConfig.iconSize}
        style={searchInputStyles.icon}
        color={searchInputConfig.iconColor}
      />

      <TextInput
        value={searchQuery}
        autoCapitalize="none"
        placeholder={placeholder}
        onChangeText={setSearchQuery}
        onFocus={onFocus}
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
        style={searchInputStyles.input}
        placeholderTextColor={searchInputConfig.placeholderTextColor}
      />

      {searchQuery.length > 0 && (
        <MaterialCommunityIcons
          name="close"
          style={searchInputStyles.icon}
          size={searchInputConfig.iconSize}
          color={searchInputConfig.iconColor}
          onPress={() => setSearchQuery('')}
        />
      )}
    </View>
  );
};

export default SearchInput;
