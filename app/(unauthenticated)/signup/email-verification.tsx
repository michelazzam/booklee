import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { theme } from '~/src/constants/theme';

import { Button } from '~/src/components/buttons';
import { Text } from '~/src/components/base';

const EmailVerificationPage = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text size={150} weight="bold" style={{ textAlign: 'center' }}>
        📧
      </Text>

      <Text size={24} weight="semiBold" style={{ textAlign: 'center' }}>
        Check Your Email
      </Text>

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
      </View>

      <Button
        title="Back to Login"
        onPress={() => router.back()}
        containerStyle={styles.buttonContainer}
      />
    </View>
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
