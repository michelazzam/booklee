/* eslint-disable react-hooks/rules-of-hooks */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  useImperativeHandle,
  useCallback,
  forwardRef,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import {
  type TextInputProps,
  TouchableOpacity,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
  StyleSheet,
  TextInput,
  Keyboard,
  View,
  Text,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  LinearTransition,
  interpolateColor,
  useSharedValue,
  Extrapolation,
  interpolate,
  withTiming,
  runOnJS,
  FadeOut,
  FadeIn,
  Easing,
} from 'react-native-reanimated';

import { INPUT_STYLES } from './config';

type IconType = keyof typeof MaterialCommunityIcons.glyphMap;
export type InputRef = {
  blur: () => void;
  focus: () => void;
  clear: () => void;
};

type BaseInputProps = Omit<TextInputProps, 'editable' | 'onPress'> & {
  label?: string;
  error?: string;
  style?: ViewStyle;
  onBlur?: () => void;
  onFocus?: () => void;
  inputStyle?: TextStyle;
  leadingIcon?: IconType;
  trailingIcon?: IconType;
  inputWidth?: ViewStyle['width'];
  onChangeText?: (text: string) => void;
  subText?: { label: string; action: () => void };
};
type DefaultInputProps = BaseInputProps & {
  onPress?: never;
  variant?: 'default';
  editable?: boolean;
};
type PasswordInputProps = BaseInputProps & {
  editable?: boolean;
  variant: 'password';
};
type EmailInputProps = BaseInputProps & {
  editable?: boolean;
  variant: 'email';
};
type DropDownInputProps = BaseInputProps & {
  editable: false;
  variant: 'dropdown';
  options: readonly string[];
};
type PressableInputProps = BaseInputProps & {
  editable: false;
  onPress: () => void;
  variant: 'pressable';
};

type InputProps =
  | EmailInputProps
  | DefaultInputProps
  | PasswordInputProps
  | DropDownInputProps
  | PressableInputProps;

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 3;
const SNAP_OFFSET = (ITEM_HEIGHT * VISIBLE_ITEMS) / VISIBLE_ITEMS;
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Input = forwardRef<InputRef, InputProps>(
  (
    {
      style,
      label,
      error,
      onBlur,
      onFocus,
      subText, // @ts-expect-error
      options, // @ts-expect-error
      onPress,
      inputStyle,
      inputWidth,
      placeholder,
      leadingIcon,
      onChangeText,
      trailingIcon,
      editable = true,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    /***** Refs ******/
    const inputRef = useRef<TextInput>(null);
    const scrollViewRef = useRef<Animated.ScrollView>(null);

    /***** Constants *****/
    const { externalLabel, border, layout, colors, dropdown, inputText, errorText } = INPUT_STYLES;

    /***** States ******/
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    /***** Memoization ******/
    const isPassword = useMemo(() => variant === 'password', [variant]);
    const containerHeight = useMemo(() => ITEM_HEIGHT * VISIBLE_ITEMS, []);
    const isMultiline = useMemo(() => props.multiline ?? false, [props.multiline]);
    const isDropdown = useMemo(
      () => variant === 'dropdown' && Array.isArray(options),
      [variant, options]
    );
    const disabled = useMemo(() => {
      const excludedVariants = ['pressable', 'dropdown'];

      return !editable && !excludedVariants.includes(variant);
    }, [editable, variant]);

    /***** Styles *****/
    const inputContainerStyles: StyleProp<ViewStyle> = useMemo(
      () => [
        styles.inputContainer,
        {
          borderRadius: layout.borderRadius,
          backgroundColor: colors.background,
          alignItems: isMultiline ? 'flex-start' : 'center',
        },
        isMultiline && {
          minHeight: 120,
          paddingTop: 16,
        },
      ],
      [layout, colors.background, isMultiline]
    );
    const inputTextStyles: StyleProp<TextStyle> = useMemo(
      () => [
        styles.input,
        {
          color: colors.text.input,
          fontSize: inputText.fontSize,
          fontWeight: inputText.fontWeight,
          fontFamily: inputText.fontFamily,
        },
        inputStyle,
        isDropdown && styles.dropdownText,
        isMultiline && styles.multilineInput,
      ],
      [inputText, colors.text.input, inputStyle, isMultiline, isDropdown]
    );
    const dropdownWrapperStyles: StyleProp<ViewStyle> = useMemo(
      () => [
        styles.dropdownWrapper,
        {
          height: containerHeight,
          borderRadius: dropdown.borderRadius,
          backgroundColor: dropdown.background,
        },
      ],
      [dropdown, containerHeight]
    );
    const errorTextStyles: StyleProp<TextStyle> = useMemo(
      () => [
        {
          marginTop: 8,
          marginLeft: 12,
          color: colors.text.error,
          fontSize: errorText.fontSize,
          fontWeight: errorText.fontWeight,
        },
      ],
      [colors.text.error, errorText]
    );

    /***** Input Configuration ******/
    const inputConfiguration = useMemo(() => {
      const config: Partial<TextInputProps> = {};

      switch (variant) {
        case 'email':
          config.spellCheck = false;
          config.autoCorrect = false;
          config.returnKeyType = 'next';
          config.autoComplete = 'email';
          config.autoCapitalize = 'none';
          config.keyboardType = 'email-address';
          config.textContentType = 'emailAddress';
          break;

        case 'password':
          config.spellCheck = false;
          config.autoCorrect = false;
          config.returnKeyType = 'done';
          config.autoCapitalize = 'none';
          config.autoComplete = 'password';
          config.textContentType = 'password';
          break;

        default:
          config.returnKeyType = 'next';
      }

      return config;
    }, [variant]);

    useEffect(() => {
      if (props.value !== undefined) {
        setInputValue(props.value);
      }
    }, [props]);
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
      clear: () => {
        setInputValue('');
        onChangeText?.('');
        setIsFocused(false);
        setShowPassword(false);
        inputRef.current?.clear();
      },
    }));

    /***** Animated Styles ******/
    const scrollY = useSharedValue(0);
    const isUserScrolling = useSharedValue(false);
    const containerAnimatedStyle = useAnimatedStyle(() => {
      const getBorderColor = () => {
        if (error) return border.color.error;
        if (isFocused) return border.color.focused;

        return border.color.default;
      };

      const borderWidth = withTiming(isFocused ? border.width.focused : border.width.default);
      const borderColor = withTiming(getBorderColor());

      return {
        borderColor,
        borderWidth,
      };
    });
    const dropDownAnimatedStyle = useAnimatedStyle(() => {
      if (!isDropdown) return { opacity: 0, transform: [{ scaleY: 0 }] };

      const animationConfig = {
        duration: 250,
        easing: Easing.out(Easing.quad),
      };

      return {
        opacity: withTiming(isDropdownOpen ? 1 : 0, animationConfig),
        transform: [
          {
            scaleY: withTiming(isDropdownOpen ? 1 : 0, animationConfig),
          },
        ],
      };
    });
    const dropDownItemStyles = (options ?? []).map((_: string, index: number) => {
      return useAnimatedStyle(() => {
        const inputRange = [
          (index - 1) * ITEM_HEIGHT,
          index * ITEM_HEIGHT,
          (index + 1) * ITEM_HEIGHT,
        ];

        const scale = interpolate(scrollY.value, inputRange, [0.8, 1, 0.8], Extrapolation.CLAMP);
        const opacity = interpolate(scrollY.value, inputRange, [0.5, 1, 0.5], Extrapolation.CLAMP);
        const translateY = interpolate(
          scrollY.value,
          inputRange,
          [ITEM_HEIGHT * 0.2, 0, -ITEM_HEIGHT * 0.2],
          Extrapolation.CLAMP
        );
        const backgroundColor = interpolateColor(scrollY.value, inputRange, [
          dropdown.itemBackground.default,
          dropdown.itemBackground.focused,
          dropdown.itemBackground.default,
        ]);

        return {
          opacity,
          backgroundColor,
          transform: [{ scale }, { translateY }],
        };
      });
    });

    /***** Text Input Handlers ******/
    const handleChangeText = useCallback(
      (text: string) => {
        setInputValue(text);
        onChangeText?.(text);
      },
      [onChangeText]
    );
    const handlePress = useCallback(() => {
      switch (variant) {
        case 'dropdown':
          handleDropDownPress();
          break;
        case 'pressable':
          onPress?.();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant, onPress]);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      onFocus?.();
    }, [onFocus]);
    const handleBlur = useCallback(() => {
      setIsFocused(false);
      onBlur?.();
    }, [onBlur]);

    /***** DropDown Handlers ******/
    const scrollToIndex = useCallback(
      (index: number) => {
        if (scrollViewRef.current && isDropdown) {
          scrollViewRef.current.scrollTo({
            y: index * ITEM_HEIGHT,
            animated: true,
          });
        }
      },
      [isDropdown]
    );
    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
      },
      onBeginDrag: () => {
        isUserScrolling.value = true;
      },
      onMomentumEnd: (event) => {
        if (
          !isDropdown ||
          !Array.isArray(options) ||
          options.length === 0 ||
          !isUserScrolling.value
        )
          return;

        const index = Math.round(event.contentOffset.y / ITEM_HEIGHT);
        if (index >= 0 && index < options.length) {
          const selectedOption = options[index];

          runOnJS(setIsDropdownOpen)(false);
          runOnJS(handleChangeText)(selectedOption);
        }
        isUserScrolling.value = false;
      },
    });
    const handleDropDownPress = useCallback(() => {
      Keyboard.dismiss();

      if (!isDropdown || !Array.isArray(options) || options.length === 0) return;

      setIsDropdownOpen((prevState) => {
        const willOpen = !prevState;

        // If opening and there's a current value, scroll to it
        if (willOpen && inputValue) {
          const currentIndex = options.findIndex((option) => option === inputValue);

          if (currentIndex !== -1) {
            requestAnimationFrame(() => {
              isUserScrolling.value = false;
              scrollToIndex(currentIndex);
              scrollY.value = currentIndex * ITEM_HEIGHT;
            });
          }
        }

        return willOpen;
      });
    }, [options, scrollY, isDropdown, inputValue, scrollToIndex, isUserScrolling]);
    const handleSelect = useCallback(
      (option: string, index: number) => {
        scrollY.value = index * ITEM_HEIGHT;
        scrollToIndex(index);
        handleChangeText(option);
        setIsDropdownOpen(false);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [scrollToIndex, scrollY, setIsDropdownOpen]
    );

    return (
      <View style={[styles.container, { width: inputWidth }]}>
        {label && <Text style={externalLabel}>{label}</Text>}

        <Animated.View style={style} layout={LinearTransition.easing(Easing.inOut(Easing.ease))}>
          <AnimatedTouchable
            disabled={disabled}
            activeOpacity={0.8}
            onPress={handlePress}
            style={[inputContainerStyles, containerAnimatedStyle]}>
            {leadingIcon && (
              <MaterialCommunityIcons
                size={24}
                name={leadingIcon}
                style={styles.leadingIcon}
                color={isFocused ? colors.icon.focused : colors.icon.default}
              />
            )}

            <View style={[styles.inputWrapper, !editable && styles.disabledInput]}>
              <TextInput
                ref={inputRef}
                value={inputValue}
                editable={editable}
                onBlur={handleBlur}
                onFocus={handleFocus}
                multiline={isMultiline}
                style={inputTextStyles}
                placeholder={placeholder}
                onChangeText={handleChangeText}
                secureTextEntry={isPassword && !showPassword}
                placeholderTextColor={isFocused ? '#ffffff' : colors.text.placeholder}
                {...inputConfiguration}
                {...props}
              />
            </View>

            {isPassword ? (
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={!editable}
                onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  size={24}
                  name={showPassword ? 'eye-off' : 'eye'}
                  color={isFocused ? colors.icon.focused : colors.icon.default}
                />
              </TouchableOpacity>
            ) : trailingIcon ? (
              <MaterialCommunityIcons
                size={24}
                name={trailingIcon}
                style={styles.trailingIcon}
                color={isFocused ? colors.icon.focused : colors.icon.default}
              />
            ) : null}
          </AnimatedTouchable>

          {!!error && (
            <Animated.Text entering={FadeIn} exiting={FadeOut} style={errorTextStyles}>
              {error}
            </Animated.Text>
          )}

          {!!subText && (
            <Text onPress={subText.action} style={[styles.subText, { color: colors.text.subText }]}>
              {subText.label}
            </Text>
          )}
        </Animated.View>

        {isDropdown && isDropdownOpen && (
          <Animated.View style={[dropDownAnimatedStyle, dropdownWrapperStyles]}>
            <Animated.ScrollView
              ref={scrollViewRef}
              scrollEventThrottle={16}
              onScroll={scrollHandler}
              snapToInterval={ITEM_HEIGHT}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}>
              {(options ?? []).map((option: string, index: number) => (
                <Animated.View
                  key={index}
                  style={[styles.optionContainer, dropDownItemStyles[index]]}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.option}
                    onPress={() => handleSelect(option, index)}>
                    <Text style={[styles.optionText, { color: colors.text.input }]}>{option}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </Animated.ScrollView>
          </Animated.View>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
export default Input;

const styles = StyleSheet.create({
  container: {
    gap: 4,
    flexShrink: 1,
  },
  inputContainer: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  disabledInput: {
    pointerEvents: 'none',
  },
  input: {
    flex: 1,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dropdownText: {
    textTransform: 'capitalize',
  },
  leadingIcon: {
    marginRight: 12,
  },
  trailingIcon: {
    marginLeft: 12,
  },
  footerContainer: {
    flex: 1,
    marginTop: 12,
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownWrapper: {
    width: '100%',
    overflow: 'hidden',
    transformOrigin: 'top',
  },
  scrollViewContent: {
    paddingVertical: SNAP_OFFSET,
  },
  optionContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
  option: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subText: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '400',
    fontFamily: 'Inter',
    alignSelf: 'flex-end',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
});
