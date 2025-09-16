import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AwareScrollView } from '~/src/components/base';

import { theme } from '~/src/constants/theme';
import {
  QuestionMarkIcon,
  UserInfoIcon,
  EnvelopeIcon,
  LogoutIcon,
  PhoneIcon,
  TrashIcon,
  GearIcon,
  HomeIcon,
} from '~/src/assets/icons';

import { AuthServices, UserServices } from '~/src/services';

import {
  AccountButton,
  AccountHeader,
  AccountCard,
  AccountRow,
} from '~/src/components/utils/account';

const AccountPage = () => {
  /*** Constants ***/
  const router = useRouter();
  const { mutate: logout } = AuthServices.useLogout();
  const { user } = UserServices.useGetUser();

  const handleNotificationPress = () => {
    // Handle notification press
    console.log('Notification pressed');
  };
  const handleNamePress = () => {
    // Navigate to edit personal info page
    router.push('/(authenticated)/(tabs)/account/edit-personal-info');
  };
  const handleEmailPress = () => {
    // Handle email edit
    console.log('Email pressed');
  };
  const handlePhonePress = () => {
    // Handle phone edit
    console.log('Phone pressed');
  };
  const handleSettingsPress = () => {
    // Handle settings
    console.log('Settings pressed');
  };
  const handleHelpPress = () => {
    // Handle help center
    console.log('Help pressed');
  };
  const handleOpenBusinessPress = () => {
    // Handle open business
    console.log('Open business pressed');
  };
  const handleDeleteAccountPress = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Delete account confirmed'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AccountHeader onNotificationPress={handleNotificationPress} />

      <AwareScrollView contentContainerStyle={styles.scrollContent}>
        {/* Personal Information Section */}
        <View style={styles.section}>
          <AccountCard>
            <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
            <AccountRow
              icon={UserInfoIcon}
              title={
                user?.name || (user?.firstName && user?.lastName)
                  ? `${user.firstName} ${user.lastName}`
                  : 'Loading...'
              }
              onPress={handleNamePress}
            />
            <View style={styles.divider} />
            <AccountRow
              icon={EnvelopeIcon}
              title={user?.email || 'Loading...'}
              badge={user?.email ? 'verified' : 'not verified'}
              badgeVerified={!!user?.email}
              onPress={handleEmailPress}
            />
            <View style={styles.divider} />
            <AccountRow
              icon={PhoneIcon}
              title={user?.phone || 'No phone number'}
              onPress={handlePhonePress}
            />
          </AccountCard>
        </View>

        {/* Settings and Help Section */}
        <AccountCard style={styles.section}>
          <AccountRow icon={GearIcon} title="SETTINGS" onPress={handleSettingsPress} />
          <View style={styles.divider} />
          <AccountRow icon={QuestionMarkIcon} title="USERS HELP CENTER" onPress={handleHelpPress} />
        </AccountCard>

        {/* Open Business Button */}
        <AccountButton
          icon={HomeIcon}
          variant="primary"
          showChevron={true}
          title="OPEN A BUSINESS"
          onPress={handleOpenBusinessPress}
        />
        <View style={{ marginVertical: theme.spacing.xs }} />
        <AccountButton icon={LogoutIcon} title="LOG OUT" variant="secondary" onPress={logout} />

        <View style={{ marginVertical: theme.spacing.xs }} />
        <AccountButton
          variant="danger"
          icon={TrashIcon}
          showChevron={true}
          title="DELETE ACCOUNT"
          onPress={handleDeleteAccountPress}
        />
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
    paddingVertical: theme.spacing['2xl'],
    flexGrow: 1,
  },
  section: {
    marginBottom: theme.spacing.xl,
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
