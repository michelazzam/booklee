import { ICountry } from 'react-native-international-phone-number';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { theme } from '~/src/constants/theme';

import { Input, PhoneInput } from '~/src/components/textInputs';
import { Text } from '~/src/components/base';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface LoginInputsProps {
  activeTab: 'email' | 'phone';
}

const LoginInputs = ({ activeTab }: LoginInputsProps) => {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  function onChangeSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }
  const [phoneNumberValue, setPhoneNumberValue] = useState<string>('');
  function onChangePhoneNumber(phoneNumber: string) {
    setPhoneNumberValue(phoneNumber);
  }

  const handleForgotPassword = () => {
    router.push('/(unauthenticated)/login/forgot-password/method-selection');
  };
  return (
    // Use this <Animated.View style={styles.inputContainer} entering={FadeIn} exiting={FadeOut}> import it from reanimated package
    <Animated.View style={styles.inputContainer} entering={FadeIn} exiting={FadeOut}>
      <View style={styles.inputField}>
        <Text size={14} weight="regular" style={styles.inputLabel}>
          {activeTab === 'email' ? 'Email' : 'Phone Number'}
        </Text>

        {activeTab === 'email' ? (
          <Input variant="email" placeholder="Enter your email" keyboardType="email-address" />
        ) : (
          <PhoneInput
            value={phoneNumberValue}
            onChangePhoneNumber={onChangePhoneNumber}
            selectedCountry={selectedCountry}
            defaultCountry="LB"
            onChangeSelectedCountry={onChangeSelectedCountry}
            placeholder="Enter your phone number"
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
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
