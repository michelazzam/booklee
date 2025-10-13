import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Toast } from 'toastify-react-native';

import { useAppSafeAreaInsets, useTimer } from '~/src/hooks';
import { theme } from '~/src/constants/theme';
import { AuthServices } from '~/src/services';

import { Button } from '~/src/components/buttons';
import { Text } from '~/src/components/base';

const ForgotPasswordSuccess = () => {
  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();
  const { resendEmailTimer, resetTimer } = useTimer(0, 60);
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { mutate: resendEmail, isPending: isResending } = AuthServices.useForgotPassword();

  const handleResendEmail = () => {
    if (!email || resendEmailTimer > 0 || isResending) return;

    resendEmail(email, {
      onSuccess: () => {
        resetTimer();
        Toast.success('Password reset email sent successfully!');
      },
      onError: (error: any) => {
        Toast.error(error?.message || 'Failed to resend email');
      },
    });
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <View style={styles.content}>
        <Text size={150} weight="bold" style={{ textAlign: 'center' }}>
          📧
        </Text>

        <View style={styles.textContainer}>
          <Text size={24} weight="semiBold" style={{ textAlign: 'center' }}>
            Check Your Email
          </Text>

          {email && (
            <Text
              size={14}
              weight="regular"
              color={theme.colors.lightText}
              style={{ textAlign: 'center' }}>
              {email}
            </Text>
          )}
        </View>

        <View style={styles.descriptionContainer}>
          <Text
            size={16}
            weight="regular"
            color={theme.colors.lightText}
            style={{ textAlign: 'center', lineHeight: 24 }}>
            We&apos;ve sent you an email with a link to reset your password. Please check your inbox
            and click the link to create a new password.
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Return to Login" onPress={() => router.back()} />
        <View style={styles.resendContainer}>
          <Text size={14} weight="regular" color={theme.colors.lightText}>
            Didn&apos;t receive the email?
          </Text>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendEmail}
            disabled={resendEmailTimer > 0 || isResending}>
            <Text
              size={14}
              weight="semiBold"
              color={
                resendEmailTimer > 0 || isResending
                  ? theme.colors.grey[100]
                  : theme.colors.primaryBlue[100]
              }>
              {resendEmailTimer > 0
                ? `Resend in ${resendEmailTimer}s`
                : isResending
                  ? 'Sending...'
                  : 'Resend Email'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgotPasswordSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing['2xl'],
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  descriptionContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.xs,
  },
  resendButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
});
