import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../constants/theme';

interface VerificationBadgeProps {
  text: string;
  verified?: boolean;
}

export default function VerificationBadge({ text, verified = false }: VerificationBadgeProps) {
  return (
    <View style={[styles.container, verified ? styles.verified : styles.unverified]}>
      <Text style={[styles.text, verified ? styles.verifiedText : styles.unverifiedText]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.full,
    marginLeft: theme.spacing.sm,
  },
  verified: {
    backgroundColor: theme.colors.green[10],
  },
  unverified: {
    backgroundColor: theme.colors.grey[10],
  },
  text: {
    ...theme.typography.textVariants.bodyTertiaryBold,
    textTransform: 'lowercase',
  },
  verifiedText: {
    color: theme.colors.green[100],
  },
  unverifiedText: {
    color: theme.colors.grey[100],
  },
});
