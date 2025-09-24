import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';

import { theme } from '~/src/constants/theme';
import {
  ChevronRightIcon,
  QuestionMarkIcon,
  UserInfoIcon,
  EnvelopeIcon,
  LogoutIcon,
  PhoneIcon,
  TrashIcon,
  GearIcon,
  HomeIcon,
  BellIcon,
} from '~/src/assets/icons';

import { AuthServices, UserServices } from '~/src/services';

import { SettingsCard, ScreenHeader, type CardRowDataType } from '~/src/components/utils';
import { AwareScrollView, Text } from '~/src/components/base';

const AccountPage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { data: userData } = UserServices.useGetMe();
  const { mutate: logout, isPending: isLogoutPending } = AuthServices.useLogout();
  const { mutate: deleteUser, isPending: isDeleteUserPending } = UserServices.useDeleteUser();

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
        label: userData?.user?.phone || 'No phone number',
        leadingIcon: <PhoneIcon />,
        trailingIcon: <ChevronRightIcon />,
      },
    ];
  }, [userData, router]);
  const openBusinessData: CardRowDataType[] = useMemo(() => {
    return [
      {
        label: 'Settings',
        leadingIcon: <GearIcon />,
        trailingIcon: <ChevronRightIcon />,
      },
      {
        label: 'Users help center',
        leadingIcon: <QuestionMarkIcon />,
        trailingIcon: <ChevronRightIcon />,
      },
    ];
  }, []);
  const appSettingsData: CardRowDataType[] = useMemo(() => {
    return [
      {
        variant: 'secondary',
        label: 'OPEN A BUSINESS',
        leadingIcon: <HomeIcon />,
        trailingIcon: <ChevronRightIcon />,
      },
      {
        onPress: logout,
        label: 'LOG OUT',
        loading: isLogoutPending,
        leadingIcon: <LogoutIcon />,
      },
      {
        variant: 'danger',
        onPress: deleteUser,
        label: 'DELETE ACCOUNT',
        leadingIcon: <TrashIcon />,
        loading: isDeleteUserPending,
      },
    ];
  }, [logout, deleteUser, isLogoutPending, isDeleteUserPending]);

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

        <SettingsCard data={openBusinessData} title="SETTINGS" />

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
    paddingVertical: theme.spacing['2xl'],
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
