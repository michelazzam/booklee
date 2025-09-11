import { View, Text, StyleSheet, Alert } from 'react-native';
import { AwareScrollView } from '~/src/components/base';
import {
  AccountHeader,
  AccountCard,
  AccountRow,
  AccountButton,
} from '~/src/components/utils/account';
import {
  UserInfoIcon,
  EnvelopeIcon,
  PhoneIcon,
  GearIcon,
  QuestionMarkIcon,
  LogoutIcon,
  TrashIcon,
  HomeIcon,
} from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';

const AccountPage = () => {
  const handleNotificationPress = () => {
    // Handle notification press
    console.log('Notification pressed');
  };

  const handleNamePress = () => {
    // Handle name edit
    console.log('Name pressed');
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

  const handleLogoutPress = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => console.log('Logout confirmed') },
    ]);
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
          <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
          <AccountCard>
            <AccountRow icon={UserInfoIcon} title="Samir Abi Frem" onPress={handleNamePress} />
            <View style={styles.divider} />
            <AccountRow
              icon={EnvelopeIcon}
              title="samirabifrem@gmail.com"
              badge="not verified"
              badgeVerified={false}
              onPress={handleEmailPress}
            />
            <View style={styles.divider} />
            <AccountRow icon={PhoneIcon} title="+961 123 456" onPress={handlePhonePress} />
          </AccountCard>
        </View>

        {/* Settings and Help Section */}
        <AccountCard>
          <AccountRow icon={GearIcon} title="SETTINGS" onPress={handleSettingsPress} />
          <View style={styles.divider} />
          <AccountRow icon={QuestionMarkIcon} title="USERS HELP CENTER" onPress={handleHelpPress} />
        </AccountCard>

        {/* Open Business Button */}
        <AccountButton
          icon={HomeIcon}
          title="OPEN A BUSINESS"
          variant="primary"
          showChevron={true}
          onPress={handleOpenBusinessPress}
        />

        {/* Log Out Button */}
        <AccountButton
          icon={LogoutIcon}
          title="LOG OUT"
          variant="secondary"
          onPress={handleLogoutPress}
        />

        {/* Delete Account Button */}
        <AccountButton
          icon={TrashIcon}
          title="DELETE ACCOUNT"
          variant="danger"
          showChevron={true}
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
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.textVariants.ctaSecondaryBold,
    color: theme.colors.darkText[100],
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
});

export default AccountPage;
