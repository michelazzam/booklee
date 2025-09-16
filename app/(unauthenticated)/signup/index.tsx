import { StyleSheet, View, Keyboard } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';

import { type SignUpReqType, AuthServices, type RoleType } from '~/src/services';

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
    role: '',
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
        console.error('Sign up error:', error);
        Toast.error('Oops! Something went wrong during signup');
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
            placeholder="John"
            error={validationErrors.errors?.firstName}
            onChangeText={(value) => onTextChange(value, 'firstName')}
          />

          <Input
            inputWidth="48%"
            label="Last Name*"
            placeholder="Doe"
            error={validationErrors.errors?.lastName}
            onChangeText={(value) => onTextChange(value, 'lastName')}
          />
        </View>

        <Input
          label="Email*"
          variant="email"
          placeholder="john.doe@example.com"
          error={validationErrors.errors?.email}
          onChangeText={(value) => onTextChange(value, 'email')}
        />

        {/* <Input
          label="Role*"
          editable={false}
          variant="dropdown"
          value={data.current.role}
          trailingIcon="chevron-down"
          error={validationErrors.errors?.role}
          onChangeText={(value) => onTextChange(value, 'role')}
          options={['owner', 'manager', 'stylist', 'receptionist']}
        /> */}

        {/* {role !== 'owner' ? (
          <Input
            placeholder="123456"
            label="Invitation Key*"
            onChangeText={() => onTextChange('', 'salonName')}
          />
        ) : (
          <Input
            label="Salon Name*"
            placeholder="John Doe's Salon"
            error={validationErrors.errors?.salonName}
            onChangeText={(value) => onTextChange(value, 'salonName')}
          />
        )} */}

        <PhoneInput
          placeholder="xx-xxx-xxxx"
          error={validationErrors.errors?.phone}
          onChangeText={(value) => onTextChange(value, 'phone')}
        />

        <Input
          label="Password*"
          variant="password"
          placeholder="********"
          error={validationErrors.errors?.password}
          onChangeText={(value) => onTextChange(value, 'password')}
        />

        <Input
          variant="password"
          placeholder="********"
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
