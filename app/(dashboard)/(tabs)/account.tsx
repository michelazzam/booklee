import { View, StyleSheet } from 'react-native';
import { Text } from '~/src/components/base';
import { theme } from '~/src/constants/theme';

const Account = () => {
  return (
    <View style={styles.container}>
      <Text size={theme.typography.fontSizes['2xl']} weight="bold" style={styles.title}>
        Account
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  title: {
    marginBottom: theme.spacing.lg,
  },
});

export default Account;
