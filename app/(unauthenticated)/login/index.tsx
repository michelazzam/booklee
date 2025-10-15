import { View, StyleSheet, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Toast } from 'toastify-react-native';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';

import { AuthServices, type LoginReqType } from '~/src/services';

import { type ValidationResultType, validateLogin } from '~/src/helper/validation';
import { theme } from '~/src/constants/theme';

import { AwareScrollView, Text } from '~/src/components/base';
import { Input } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';

const LoginScreen = () => {
  /***** Refs *****/
  const data = useRef<LoginReqType>({
    email: '',
    password: '',
  });

  /*** Constants ***/
  const router = useRouter();
  const { user: authUser } = AuthServices.useGetBetterAuthUser();
  const { data: userData, isLoading: isUserLoading } = AuthServices.useGetMe();
  const { mutate: login, isPending: isLoginPending } = AuthServices.useLogin();
  const { mutate: googleLogin, isPending: isGoogleLoginPending } = AuthServices.useGoogleLogin();

  /*** States ***/
  const [validationErrors, setValidationErrors] = useState<ValidationResultType<LoginReqType>>({
    success: false,
  });

  useEffect(() => {
    if (!userData || !authUser || isUserLoading) {
      return;
    }

    if (authUser.emailVerified) {
      router.replace('/(authenticated)/(tabs)');
    }
  }, [isUserLoading, userData, authUser, router]);

  const onTextChange = (text: string, field: keyof LoginReqType) => {
    data.current[field] = text;

    setValidationErrors((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: undefined },
    }));
  };
  const handleLogin = async () => {
    Keyboard.dismiss();
    setValidationErrors({ success: true });

    const { success, errors } = await validateLogin(data.current);

    if (!success) {
      setValidationErrors({ success: false, errors: errors || {} });
      return;
    }

    login(data.current, {
      onError: (error) => {
        // @ts-expect-error
        if (error?.code === 'EMAIL_NOT_VERIFIED') {
          router.navigate({
            pathname: '/(unauthenticated)/signup/email-verification',
            params: {
              fromLogin: 'true',
              email: data.current.email,
            },
          });
        } else {
          Toast.error(error.message || 'Failed to login');
        }
      },
    });
  };

  return (
    <LinearGradient
      style={styles.container}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      colors={[theme.colors.primaryBlue[100], theme.colors.darkText[100]]}>
      <Text
        size={28}
        weight="black"
        style={{ textAlign: 'center' }}
        color={theme.colors.white.DEFAULT}>
        Booklee
      </Text>

      <AwareScrollView contentContainerStyle={styles.formCard}>
        <Text size={28} weight="semiBold">
          Log In
        </Text>

        <View style={{ gap: 62 }}>
          <View style={{ gap: theme.spacing.xl }}>
            <Input
              label="Email"
              variant="email"
              keyboardType="email-address"
              placeholder="Enter your email"
              error={validationErrors.errors?.email}
              onChangeText={(value) => onTextChange(value, 'email')}
            />

            <Input
              label="Password"
              variant="password"
              placeholder="Enter your password"
              error={validationErrors.errors?.password}
              onChangeText={(value) => onTextChange(value, 'password')}
              subText={{
                label: 'Forgot Password',
                action: () =>
                  router.navigate({
                    params: { email: data.current.email },
                    pathname: '/(unauthenticated)/login/forgot-password',
                  }),
              }}
            />

            <Button
              title="Next"
              onPress={handleLogin}
              disabled={isLoginPending}
              isLoading={isLoginPending}
            />
          </View>

          <View style={{ gap: theme.spacing.lg }}>
            <View style={styles.separator}>
              <View style={styles.separatorLine} />

              <Text size={14} weight="regular">
                Or sign in with
              </Text>

              <View style={styles.separatorLine} />
            </View>

            <Button
              variant="outline"
              leadingIcon="google"
              onPress={googleLogin}
              title="Continue With Google"
              isLoading={isGoogleLoginPending}
            />
          </View>
        </View>

        <View style={styles.signUpContainer}>
          <Text size={14} weight="regular">
            Don&apos;t have an account?{' '}
          </Text>

          <Text
            size={14}
            weight="semiBold"
            color={theme.colors.darkText[100]}
            style={{ textDecorationLine: 'underline' }}
            onPress={() => router.navigate('/(unauthenticated)/signup')}>
            Sign Up
          </Text>
        </View>
      </AwareScrollView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '30%',
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  formCard: {
    gap: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
