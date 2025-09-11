import { View, StyleSheet } from 'react-native';
import { theme } from '../../../constants/theme';

interface AccountCardProps {
  children: React.ReactNode;
  style?: any;
}

export default function AccountCard({ children, style }: AccountCardProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.soft,
  },
});
