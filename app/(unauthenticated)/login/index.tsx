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

//Abbas TODO: Please clean the file from the comments it feels AI generated
//Abbas TODO: Start using arrow functions to define your functions since it's a more modern approach of writing code
//Abbas TODO: Fix the card placement to be centered in the middle of the screen
//Abbas TODO: There are a lot of custom components created for the login even tho they are only used here. Always remember abstraction === re-usability. If the component is not complex or is gonna be re-usable keep it in the same file.
//Abbas TODO: Forgot password button is not doing anything. It should navigate to the forgot password page.
export default function SignInPage() {
  /*** Constants ***/
  const router = useRouter();

  /*** States ***/
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

  return (
    <AuthBackground>
      <View style={styles.container}>
        {/* App Title */}
        <AppTitle />

        {/* Login Form Card */}
        <AwareScrollView contentContainerStyle={styles.formCard}>
          {/* Form Header */}
          <View style={styles.formHeader}>
            <CustomText size={22} weight="semiBold" style={styles.formTitle}>
              Log In
            </CustomText>

            {/* Tabs */}
            <LoginTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </View>

          {/* Input Fields */}
          <LoginInputs activeTab={activeTab} />

          {/* Next Button */}
          <Button
            title="Next"
            isLoading={false}
            onPress={() => {
              router.navigate('/(authenticated)/(tabs)');
            }}
            containerStyle={styles.nextButton}
          />

          {/* Social Login */}
          <SocialLogin />

          {/* Sign Up Link */}
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
        </AwareScrollView>
      </View>
    </AuthBackground>
  );
}

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
