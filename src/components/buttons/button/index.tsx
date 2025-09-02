import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import React, { useMemo } from "react";
import {
  TouchableOpacity,
  type TextStyle,
  type ViewStyle,
  type StyleProp,
  StyleSheet,
  View,
  Text,
} from "react-native";

import { BUTTON_STYLES, type ButtonVariantType } from "./config";

import { Icon, type IconType } from "../../base";
import LoadingDots from "./loadingDots";

type ButtonProps = {
  title: string;
  error?: string;
  disabled?: boolean;
  onPress: () => void;
  isLoading?: boolean;
  leadingIcon?: IconType;
  trailingIcon?: IconType;
  width?: ViewStyle["width"];
  containerStyle?: ViewStyle;
  variant?: ButtonVariantType;
};

const Button = ({
  title,
  error,
  width,
  onPress,
  disabled,
  isLoading,
  leadingIcon,
  trailingIcon,
  containerStyle,
  variant = "default",
}: ButtonProps) => {
  /*** Constants ***/
  const {
    variants,
    labelStyle,
    buttonLayout,
    errorText: errorStyles,
  } = BUTTON_STYLES;
  const variantStyles = variants[variant];

  /*** Memoization ***/
  const textColor = useMemo(() => variantStyles.textColor, [variantStyles]);
  const textStyles: StyleProp<TextStyle> = useMemo(
    () => [
      {
        textAlign: "center" as const,
        fontSize: labelStyle.fontSize,
        fontWeight: labelStyle.fontWeight,
        fontFamily: labelStyle.fontFamily,
        letterSpacing: labelStyle.letterSpacing,
      },
    ],
    [labelStyle]
  );
  const buttonLayoutStyles: StyleProp<ViewStyle> = useMemo(
    () => [
      styles.base,
      {
        gap: 12,
        justifyContent: "center",
        opacity: disabled ? 0.5 : 1,
        height: buttonLayout.height,
        borderRadius: buttonLayout.borderRadius,
        backgroundColor: variantStyles.backgroundColor,
      },
    ],
    [variantStyles, buttonLayout, disabled]
  );
  const buttonBorderStyles: StyleProp<ViewStyle> = useMemo(() => {
    if (variant === "outline") {
      return {
        borderWidth: 3,
        borderColor: variants.outline.borderColor,
      };
    }

    if (error) {
      return {
        borderWidth: 2,
        borderColor: errorStyles.borderColor,
      };
    }

    return {};
  }, [variant, error, errorStyles, variants]);

  return (
    <View style={[containerStyle, { width }]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        disabled={disabled || isLoading}
        style={[buttonLayoutStyles, buttonBorderStyles]}
      >
        {isLoading ? (
          <LoadingDots
            size={8}
            numberOfDots={4}
            color={textColor}
            style={{ alignSelf: "center" }}
          />
        ) : (
          <>
            <View>
              {leadingIcon && (
                <Icon size={20} color={textColor} name={leadingIcon} />
              )}
            </View>

            <Text
              style={[
                textStyles,
                {
                  color: textColor,
                  textDecorationLine:
                    variant === "ghost" ? "underline" : "none",
                },
              ]}
            >
              {title}
            </Text>

            <View>
              {trailingIcon && (
                <Icon size={20} color={textColor} name={trailingIcon} />
              )}
            </View>
          </>
        )}
      </TouchableOpacity>

      {error && (
        <Animated.Text
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={[
            styles.errorText,
            {
              color: errorStyles.textColor,
            },
          ]}
        >
          {error}
        </Animated.Text>
      )}
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
    marginLeft: 10,
    fontWeight: "400",
  },
});
