import { useEffect, useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { TextInput, Keyboard, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useDebouncing } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { searchInputStyles, searchInputConfig } from './config';
import { SearchInputProps, type SearchInputRef } from './types';
import { SearchIcon } from '~/src/assets/icons';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  (
    {
      icon,
      value,
      onPress,
      onClear,
      onFocus,
      onSearch,
      onIconPress,
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
    const [isFocused, setIsFocused] = useState(false);
    const [internalSearchQuery, setInternalSearchQuery] = useState('');

    /***** Constants ******/
    const searchQuery = internalSearchQuery;
    const debouncedQuery = useDebouncing(internalSearchQuery);

    /***** Animations ******/
    const animatedContainerStyle = useAnimatedStyle(() => {
      return {
        borderColor: withTiming(isFocused ? theme.colors.darkText[100] : theme.colors.border, {
          duration: 200,
        }),
      };
    });

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
    const handleFocus = useCallback(() => {
      setIsFocused(true);
      onFocus?.();
    }, [onFocus]);
    const handleBlur = useCallback(() => {
      setIsFocused(false);
    }, []);

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
      <AnimatedTouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        disabled={!onPress}
        style={[searchInputStyles.container, animatedContainerStyle, containerStyle, ,]}>
        <TouchableOpacity activeOpacity={0.8} onPress={onIconPress} disabled={!onIconPress}>
          {icon || (
            <SearchIcon
              width={searchInputConfig.iconSize}
              height={searchInputConfig.iconSize}
              color={searchInputConfig.iconColor}
            />
          )}
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          onBlur={handleBlur}
          value={searchQuery}
          editable={!onPress}
          autoCapitalize="none"
          onFocus={handleFocus}
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
      </AnimatedTouchableOpacity>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
export type { SearchInputRef };
