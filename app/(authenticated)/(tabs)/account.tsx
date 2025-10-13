import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';

import { theme } from '~/src/constants/theme';
import {
  ChevronRightIcon,
  UserInfoIcon,
  EnvelopeIcon,
  LogoutIcon,
  PhoneIcon,
  TrashIcon,
  BellIcon,
} from '~/src/assets/icons';

import { AuthServices, UserServices } from '~/src/services';
// import { useUserProvider } from '~/src/store';

import { SettingsCard, ScreenHeader, type CardRowDataType } from '~/src/components/utils';
import { AwareScrollView, Text } from '~/src/components/base';

const AccountPage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { data: userData } = UserServices.useGetMe();
  const { mutate: logout, isPending: isLogoutPending } = AuthServices.useLogout();
  const { mutate: deleteUser, isPending: isDeleteUserPending } = UserServices.useDeleteUser();

  const handleDeleteAccount = useCallback(() => {
    deleteUser(undefined, {
      onError: (error) => {
        Toast.error(error.message);
      },
    });
  }, [deleteUser]);

  /*** Memoization ***/
  const personalInformationData: CardRowDataType[] = useMemo(() => {
    if (!userData) return [];

    return [
      {
        label: `${userData?.user?.firstName || 'User'} ${userData?.user?.lastName || ''}`,
        leadingIcon: <UserInfoIcon />,
        trailingIcon: <ChevronRightIcon />,
        onPress: () => {
          router.navigate('/(authenticated)/(screens)/settings/edit-personal-info');
        },
      },
      {
        label: userData?.user?.email || '',
        leadingIcon: <EnvelopeIcon />,
        trailingIcon: <ChevronRightIcon />,
      },
      {
        leadingIcon: <PhoneIcon />,
        trailingIcon: <ChevronRightIcon />,
        label: userData?.user?.phone || 'No phone number',
        onPress: () => {
          router.navigate('/(authenticated)/(screens)/settings/editPhone');
        },
      },
    ];
  }, [userData, router]);
  const appSettingsData: CardRowDataType[] = useMemo(() => {
    return [
      {
        onPress: logout,
        label: 'LOG OUT',
        loading: isLogoutPending,
        leadingIcon: <LogoutIcon />,
      },
      {
        variant: 'danger',
        label: 'DELETE ACCOUNT',
        leadingIcon: <TrashIcon />,
        loading: isDeleteUserPending,
        onPress: () =>
          Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: handleDeleteAccount },
          ]),
      },
    ];
  }, [logout, isLogoutPending, isDeleteUserPending, handleDeleteAccount]);

  return (
    <View style={styles.container}>
      <ScreenHeader
        trailing={
          <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
            <BellIcon width={24} height={24} color={theme.colors.white.DEFAULT} />
          </TouchableOpacity>
        }
        title={
          <View style={{ gap: theme.spacing.xs }}>
            <Text
              weight="bold"
              color={theme.colors.white.DEFAULT}
              size={theme.typography.fontSizes.xl}>
              Booklee
            </Text>
          </View>
        }
      />

      <AwareScrollView contentContainerStyle={styles.scrollContent}>
        <SettingsCard data={personalInformationData} title="PERSONAL INFORMATION" />

        <SettingsCard data={appSettingsData} />
      </AwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white[100],
  },
  scrollContent: {
    flexGrow: 1,
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing['2xl'],
  },
  businessModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.textVariants.ctaSecondaryBold,
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
});

export default AccountPage;
