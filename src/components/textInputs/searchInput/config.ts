import { StyleSheet } from 'react-native';
import { theme } from '~/src/constants/theme';

export const searchInputStyles = StyleSheet.create({
  container: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radii.sm,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
  },
  input: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    color: theme.colors.darkText[100],
    ...theme.typography.textVariants.bodyPrimaryRegular,
  },
  icon: {
    padding: theme.spacing.xs,
  },
});

export const searchInputConfig = {
  iconSize: 24,
  minQueryLength: 0,
  placeholder: 'Search...',
  iconColor: theme.colors.darkText[100],
  placeholderTextColor: theme.colors.darkText[100],
} as const;
