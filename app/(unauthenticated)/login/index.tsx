import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { theme } from '~/src/constants/theme';

import {
  AuthBackground,
  LoginInputs,
  SocialLogin,
  LoginTabs,
  AppTitle,
} from '~/src/components/utils/auth/login';
import { AwareScrollView } from '~/src/components/base';
import CustomText from '~/src/components/base/text';
import { Button } from '~/src/components/buttons';

const SignInPage = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

  return (
    <AuthBackground>
      <AwareScrollView contentContainerStyle={styles.container}>
        <AppTitle />

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <CustomText size={22} weight="semiBold" style={styles.formTitle}>
              Log In
            </CustomText>

            <LoginTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </View>

          <LoginInputs activeTab={activeTab} />

          <Button
            title="Next"
            isLoading={false}
            onPress={() => {
              router.navigate('/(authenticated)/(tabs)');
            }}
            containerStyle={styles.nextButton}
          />

          <SocialLogin />

          <View style={styles.signUpContainer}>
            <CustomText size={14} weight="regular" style={styles.signUpText}>
              Don&apos;t have an account?{' '}
            </CustomText>

            <TouchableOpacity onPress={() => router.navigate('/(unauthenticated)/signup')}>
              <CustomText size={14} weight="semiBold" style={styles.signUpLink}>
                Sign Up
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </AwareScrollView>
    </AuthBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
    flexGrow: 1,
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
    marginBottom: theme.spacing.xl,
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
    color: theme.colors.darkText[100],
    textDecorationLine: 'underline',
  },
});

export default SignInPage;
