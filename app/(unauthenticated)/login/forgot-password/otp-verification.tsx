import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import CustomText from '~/src/components/base/text';
import { theme } from '~/src/constants/theme';
import { ArrowLeftIcon } from '~/src/assets/icons';
import { AwareScrollView } from '~/src/components/base';
import { CodeInputs } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';
import { Wrapper } from '~/src/components/utils/UI';

export default function ForgotPasswordOTPVerification() {
  const router = useRouter();
  const { method, contact } = useLocalSearchParams<{ method: string; contact: string }>();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOTPComplete = (code: string) => {
    setOtp(code);
  };

  const handleVerify = async () => {
    if (otp.length === 6) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        router.push({
          pathname: '/(unauthenticated)/login/forgot-password/new-password',
          params: { method, contact, otp },
        });
      }, 1000);
    }
  };

  const handleResend = () => {
    // Handle resend logic here
    console.log('Resending OTP to:', contact);
  };

  const getContactDisplay = () => {
    if (method === 'email') {
      return contact;
    } else {
      // Format phone number for display
      return contact?.replace(/(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3');
    }
  };

  return (
    <Wrapper style={styles.container} withBottom={true}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon color={theme.colors.darkText[100]} />
        </TouchableOpacity>
        <CustomText size={16} weight="medium">
          VERIFY CODE
        </CustomText>
        <View style={styles.spacer} />
      </View>

      <AwareScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleContainer}>
          <CustomText size={22} weight="semiBold" style={styles.title}>
            Enter Verification Code
          </CustomText>
          <CustomText size={14} weight="regular" style={styles.subtitle}>
            We&apos;ve sent a 6-digit code to {getContactDisplay()}
          </CustomText>
        </View>

        <View style={styles.otpContainer}>
          <CodeInputs
            length={6}
            onComplete={handleOTPComplete}
            color={theme.colors.primaryBlue[100]}
          />
        </View>

        <View style={styles.resendContainer}>
          <CustomText size={14} weight="regular" style={styles.resendText}>
            Didn&apos;t receive the code?
          </CustomText>
          <TouchableOpacity onPress={handleResend}>
            <CustomText size={14} weight="semiBold" style={styles.resendLink}>
              Resend Code
            </CustomText>
          </TouchableOpacity>
        </View>
      </AwareScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Verify Code"
          onPress={handleVerify}
          disabled={otp.length !== 6}
          isLoading={isLoading}
        />
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  spacer: {
    width: 40,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
  },
  titleContainer: {
    marginBottom: theme.spacing['3xl'],
    alignItems: 'center',
  },
  title: {
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.lightText,
    lineHeight: 20,
    textAlign: 'center',
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  resendText: {
    color: theme.colors.lightText,
  },
  resendLink: {
    color: theme.colors.primaryBlue[100],
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
});
