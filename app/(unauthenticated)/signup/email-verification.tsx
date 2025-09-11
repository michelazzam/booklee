import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '~/src/constants/theme';
import { Text } from '~/src/components/base';
import { Button } from '~/src/components/buttons';
import { Wrapper } from '~/src/components/utils/UI';

const EmailVerificationPage = () => {
  const router = useRouter();

  const handleBackToLogin = () => {
    router.navigate('/(unauthenticated)/login');
  };

  return (
    <Wrapper style={styles.container} withBottom={true}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text size={48} weight="bold" style={styles.icon}>
            📧
          </Text>
        </View>

        <Text size={24} weight="semiBold" style={styles.title}>
          Check Your Email
        </Text>

        <Text size={16} weight="regular" style={styles.description}>
          We've sent you a verification link at your email address. Please check your inbox and
          click the link to verify your account.
        </Text>

        <Text size={14} weight="regular" style={styles.note}>
          Don't see the email? Check your spam folder or try again.
        </Text>

        <View style={styles.buttonContainer}>
          <Button title="Back to Login" onPress={handleBackToLogin} />
        </View>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '20%',
    paddingHorizontal: theme.spacing.xl,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  icon: {
    textAlign: 'center',
  },
  title: {
    color: theme.colors.darkText[100],
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  description: {
    color: theme.colors.lightText,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  note: {
    color: theme.colors.lightText,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
});

export default EmailVerificationPage;
