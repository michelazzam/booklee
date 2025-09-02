import { Link, Stack } from 'expo-router';

import { StyleSheet, Text, View } from 'react-native';
import { theme } from '~/src/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>{"This screen doesn't exist."}</Text>
        <Link href="/">
          <Text style={[styles.link, styles.linkText]}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
  },
  link: {
    marginTop: 16,
    paddingTop: 16,
  },
  linkText: {
    fontSize: theme.typography.fontSizes.md,
    color: '#2e78b7',
  },
});
