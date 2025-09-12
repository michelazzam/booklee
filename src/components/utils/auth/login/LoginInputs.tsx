import { View, StyleSheet, Keyboard } from 'react-native';
import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';

import { AuthServices, type LoginReqType } from '~/src/services';

import { theme } from '~/src/constants/theme';
import { type ValidationResultType, validateLogin } from '~/src/helper/validation';

import { Input, PhoneInput } from '~/src/components/textInputs';
import { Button } from '~/src/components/buttons';
import { Toast } from 'toastify-react-native';

type LoginInputsProps = {
  activeTab: 'email' | 'phone';
};

const LoginInputs = ({ activeTab }: LoginInputsProps) => {
  /***** Refs *****/
  const data = useRef<LoginReqType>({
    password: '',
  });

  /*** Constants ***/
  const router = useRouter();
  const { mutate: login, isPending: isLoginPending } = AuthServices.useLogin();

  /*** States ***/
  const [validationErrors, setValidationErrors] = useState<ValidationResultType<LoginReqType>>({
    success: false,
  });

  const onTextChange = (text: string, field: keyof LoginReqType) => {
    switch (field) {
      case 'password':
        data.current[field] = text;
        break;
      case 'email':
        delete data.current.phone;
        data.current[field] = text;
        break;
      case 'phone':
        delete data.current.email;
        data.current[field] = text;
        break;
    }

    setValidationErrors((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: undefined },
    }));
  };
  const handleLogin = async () => {
    Keyboard.dismiss();
    setValidationErrors({ success: true });

    const { success, errors } = await validateLogin(data.current);

    if (!success) {
      setValidationErrors({ success: false, errors: errors || {} });
      return;
    }

    login(data.current, {
      onSuccess: () => {
        Toast.success('Login successful');
      },
      onError: () => {
        Toast.error('Oops! something went wrong');
      },
    });
  };

  return (
    <View style={styles.inputContainer}>
      {activeTab === 'email' ? (
        <Input
          label="Email"
          variant="email"
          keyboardType="email-address"
          placeholder="Enter your email"
          error={validationErrors.errors?.email}
          onChangeText={(value) => onTextChange(value, 'email')}
        />
      ) : (
        <PhoneInput
          placeholder="xx-xxx-xxxx"
          error={validationErrors.errors?.phone}
          onChangeText={(value) => onTextChange(value, 'phone')}
        />
      )}

      <Input
        label="Password"
        variant="password"
        placeholder="Enter your password"
        error={validationErrors.errors?.password}
        onChangeText={(value) => onTextChange(value, 'password')}
        subText={{
          label: 'Forgot Password',
          action: () =>
            router.navigate('/(unauthenticated)/login/forgot-password/method-selection'),
        }}
      />

      <Button
        title="Next"
        onPress={handleLogin}
        disabled={isLoginPending}
        isLoading={isLoginPending}
      />
    </View>
  );
};

export default LoginInputs;

const styles = StyleSheet.create({
  inputContainer: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});
