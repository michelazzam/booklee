import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

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
import { useUserProvider } from '~/src/store';

import { SettingsCard, ScreenHeader, type CardRowDataType } from '~/src/components/utils';
import { AwareScrollView, Text } from '~/src/components/base';

const AccountPage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { data: userData } = UserServices.useGetMe();
  const { userIsGuest, logoutGuest } = useUserProvider();
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
    let data: CardRowDataType[] = [
      {
        label: 'LOG OUT',
        loading: isLogoutPending,
        leadingIcon: <LogoutIcon />,
        onPress: () => {
          if (userIsGuest) {
            logoutGuest();
          } else {
            logout();
          }
        },
      },
    ];

    if (!userIsGuest) {
      data.push({
        variant: 'danger',
        label: 'DELETE ACCOUNT',
        leadingIcon: <TrashIcon />,
        loading: isDeleteUserPending,
        onPress: () =>
          Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: handleDeleteAccount },
          ]),
      });
    }

    return data;
  }, [logout, logoutGuest, isLogoutPending, isDeleteUserPending, handleDeleteAccount, userIsGuest]);

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
        <SettingsCard
          disabled={userIsGuest}
          title="PERSONAL INFORMATION"
          data={personalInformationData}
        />

        <SettingsCard data={appSettingsData} />

        <View style={styles.footerContainer}>
          <Text size={theme.typography.fontSizes.sm} weight="medium">
            Version {Constants.expoConfig?.version}
          </Text>
        </View>
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
    paddingTop: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing.lg,
  },
  footerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default AccountPage;
