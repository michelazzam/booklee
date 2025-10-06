import { useEffect, useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { TextInput, Keyboard, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useDebouncing } from '~/src/hooks';

import { searchInputStyles, searchInputConfig } from './config';
import { SearchInputProps, type SearchInputRef } from './types';
import { SearchIcon } from '~/src/assets/icons';

const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  (
    {
      value,
      onPress,
      onFocus,
      onSearch,
      onClear,
      containerStyle,
      autoFocus = false,
      placeholder = searchInputConfig.placeholder,
      placeholderTextColor = searchInputConfig.placeholderTextColor,
    },
    ref
  ) => {
    /***** Refs ******/
    const inputRef = useRef<TextInput>(null);

    /***** States ******/
    const [internalSearchQuery, setInternalSearchQuery] = useState('');

    /***** Constants ******/
    const searchQuery = internalSearchQuery;
    const debouncedQuery = useDebouncing(internalSearchQuery);

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
      onClear?.();
    }, [onSearch, onClear]);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
        clear: handleClear,
      }),
      [handleClear]
    );

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
          placeholderTextColor={placeholderTextColor}
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
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
export type { SearchInputRef };
