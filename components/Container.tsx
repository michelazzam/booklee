import { SafeAreaView, StyleSheet } from 'react-native';
import { theme } from '~/theme/Main';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: theme.spacing.xl,
  },
});
