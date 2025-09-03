import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { theme } from '~/src/constants/theme';

import { CustomText } from '~/src/components/utils/CustomText';
import { Wrapper } from '~/src/components/utils/UI';
import {
  AuthBackground,
  LoginInputs,
  SocialLogin,
  LoginTabs,
  AppTitle,
} from '~/src/components/utils/auth/login';

export default function SignInPage() {
  /*** Constants ***/
  const router = useRouter();

  /*** States ***/
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

  return (
    <AuthBackground>
      <Wrapper style={styles.container}>
        {/* App Title */}
        <AppTitle />

        {/* Login Form Card */}
        <View style={styles.formCard}>
          {/* Form Header */}
          <View style={styles.formHeader}>
            <CustomText variant="headline" style={styles.formTitle}>
              Log In
            </CustomText>

            {/* Tabs */}
            <LoginTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </View>

          {/* Input Fields */}
          <LoginInputs
            activeTab={activeTab}
            showPassword={showPassword}
            onPasswordToggle={() => setShowPassword(!showPassword)}
          />

          {/* Next Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
              router.navigate('/(authenticated)/(tabs)');
            }}>
            <CustomText variant="bodyPrimaryBold" style={styles.nextButtonText}>
              Next
            </CustomText>
          </TouchableOpacity>

          {/* Social Login */}
          <SocialLogin />

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <CustomText variant="bodyPrimaryRegular" style={styles.signUpText}>
              Don&apos;t have an account?{' '}
            </CustomText>

            <TouchableOpacity onPress={() => router.navigate('/(unauthenticated)/signup')}>
              <CustomText variant="bodyPrimaryHyperlink" style={styles.signUpLink}>
                Sign Up
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Wrapper>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
  },

  formCard: {
    backgroundColor: theme.colors.white.DEFAULT,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
  },
  formHeader: {
    marginBottom: theme.spacing.xl,
  },
  formTitle: {
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.lg,
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.darkText[100],
    borderRadius: theme.radii.sm,
    padding: theme.spacing.md,
    ...(theme.shadows.soft as any),
    marginBottom: theme.spacing.xl,
  },
  nextButtonText: {
    color: theme.colors.white.DEFAULT,
  },

  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: theme.colors.lightText,
  },
  signUpLink: {
    color: theme.colors.primaryBlue[100],
  },
});
