import { View, StyleSheet, Switch } from 'react-native';
import { useUserProvider } from '~/src/store';
import { UserServices } from '~/src/services';
import { Text } from '~/src/components/base';
import { theme } from '~/src/constants/theme';

const Account = () => {
  const { isBusinessMode, setBusinessMode } = useUserProvider();
  const { data: userData } = UserServices.useGetMe();

  const isOwner = userData?.user?.role === 'owner';

  return (
    <View style={styles.container}>
      <Text size={theme.typography.fontSizes['2xl']} weight="bold" style={styles.title}>
        Account
      </Text>

      {isOwner && (
        <View style={styles.businessModeContainer}>
          <Text
            weight="semiBold"
            color={theme.colors.darkText[100]}
            size={theme.typography.fontSizes.sm}
            style={{ letterSpacing: 1 }}>
            BUSINESS MODE
          </Text>
          <View style={styles.switchContainer}>
            <Text
              weight="medium"
              color={theme.colors.darkText[100]}
              size={theme.typography.fontSizes.xs}
              style={{ marginRight: theme.spacing.sm }}>
              {isBusinessMode ? 'ON' : 'OFF'}
            </Text>
            <Switch
              value={isBusinessMode}
              onValueChange={setBusinessMode}
              trackColor={{
                false: theme.colors.grey[100],
                true: theme.colors.primaryGreen[100],
              }}
              thumbColor={theme.colors.white.DEFAULT}
              ios_backgroundColor={theme.colors.grey[100]}
            />
          </View>
        </View>
      )}
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
  businessModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Account;
