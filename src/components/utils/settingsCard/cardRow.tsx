import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { theme } from '../../../constants/theme';

import { Text } from '../../base';
import { useMemo } from 'react';

export type CardRowDataType = {
  label: string;
  onPress?: () => void;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
};
type CardRowProps = {
  data: CardRowDataType;
};

const CardRow = ({ data }: CardRowProps) => {
  /*** Constants ***/
  const { label, leadingIcon, trailingIcon, variant = 'primary', onPress } = data;

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
      disabled={!onPress}
      activeOpacity={0.7}
      style={[styles.container, styles[variant]]}>
      <View style={styles.iconContainer}>{leadingIcon}</View>

      <Text
        weight="medium"
        color={textColor}
        numberOfLines={1}
        style={{ flex: 1 }}
        size={theme.typography.fontSizes.md}>
        {label}
      </Text>

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
