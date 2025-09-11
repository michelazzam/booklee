import { ICountry } from 'react-native-international-phone-number';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { theme } from '~/src/constants/theme';

import { Input, PhoneInput } from '~/src/components/textInputs';
import { Text } from '~/src/components/base';

interface LoginInputsProps {
  activeTab: 'email' | 'phone';
}

const LoginInputs = ({ activeTab }: LoginInputsProps) => {
  /*** Constants ***/
  const router = useRouter();

  /*** States ***/
  const [phoneNumberValue, setPhoneNumberValue] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);

  const onChangeSelectedCountry = (country: ICountry) => {
    setSelectedCountry(country);
  };
  const onChangePhoneNumber = (phoneNumber: string) => {
    setPhoneNumberValue(phoneNumber);
  };
  const handleForgotPassword = () => {
    router.push('/(unauthenticated)/login/forgot-password/method-selection');
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputField}>
        <Text size={14} weight="regular" style={styles.inputLabel}>
          {activeTab === 'email' ? 'Email' : 'Phone Number'}
        </Text>

        {activeTab === 'email' ? (
          <Input variant="email" placeholder="Enter your email" keyboardType="email-address" />
        ) : (
          <PhoneInput
            defaultCountry="LB"
            value={phoneNumberValue}
            placeholder="Enter your phone number"
            selectedCountry={selectedCountry}
            onChangePhoneNumber={onChangePhoneNumber}
            onChangeSelectedCountry={onChangeSelectedCountry}
          />
        )}
      </View>

      <View style={styles.inputField}>
        <View style={styles.passwordHeader}>
          <Text size={14} weight="regular" style={styles.inputLabel}>
            Password
          </Text>

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text size={14} weight="regular" style={styles.forgotPassword}>
              Forgot Password
            </Text>
          </TouchableOpacity>
        </View>

        <Input variant="password" placeholder="Enter your password" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  inputField: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.xs,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  forgotPassword: {
    color: theme.colors.lightText,
  },
  passwordInputContainer: {
    position: 'relative',
  },
  textInput: {},
  eyeIcon: {},
});

export default LoginInputs;
