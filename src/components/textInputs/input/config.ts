import type { InputStyles } from './type';
import { theme } from '~/src/constants/theme';

export const INPUT_STYLES: InputStyles = {
  /*** Layout & Dimensions ***/
  layout: {
    borderRadius: theme.radii.sm,
  },

  /*** Typography ***/
  inputText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '400',
    fontFamily: 'Montserrat-Regular',
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '400',
    fontFamily: 'Montserrat-Regular',
  },
  errorText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '400',
  },

  /*** Border Configuration ***/
  border: {
    width: {
      default: 1,
      focused: 1,
    },
    color: {
      error: '#E81717',
      focused: theme.colors.darkText[100],
      default: theme.colors.border,
    },
  },

  /*** Color Scheme ***/
  colors: {
    background: theme.colors.white.DEFAULT,
    text: {
      input: theme.colors.darkText[100],
      error: '#E81717',
      subText: theme.colors.primaryGreen[100],
      label: {
        default: theme.colors.lightText,
        focused: theme.colors.darkText[100],
      },
    },
    icon: {
      default: theme.colors.lightText,
      focused: theme.colors.darkText[100],
    },
  },

  /*** Dropdown Styling ***/
  dropdown: {
    borderRadius: theme.radii.sm,
    background: '#F5F5F5',
    itemBackground: {
      default: '#F5F5F5',
      focused: '#E0E0E0',
    },
  },
};
