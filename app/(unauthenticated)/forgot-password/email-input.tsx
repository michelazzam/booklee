import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import CustomText from '~/src/components/base/text';
import { theme } from '~/src/constants/theme';
import { ArrowLeftIcon } from '~/src/assets/icons';
import { AwareScrollView } from '~/src/components/base';
import { Input } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';
import { Wrapper } from '~/src/components/utils/UI';

export default function ForgotPasswordEmailInput() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    if (email.trim()) {
      router.push({
        pathname: '/(unauthenticated)/forgot-password/otp-verification',
        params: { method: 'email', contact: email },
      });
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
          FORGOT PASSWORD
        </CustomText>
        <View style={styles.spacer} />
      </View>

      <AwareScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleContainer}>
          <CustomText size={22} weight="semiBold" style={styles.title}>
            Enter Your Email
          </CustomText>
          <CustomText size={14} weight="regular" style={styles.subtitle}>
            We'll send a verification code to your email address
          </CustomText>
        </View>

        <View style={styles.inputContainer}>
          <CustomText size={14} weight="regular" style={styles.inputLabel}>
            Email Address*
          </CustomText>
          <Input
            variant="email"
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </AwareScrollView>

      <View style={styles.buttonContainer}>
        <Button title="Send Code" onPress={handleContinue} disabled={!email.trim()} />
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
  },
  title: {
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.lightText,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.xs,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
});
