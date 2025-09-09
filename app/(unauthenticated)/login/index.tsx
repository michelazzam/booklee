import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { theme } from '~/src/constants/theme';

import { AwareScrollView, Text } from '~/src/components/base';
import { Button } from '~/src/components/buttons';
import {
  AuthBackground,
  LoginInputs,
  SocialLogin,
  LoginTabs,
  AppTitle,
} from '~/src/components/utils/auth/login';

const SignInPage = () => {
  /*** Constants ***/
  const router = useRouter();

  /*** States ***/
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

  return (
    <AuthBackground>
      <View style={styles.container}>
        <AppTitle />

        <AwareScrollView contentContainerStyle={styles.formCard}>
          <View style={styles.formHeader}>
            <Text size={22} weight="semiBold" style={styles.formTitle}>
              Log In
            </Text>

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
            <Text size={14} weight="regular" style={styles.signUpText}>
              Don&apos;t have an account?{' '}
            </Text>

            <TouchableOpacity onPress={() => router.navigate('/(unauthenticated)/signup')}>
              <Text size={14} weight="semiBold" style={styles.signUpLink}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </AwareScrollView>
      </View>
    </AuthBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: '30%',
    paddingHorizontal: theme.spacing.xl,
  },
  formCard: {
    padding: theme.spacing.xl,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.white.DEFAULT,
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
