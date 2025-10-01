import { View, StyleSheet, TouchableOpacity, Switch } from 'react-native';
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
import { useUserProvider } from '~/src/store';

const AccountPage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { data: userData } = UserServices.useGetMe();
  const { mutate: logout } = AuthServices.useLogout();
  const { isBusinessMode, setBusinessMode } = useUserProvider();

  const isOwner = userData?.user?.role === 'owner';

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
        leadingIcon: <LogoutIcon />,
      },
      {
        variant: 'danger',
        label: 'DELETE ACCOUNT',
        leadingIcon: <TrashIcon />,
      },
    ];
  }, [logout]);

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
        {isOwner && (
          <View style={styles.businessModeContainer}>
            <Text
              weight="semiBold"
              color={theme.colors.darkText[100]}
              size={theme.typography.fontSizes.sm}
              style={{ letterSpacing: 1 }}>
              SWITCH TO BUSINESS ACCOUNT
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
