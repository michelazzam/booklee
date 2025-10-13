import { View, StyleSheet } from 'react-native';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { Text } from '~/src/components/base';
import { theme } from '~/src/constants/theme';
import SettingsCard, { CardRowDataType } from '~/src/components/utils/settingsCard';
import { LogoutIcon } from '~/src/assets/icons';
import { AuthServices } from '~/src/services';
import { useMemo } from 'react';

const Account = () => {
  /*** Constants ***/
  const { top } = useAppSafeAreaInsets();
  const { mutate: logout, isPending: isLogoutPending } = AuthServices.useLogout();

  const appSettingsData: CardRowDataType[] = useMemo(() => {
    return [
      {
        onPress: logout,
        label: 'LOG OUT',
        variant: 'danger',
        loading: isLogoutPending,
        leadingIcon: <LogoutIcon />,
      },
    ];
  }, [logout, isLogoutPending]);

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Text size={theme.typography.fontSizes['2xl']} weight="bold" style={styles.title}>
        Account
      </Text>

      <SettingsCard title="APP SETTINGS" data={appSettingsData} />
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
