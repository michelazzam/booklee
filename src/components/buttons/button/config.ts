import type {
  ButtonStylesConfigType,
  ColorVariantType,
  ErrorTextStyleType,
  ButtonVariantType,
} from './types';
import { theme } from '~/src/constants/theme';

export const BUTTON_STYLES: ButtonStylesConfigType = {
  /*** Layout & Dimensions ***/
  buttonLayout: {
    height: 47,
    borderRadius: theme.radii.sm,
  },

  /*** Typography ***/
  labelStyle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'Montserrat-Bold',
  },

  /*** Color Variants ***/
  variants: {
    default: {
      textColor: theme.colors.white.DEFAULT,
      backgroundColor: theme.colors.darkText[100],
    },
    ghost: {
      textColor: theme.colors.primaryGreen[100],
      backgroundColor: 'transparent',
    },
    outline: {
      textColor: theme.colors.primaryGreen[100],
      borderColor: theme.colors.primaryGreen[100],
      backgroundColor: 'transparent',
    },
  },

  /*** Error State ***/
  errorText: {
    textColor: '#E81717',
    borderColor: '#E81717',
  },
};

export type { ColorVariantType, ErrorTextStyleType, ButtonVariantType };
