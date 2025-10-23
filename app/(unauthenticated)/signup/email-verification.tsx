import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

import { AuthServices } from '~/src/services';

import { useTimer } from '~/src/hooks/useTimer';
import { theme } from '~/src/constants/theme';

import { CodeInputs } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';
import { AwareScrollView, Text } from '~/src/components/base';

type LocalSearchParamsType = {
  email: string;
  fromLogin: string;
};

const EmailVerificationPage = () => {
  /*** States ***/
  const [otpCode, setOtpCode] = useState('');
  const [hasOtpError, setHasOtpError] = useState(false);

  /*** Constants ***/
  const router = useRouter();
  const { formattedTokenExpiry, resendEmailTimer, resetTimer } = useTimer(10, 10);
  const { email, fromLogin } = useLocalSearchParams<LocalSearchParamsType>();
  const { mutate: resendEmailVerification, isPending: isResendEmailVerificationPending } =
    AuthServices.useResendEmailVerification();

  const handleOtpComplete = (code: string) => {
    setOtpCode(code);
    // TODO: Implement OTP verification logic
    console.log('OTP Code:', code);
  };
  const handleOtpError = (hasError: boolean) => {
    setHasOtpError(hasError);
  };

  useEffect(() => {
    if (Boolean(fromLogin)) {
      resendEmailVerification(email, {
        onSuccess: () => {
          resetTimer();
        },
      });
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          onError={handleOtpError}
          onComplete={handleOtpComplete}
          color={hasOtpError ? theme.colors.red[100] : theme.colors.primaryBlue[100]}
        />
      </View>

      <View style={styles.resendSection}>
        <Button
          variant="outline"
          isLoading={isResendEmailVerificationPending}
          onPress={() => resendEmailVerification(email)}
          disabled={isResendEmailVerificationPending || resendEmailTimer > 0}
          title={resendEmailTimer > 0 ? `Resend Email in ${formattedTokenExpiry}` : 'Resend Email'}
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
