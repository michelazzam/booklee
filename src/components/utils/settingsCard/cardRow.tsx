import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { theme } from '../../../constants/theme';

import { Text } from '../../base';
import { useMemo } from 'react';
import LoadingDots from '../../buttons/button/loadingDots';

export type CardRowDataType = {
  label: string;
  loading?: boolean;
  onPress?: () => void;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
};
type CardRowProps = {
  disabled?: boolean;
  data: CardRowDataType;
};

const CardRow = ({ data, disabled = false }: CardRowProps) => {
  /*** Constants ***/
  const { label, leadingIcon, trailingIcon, variant = 'primary', onPress, loading = false } = data;

  /*** Memoization ***/
  const textColor = useMemo(() => {
    switch (variant) {
      case 'primary':
        return theme.colors.darkText[100];
      case 'secondary':
        return theme.colors.green[100];
      case 'danger':
        return theme.colors.red[100];
    }
  }, [variant]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || !onPress || loading}
      style={[styles.container, styles[variant], (disabled || !onPress) && { opacity: 0.5 }]}>
      <View style={styles.iconContainer}>{leadingIcon}</View>

      {loading ? (
        <LoadingDots />
      ) : (
        <Text
          weight="medium"
          color={textColor}
          numberOfLines={1}
          style={{ flex: 1 }}
          size={theme.typography.fontSizes.md}>
          {label}
        </Text>
      )}
      <View style={styles.iconContainer}>{trailingIcon}</View>
    </TouchableOpacity>
  );
};

export default CardRow;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    borderRadius: theme.radii.sm,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  primary: {
    borderColor: 'transparent',
  },
  secondary: {
    borderColor: theme.colors.green[100],
    backgroundColor: theme.colors.green[100] + '10',
  },
  danger: {
    borderWidth: 1,
    borderColor: theme.colors.red[100],
    backgroundColor: theme.colors.red[100] + '10',
  },
  iconContainer: {
    width: 24,
    height: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.typography.textVariants.bodyPrimaryRegular,
  },
  subtitle: {
    ...theme.typography.textVariants.bodySecondaryRegular,
  },
});
