import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useEffect, useState } from 'react';

import { AuthServices } from '~/src/services';
import { useNotification } from '~/src/store';

import { theme } from '~/src/constants/theme';

import { AwareScrollView, Text } from '~/src/components/base';
import { CodeInputs } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';

type LocalSearchParamsType = {
  email: string;
  fromLogin: string;
};

const EmailVerificationPage = () => {
  /*** States ***/
  const [hasOtpError, setHasOtpError] = useState(false);

  /*** Constants ***/
  const router = useRouter();
  const { fcmToken } = useNotification();
  const { email } = useLocalSearchParams<LocalSearchParamsType>();
  const { mutate: verifyEmailOtp } = AuthServices.useVerifyEmailOtp();
  const { mutate: addDeviceToken } = AuthServices.useAddDeviceToken();
  const { mutate: sendEmailVerificationOtp } = AuthServices.useSendEmailVerificationOtp();

  const handleOtpComplete = (code: string) => {
    if (code.length === 6) {
      verifyEmailOtp(
        { email, otp: code },
        {
          onSuccess: () => {
            router.replace('/(authenticated)/(tabs)');
            if (fcmToken) {
              addDeviceToken({
                token: fcmToken,
                platform: Platform.OS as 'ios' | 'android',
              });
            }
          },
          onError: (error) => {
            setHasOtpError(true);
            Toast.error(error.message || 'Invalid verification code');
          },
        }
      );
    } else {
      setHasOtpError(true);
    }
  };

  useEffect(() => {
    sendEmailVerificationOtp(email, {
      onError: (error) => {
        Toast.error(error.message || 'Failed to send email verification OTP');

        setTimeout(() => {
          router.back();
        }, 2000);
      },
    });

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AwareScrollView contentContainerStyle={styles.container}>
      <Text size={150} weight="bold" style={{ textAlign: 'center' }}>
        📧
      </Text>

      <View style={{ gap: theme.spacing.sm }}>
        <Text size={24} weight="semiBold" style={{ textAlign: 'center' }}>
          Check Your Email
        </Text>

        <Text size={14} weight="regular" style={{ textAlign: 'center' }}>
          {email}
        </Text>
      </View>

      <View style={styles.descriptionContainer}>
        <Text
          size={16}
          weight="regular"
          color={theme.colors.lightText}
          style={{ textAlign: 'center' }}>
          We&apos;ve sent you a verification link at your email address. Please check your inbox and
          click the link to verify your account.
        </Text>

        <Text
          size={14}
          weight="regular"
          color={theme.colors.lightText}
          style={{ textAlign: 'center' }}>
          Don&apos;t see the email? Check your spam folder or try again.
        </Text>

        <CodeInputs
          length={6}
          onComplete={handleOtpComplete}
          onError={(hasError) => setHasOtpError(hasError)}
          color={hasOtpError ? theme.colors.red[100] : theme.colors.primaryBlue[100]}
        />
      </View>

      <View>
        {/* <Button
          variant="outline"
          onPress={handleResendEmailVerification}
          isLoading={isResendEmailVerificationPending}
          disabled={isResendEmailVerificationPending || resendEmailTimerSeconds > 0}
          title={
            resendEmailTimerSeconds > 0
              ? `Resend Email in ${formattedResendEmailTimer}`
              : 'Resend Email'
          }
        /> */}

        <Button title="Back to Login" onPress={() => router.back()} variant="ghost" />
      </View>
    </AwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.spacing.lg,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  descriptionContainer: {
    alignItems: 'center',
    gap: theme.spacing.xl,
  },
  buttonContainer: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
  },
});

export default EmailVerificationPage;
