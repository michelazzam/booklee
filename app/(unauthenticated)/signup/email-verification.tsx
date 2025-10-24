import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useState } from 'react';

import { AuthServices } from '~/src/services';

import { useTimer } from '~/src/hooks/useTimer';
import { theme } from '~/src/constants/theme';

import { CodeInputs } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';
import { AwareScrollView, Text } from '~/src/components/base';

type LocalSearchParamsType = {
  email: string;
};

const EmailVerificationPage = () => {
  /*** States ***/
  const [hasOtpError, setHasOtpError] = useState(false);

  /*** Constants ***/
  const router = useRouter();
  const { email } = useLocalSearchParams<LocalSearchParamsType>();
  const { mutate: verifyEmailOtp } = AuthServices.useVerifyEmailOtp();
  const { resendEmailTimerSeconds, formattedResendEmailTimer, resetTimer } = useTimer({
    tokenExpiryMinutes: 10,
    resendEmailMinutes: 10,
  });
  const { mutate: resendEmailVerification, isPending: isResendEmailVerificationPending } =
    AuthServices.useResendEmailVerification();

  const handleOtpComplete = (code: string) => {
    if (code.length === 6) {
      verifyEmailOtp(
        { email, otp: code },
        {
          onError: () => {
            setHasOtpError(true);
          },
        }
      );
    } else {
      setHasOtpError(true);
    }
  };
  const handleResendEmailVerification = () => {
    resendEmailVerification(email, {
      onSuccess: () => {
        resetTimer();
      },
      onError: () => {
        Toast.error('Failed to resend email verification');
      },
    });
  };

  // useEffect(() => {
  //   sendEmailOtpVerification(email);

  //   //eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <AwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerSection}>
        <Text size={150} weight="bold" style={{ textAlign: 'center' }}>
          📧
        </Text>

        <View style={{ gap: theme.spacing.sm }}>
          <Text size={24} weight="semiBold" style={{ textAlign: 'center' }}>
            Check Your Email
          </Text>

          <Text
            size={16}
            weight="regular"
            color={theme.colors.lightText}
            style={{ textAlign: 'center' }}>
            We&apos;ve sent a verification code to
          </Text>

          <Text
            size={16}
            weight="semiBold"
            style={{ textAlign: 'center' }}
            color={theme.colors.primaryBlue[100]}>
            {email || 'clasroman1@gmail.com'}
          </Text>
        </View>
      </View>

      <View style={styles.otpSection}>
        <Text
          size={16}
          weight="regular"
          color={theme.colors.lightText}
          style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
          Enter the 6-digit code below
        </Text>

        <CodeInputs
          length={6}
          onComplete={handleOtpComplete}
          onError={(hasError) => setHasOtpError(hasError)}
          color={hasOtpError ? theme.colors.red[100] : theme.colors.primaryBlue[100]}
        />
      </View>

      <View style={styles.resendSection}>
        <Button
          variant="outline"
          onPress={handleResendEmailVerification}
          isLoading={isResendEmailVerificationPending}
          disabled={isResendEmailVerificationPending || resendEmailTimerSeconds > 0}
          title={
            resendEmailTimerSeconds > 0
              ? `Resend Email in ${formattedResendEmailTimer}`
              : 'Resend Email'
          }
        />

        <Button title="Back to Login" onPress={() => router.back()} variant="ghost" />
      </View>
    </AwareScrollView>
  );
};

export default EmailVerificationPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: theme.spacing['3xl'],
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpSection: {
    flex: 1,
    gap: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  resendSection: {
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.lg,
  },
});
