export const colors = {
  // Neutrals
  darkText: {
    100: '#1f1f1f',
    50: 'rgba(31, 31, 31, 0.5)',
    25: 'rgba(31, 31, 31, 0.25)',
  },
  lightText: '#737373',
  border: '#EBEAEA',
  white: {
    100: '#FFFFFF',
    50: 'rgba(255, 255, 255, 0.5)',
    DEFAULT: '#FFFFFF',
  },

  // Primary
  primaryBlue: {
    100: '#476c80',
    50: 'rgba(71, 108, 128, 0.5)',
    10: 'rgba(71, 108, 128, 0.1)',
  },
  primaryGreen: {
    100: '#276231',
    50: 'rgba(39, 98, 49, 0.5)',
    10: 'rgba(39, 98, 49, 0.1)',
  },

  // Secondary
  secondaryPurple: {
    100: '#2927AE',
    50: 'rgba(41, 39, 174, 0.5)',
    10: 'rgba(41, 39, 174, 0.1)',
  },
  secondaryPink: {
    100: '#ED818A',
    50: 'rgba(237, 129, 138, 0.5)',
    10: 'rgba(237, 129, 138, 0.1)',
  },
  secondaryBlue: {
    100: '#54BEEF',
    50: 'rgba(84, 190, 239, 0.5)',
    10: 'rgba(84, 190, 239, 0.1)',
  },

  // Messaging
  red: {
    100: '#9A2626',
    10: 'rgba(154, 38, 38, 0.1)',
  },
  grey: {
    100: '#737373',
    10: 'rgba(115, 115, 115, 0.1)',
  },
  orange: {
    100: '#ab590d',
    10: 'rgba(171, 89, 13, 0.1)',
  },
  green: {
    100: '#276231',
    10: 'rgba(39, 98, 49, 0.1)',
  },
} as const;

export const shadows = {
  soft: {
    // iOS Shadows
    shadowRadius: 1,
    shadowOpacity: 0.1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },

    // Android Shadows
    elevation: 4,
  },
} as const;

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
} as const;

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 22,
    '3xl': 24,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 22,
    xl: 28,
  },
  textVariants: {
    // Headlines & Titles
    headline: {
      fontFamily: 'Montserrat-SemiBold',
      fontSize: 22,
      lineHeight: 28,
    },
    subHeadline: {
      fontFamily: 'Montserrat-Medium',
      fontSize: 16,
      lineHeight: 20,
    },

    // Body Primary
    bodyPrimaryRegular: {
      fontFamily: 'Montserrat-Regular',
      fontSize: 14,
      lineHeight: 22,
    },
    bodyPrimaryBold: {
      fontFamily: 'Montserrat-SemiBold',
      fontSize: 14,
      lineHeight: 22,
    },
    bodyPrimaryHyperlink: {
      fontFamily: 'Montserrat-SemiBold',
      fontSize: 14,
      lineHeight: 22,
      textDecorationLine: 'underline',
    },

    // Body Secondary
    bodySecondaryRegular: {
      fontFamily: 'Montserrat-Regular',
      fontSize: 11,
      lineHeight: 16,
    },
    bodySecondaryBold: {
      fontFamily: 'Montserrat-SemiBold',
      fontSize: 11,
      lineHeight: 16,
    },
    bodySecondaryHyperlink: {
      fontFamily: 'Montserrat-SemiBold',
      fontSize: 11,
      lineHeight: 16,
      textDecorationLine: 'underline',
    },

    // Body Tertiary
    bodyTertiaryRegular: {
      fontFamily: 'Montserrat-Medium',
      fontSize: 8,
      lineHeight: 12,
    },
    bodyTertiaryBold: {
      fontFamily: 'Montserrat-Bold',
      fontSize: 8,
      lineHeight: 12,
    },

    // CTA Primary
    ctaPrimaryRegular: {
      fontFamily: 'Montserrat-Medium',
      fontSize: 14,
      lineHeight: 22,
      textTransform: 'uppercase',
    },
    ctaPrimaryBold: {
      fontFamily: 'Montserrat-Bold',
      fontSize: 14,
      lineHeight: 22,
      textTransform: 'uppercase',
    },

    // CTA Secondary
    ctaSecondaryRegular: {
      fontFamily: 'Montserrat-Medium',
      fontSize: 12,
      lineHeight: 16,
      textTransform: 'uppercase',
    },
    ctaSecondaryBold: {
      fontFamily: 'Montserrat-Bold',
      fontSize: 12,
      lineHeight: 16,
      textTransform: 'uppercase',
    },
  },
} as const;

export const theme = {
  colors,
  spacing,
  radii,
  shadows,
  typography,
} as const;

export type Theme = typeof theme;
