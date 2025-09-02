import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { CustomText } from '~/src/components/utils/CustomText';
import { theme } from '~/src/constants/theme';

interface ConfirmButtonProps {
  onPress: () => void;
}

export default function ConfirmButton({ onPress }: ConfirmButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <CustomText variant="bodyPrimaryBold" style={styles.buttonText}>
        Confirm
      </CustomText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.darkText[100],
    borderRadius: theme.radii.sm,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    ...(theme.shadows.soft as any),
  },
  buttonText: {
    color: theme.colors.white.DEFAULT,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
});
