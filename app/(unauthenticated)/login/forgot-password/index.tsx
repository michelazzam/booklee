import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet, Keyboard } from 'react-native';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { AuthServices } from '~/src/services';

import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { AwareScrollView, HeaderNavigation, Text } from '~/src/components/base';
import { Input } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';
import { Toast } from 'toastify-react-native';

const emailSchema = z.email('Please enter a valid email address').min(1, 'Email is required');

const ForgotPasswordEmailInput = () => {
  /*** States ***/
  const [email, setEmail] = useState('');
  const [validationErrors, setValidationErrors] = useState('');

  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();
  const { email: fromLoginEmail } = useLocalSearchParams<{ email: string }>();
  const { mutate: forgotPassword, isPending: isForgotPasswordPending } =
    AuthServices.useForgotPassword();

  useEffect(() => {
    if (fromLoginEmail) {
      setEmail(fromLoginEmail);
    }
  }, [fromLoginEmail]);

  /*** Handlers ***/
  const handleContinue = () => {
    Keyboard.dismiss();
    const validationResult = emailSchema.safeParse(email);

    if (!validationResult.success) {
      setValidationErrors(validationResult.error.issues[0].message);
      return;
    }

    forgotPassword(email, {
      onSuccess: () => {
        router.replace({
          pathname: '/(unauthenticated)/login/forgot-password/success',
          params: { email },
        });
      },
      onError: (error: any) => {
        Toast.error(error?.message || 'Failed to send verification code');
      },
    });
  };

  return (
    <>
      <HeaderNavigation title="FORGOT PASSWORD" />

      <AwareScrollView contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
        <Text size={80} weight="bold" style={{ textAlign: 'center' }}>
          🔐
        </Text>

        <View style={styles.textContainer}>
          <Text size={28} weight="semiBold" color={theme.colors.darkText[100]}>
            Reset Your Password
          </Text>

          <Text
            size={16}
            weight="regular"
            color={theme.colors.lightText}
            style={{ textAlign: 'center' }}>
            Enter the email address you used to create your account. We&apos;ll send you a
            verification code to reset your password.
          </Text>
        </View>

        <Input
          value={email}
          variant="email"
          label="Email Address*"
          error={validationErrors}
          placeholder="Enter your email address"
          onChangeText={(text) => setEmail(text)}
        />

        <View style={styles.buttonContainer}>
          <Button
            onPress={handleContinue}
            title="Send Verification Code"
            isLoading={isForgotPasswordPending}
            disabled={!email.trim() || isForgotPasswordPending}
          />
        </View>
      </AwareScrollView>
    </>
  );
};

export default ForgotPasswordEmailInput;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing['2xl'],
  },
  textContainer: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing['2xl'],
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
