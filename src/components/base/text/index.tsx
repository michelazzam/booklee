import { type TextProps as RNTextProps, TextStyle } from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';
import { forwardRef, ReactNode } from 'react';

import { TEXT_CONFIG, type WeightVariantType } from './config';

type TextProps = AnimatedProps<typeof Animated.Text> &
  RNTextProps & {
    size?: number;
    color?: string;
    children?: ReactNode;
    style?: TextStyle | TextStyle[];

    /**
     * Font weight variants with Inter font files:
     * - light    → Inter-Light (300)
     * - regular  → Inter-Regular (400)
     * - medium   → Inter-Medium (500)
     * - semiBold → Inter-SemiBold (600)
     * - bold     → Inter-Bold (700)
     * - black    → Inter-Black (800+)
     * @default "regular"
     */
    weight?: WeightVariantType;
  };

const { fontFamily, fontWeight, defaults } = TEXT_CONFIG;

const CustomText = forwardRef<Animated.Text, TextProps>(
  (
    {
      style,
      children,
      size = defaults.size,
      color = defaults.color,
      weight = defaults.weight,
      ...props
    },
    ref
  ) => {
    return (
      <Animated.Text
        ref={ref}
        style={[
          {
            color,
            fontSize: size,
            fontWeight: fontWeight[weight],
            fontFamily: fontFamily[weight],
          },
          style,
        ]}
        {...props}>
        {children}
      </Animated.Text>
    );
  }
);

CustomText.displayName = 'CustomText';
export default CustomText;
