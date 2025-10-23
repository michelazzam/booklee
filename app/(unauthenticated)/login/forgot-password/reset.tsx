import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useRef, useState } from 'react';

import { type ValidationResultType, validateResetPassword } from '~/src/helper/validation';
import { AuthServices, type ResetPasswordReqType } from '~/src/services';
import { useAppSafeAreaInsets } from '~/src/hooks';
import { theme } from '~/src/constants/theme';

import { AwareScrollView, HeaderNavigation } from '~/src/components/base';
import { Button } from '~/src/components/buttons';
import { Input } from '~/src/components/textInputs';

type LocalSearchParamsType = {
  otp: string;
  email: string;
};
const ResetPasswordScreen = () => {
  /***** Refs *****/
  const data = useRef<ResetPasswordReqType>({
    otp: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  /*** Constants ***/
  const router = useRouter();
  const { bottom } = useAppSafeAreaInsets();
  const { email, otp } = useLocalSearchParams<LocalSearchParamsType>();
  const { mutate: resetPassword, isPending: isResetPasswordPending } =
    AuthServices.useResetPassword();

  /*** States ***/
  const [validationErrors, setValidationErrors] = useState<
    ValidationResultType<ResetPasswordReqType>
  >({
    success: false,
  });

  const onTextChange = (text: string, field: keyof ResetPasswordReqType) => {
    data.current[field] = text;

    setValidationErrors((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: undefined },
    }));
  };
  const handleResetPassword = async () => {
    Keyboard.dismiss();
    setValidationErrors({ success: true });

    const { success, errors } = await validateResetPassword(data.current);
    if (!success) {
      setValidationErrors({ success: false, errors });
      return;
    }

    resetPassword(
      {
        email,
        otp,
        password: data.current.password,
        confirmPassword: data.current.confirmPassword,
      },
      {
        onSuccess: () => {
          router.back();
        },
        onError: (error: any) => {
          Toast.error(error?.message || 'Failed to reset password');
        },
      }
    );
  };

  return (
    <AwareScrollView contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
      <HeaderNavigation title="RESET PASSWORD" />

      <View style={styles.formSection}>
        <Input
          label="Password"
          variant="password"
          placeholder="Enter your password"
          error={validationErrors.errors?.password}
          onChangeText={(value) => onTextChange(value, 'password')}
        />

        <Input
          variant="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          error={validationErrors.errors?.confirmPassword}
          onChangeText={(value) => onTextChange(value, 'confirmPassword')}
        />
      </View>

      <Button
        title="Reset Password"
        onPress={handleResetPassword}
        disabled={isResetPasswordPending}
        isLoading={isResetPasswordPending}
      />
    </AwareScrollView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  formSection: {
    flex: 1,
    gap: theme.spacing.xl,
  },
});
