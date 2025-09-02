import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { theme } from '~/src/constants/theme';

type VariantKeys = keyof typeof theme.typography.textVariants;

type Props = RNTextProps & {
  variant?: VariantKeys;
};

export function CustomText({ variant = 'bodyPrimaryRegular', style, ...props }: Props) {
  return <RNText {...props} style={[style, theme.typography.textVariants[variant]]} />;
}
