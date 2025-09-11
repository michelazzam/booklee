import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import CustomText from '~/src/components/base/text';
import { theme } from '~/src/constants/theme';
import { ArrowLeftIcon } from '~/src/assets/icons';
import { AwareScrollView } from '~/src/components/base';
import { Input } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';
import { Wrapper } from '~/src/components/utils/UI';

export default function ForgotPasswordNewPassword() {
  const router = useRouter();
  useLocalSearchParams<{ method: string; contact: string; otp: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);

        router.replace('/(authenticated)/(tabs)');
      }, 1000);
    }
  };

  const isFormValid =
    newPassword.length >= 6 && confirmPassword.length >= 6 && newPassword === confirmPassword;

  return (
    <Wrapper style={styles.container} withBottom={true}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon color={theme.colors.darkText[100]} />
        </TouchableOpacity>
        <CustomText size={16} weight="medium">
          NEW PASSWORD
        </CustomText>
        <View style={styles.spacer} />
      </View>

      <AwareScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleContainer}>
          <CustomText size={22} weight="semiBold" style={styles.title}>
            Create New Password
          </CustomText>
          <CustomText size={14} weight="regular" style={styles.subtitle}>
            Your new password must be different from previously used passwords
          </CustomText>
        </View>

        <View style={styles.inputsContainer}>
          <View style={styles.inputField}>
            <CustomText size={14} weight="regular" style={styles.inputLabel}>
              New Password*
            </CustomText>
            <Input
              variant="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChangeText={setNewPassword}
            />
            {newPassword.length > 0 && newPassword.length < 6 && (
              <CustomText size={12} weight="regular" style={styles.errorText}>
                Password must be at least 6 characters
              </CustomText>
            )}
          </View>

          <View style={styles.inputField}>
            <CustomText size={14} weight="regular" style={styles.inputLabel}>
              Confirm New Password*
            </CustomText>
            <Input
              variant="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <CustomText size={12} weight="regular" style={styles.errorText}>
                Passwords do not match
              </CustomText>
            )}
          </View>
        </View>

        <View style={styles.requirementsContainer}>
          <CustomText size={14} weight="medium" style={styles.requirementsTitle}>
            Password Requirements:
          </CustomText>
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <View
                style={[
                  styles.requirementDot,
                  {
                    backgroundColor:
                      newPassword.length >= 6 ? theme.colors.green[100] : theme.colors.grey[100],
                  },
                ]}
              />
              <CustomText size={12} weight="regular" style={styles.requirementText}>
                At least 6 characters
              </CustomText>
            </View>
            <View style={styles.requirementItem}>
              <View
                style={[
                  styles.requirementDot,
                  {
                    backgroundColor:
                      newPassword === confirmPassword && newPassword.length > 0
                        ? theme.colors.green[100]
                        : theme.colors.grey[100],
                  },
                ]}
              />
              <CustomText size={12} weight="regular" style={styles.requirementText}>
                Passwords match
              </CustomText>
            </View>
          </View>
        </View>
      </AwareScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Reset Password"
          onPress={handleResetPassword}
          disabled={!isFormValid}
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
  },
  title: {
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.lightText,
    lineHeight: 20,
  },
  inputsContainer: {
    marginBottom: theme.spacing.xl,
  },
  inputField: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.red[100],
    marginTop: theme.spacing.xs,
  },
  requirementsContainer: {
    marginBottom: theme.spacing.lg,
  },
  requirementsTitle: {
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.sm,
  },
  requirementsList: {
    gap: theme.spacing.xs,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  requirementDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  requirementText: {
    color: theme.colors.lightText,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
});
