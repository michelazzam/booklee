import { View, StyleSheet, Text } from 'react-native';
import { theme } from '~/theme/Main';

export default function AppTitle() {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.appTitle}>Booklee</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    marginTop: theme.spacing['3xl'],
    marginBottom: theme.spacing.md,
  },
  appTitle: {
    color: theme.colors.white.DEFAULT,
    fontSize: 30,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
  },
});
