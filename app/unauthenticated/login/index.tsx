import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomText } from '~/components/CustomText';
import {
  AppTitle,
  LoginTabs,
  LoginInputs,
  SocialLogin,
  AuthBackground,
} from '../../../components/auth/login';
import { theme } from '~/theme/Main';
import { useRouter } from 'expo-router';
import { Wrapper } from '~/components/UI';

export default function SignInPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);

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
            onPress={() => router.push('/authenticated/(tabs)')}>
            <CustomText variant="bodyPrimaryBold" style={styles.nextButtonText}>
              Next
            </CustomText>
          </TouchableOpacity>

          {/* Social Login */}
          <SocialLogin />

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <CustomText variant="bodyPrimaryRegular" style={styles.signUpText}>
              Don't have an account?{' '}
            </CustomText>
            <TouchableOpacity onPress={() => router.push('/unauthenticated/signup')}>
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
