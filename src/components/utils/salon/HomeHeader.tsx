import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../constants/theme';
import { useAppSafeAreaInsets } from '~/src/hooks/useAppSafeAreaInsets';

interface HomeHeaderProps {
  userName: string;
}

export default function HomeHeader({ userName }: HomeHeaderProps) {
  const { top } = useAppSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: top * 2 }]}>
      <Text style={styles.greeting}>Hello {userName}!</Text>
      <Text style={styles.subtitle}>What would you like to do today?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryBlue[100],

    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  greeting: {
    ...theme.typography.textVariants.headline,
    color: theme.colors.white.DEFAULT,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.textVariants.bodyPrimaryRegular,
    color: theme.colors.white.DEFAULT,
  },
});
