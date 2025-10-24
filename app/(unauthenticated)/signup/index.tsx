import { StyleSheet, View, Keyboard } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';

import { type SignUpReqType, AuthServices } from '~/src/services';

import { type ValidationResultType, validateSignup } from '~/src/helper/validation';
import { theme } from '~/src/constants/theme';

import { useAppSafeAreaInsets } from '~/src/hooks';

import { AwareScrollView, HeaderNavigation } from '~/src/components/base';
import { Input, PhoneInput } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';

export const SignupPage = () => {
  /*** Constants ***/
  const { bottom } = useAppSafeAreaInsets();

  /***** Refs *****/
  const data = useRef<SignUpReqType & { confirmPassword: string }>({
    phone: '',
    email: '',
    password: '',
    lastName: '',
    firstName: '',
    confirmPassword: '',
  });

  /*** Constants ***/
  const router = useRouter();
  const { mutate: signup, isPending: isSignupPending } = AuthServices.useSignUp();

  /*** States ***/
  const [validationErrors, setValidationErrors] = useState<ValidationResultType<SignUpReqType>>({
    success: false,
  });

  const onTextChange = (
    text: string,
    field: keyof (SignUpReqType & { confirmPassword: string })
  ) => {
    data.current[field] = text;

    setValidationErrors((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: undefined },
    }));
  };
  const handleSignup = async () => {
    Keyboard.dismiss();
    setValidationErrors({ success: true });

    const { success, errors } = await validateSignup(data.current);
    if (!success) {
      setValidationErrors({ success: false, errors: errors || {} });
      return;
    }

    const { confirmPassword, ...signupData } = data.current;
    signup(signupData, {
      onSuccess: () => {
        router.replace({
          pathname: '/(unauthenticated)/signup/email-verification',
          params: {
            email: signupData.email,
          },
        });
      },
      onError: (error: any) => {
        Toast.error(error?.message || 'Failed to sign up');
      },
    });
  };

  return (
    <>
      <HeaderNavigation title="Create Account" />

      <AwareScrollView contentContainerStyle={[styles.container, { paddingBottom: bottom }]}>
        <View style={styles.nameContainer}>
          <Input
            inputWidth="48%"
            label="First Name*"
            placeholder="Enter first name"
            error={validationErrors.errors?.firstName}
            onChangeText={(value) => onTextChange(value, 'firstName')}
          />

          <Input
            inputWidth="48%"
            label="Last Name*"
            placeholder="Enter last name"
            error={validationErrors.errors?.lastName}
            onChangeText={(value) => onTextChange(value, 'lastName')}
          />
        </View>

        <Input
          label="Email*"
          variant="email"
          placeholder="Enter your email address"
          error={validationErrors.errors?.email}
          onChangeText={(value) => onTextChange(value, 'email')}
        />

        <PhoneInput
          isRequired
          placeholder="Enter phone number"
          error={validationErrors.errors?.phone}
          onChangeText={(value) => onTextChange(value, 'phone')}
        />

        <Input
          label="Password*"
          variant="password"
          placeholder="Create a password"
          error={validationErrors.errors?.password}
          onChangeText={(value) => onTextChange(value, 'password')}
        />

        <Input
          variant="password"
          placeholder="Confirm your password"
          label="Confirm Password*"
          error={validationErrors.errors?.confirmPassword}
          onChangeText={(value) => onTextChange(value, 'confirmPassword')}
        />

        <Button
          title="Sign up"
          onPress={handleSignup}
          isLoading={isSignupPending}
          containerStyle={{ marginTop: theme.spacing.xl }}
        />
      </AwareScrollView>
    </>
  );
};

export default SignupPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  nameContainer: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    justifyContent: 'space-between',
  },
});
