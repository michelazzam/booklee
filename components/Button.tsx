import { forwardRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { theme } from '~/theme/Main';

type ButtonProps = {
  title: string;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, style, ...touchableProps }, ref) => {
  return (
    <TouchableOpacity ref={ref} {...touchableProps} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryBlue[100],
    borderRadius: 28,
    padding: theme.spacing.xl,
    ...(theme.shadows.soft as any),
  },
  buttonText: {
    color: theme.colors.white.DEFAULT,
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semiBold,
    textAlign: 'center',
  },
});
