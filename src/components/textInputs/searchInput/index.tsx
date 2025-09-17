import { TextInput, Keyboard, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState, useRef, useCallback } from 'react';

import { useDebouncing } from '~/src/hooks';

import { searchInputStyles, searchInputConfig } from './config';
import { SearchIcon } from '~/src/assets/icons';
import { SearchInputProps } from './types';

const SearchInput = ({
  value,
  onPress,
  onFocus,
  onSearch,
  containerStyle,
  autoFocus = false,
  placeholder = searchInputConfig.placeholder,
}: SearchInputProps) => {
  /***** Refs ******/
  const inputRef = useRef<TextInput>(null);

  /***** States ******/
  const [internalSearchQuery, setInternalSearchQuery] = useState('');

  /***** Constants ******/
  const searchQuery = internalSearchQuery;

  /***** Constants ******/
  const debouncedQuery = useDebouncing(searchQuery);

  useEffect(() => {
    if (value !== undefined) {
      setInternalSearchQuery(value);
    }
  }, [value]);
  useEffect(() => {
    if (debouncedQuery.length > searchInputConfig.minQueryLength || debouncedQuery.length === 0) {
      Keyboard.dismiss();
      onSearch?.(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleClear = useCallback(() => {
    setInternalSearchQuery('');
    inputRef.current?.clear();
    onSearch?.('');
  }, [onSearch]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[searchInputStyles.container, containerStyle]}>
      <SearchIcon
        width={searchInputConfig.iconSize}
        height={searchInputConfig.iconSize}
        color={searchInputConfig.iconColor}
      />

      <TextInput
        ref={inputRef}
        onFocus={onFocus}
        value={searchQuery}
        editable={!onPress}
        autoCapitalize="none"
        autoFocus={autoFocus}
        placeholder={placeholder}
        placeholderTextColor={searchInputConfig.placeholderTextColor}
        style={[searchInputStyles.input, { pointerEvents: !onPress ? 'auto' : 'none' }]}
        onChangeText={(text) => {
          setInternalSearchQuery(text);
        }}
      />

      {searchQuery.length > 0 && (
        <MaterialCommunityIcons
          name="close"
          onPress={handleClear}
          style={searchInputStyles.icon}
          size={searchInputConfig.iconSize}
          color={searchInputConfig.iconColor}
        />
      )}
    </TouchableOpacity>
  );
};

export default SearchInput;
