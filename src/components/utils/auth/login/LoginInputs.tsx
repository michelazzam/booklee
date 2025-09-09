import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from '~/src/components/base/text';
import { theme } from '~/src/constants/theme';
import { Input, PhoneInput } from '~/src/components/textInputs';
import { useState } from 'react';
import { ICountry } from 'react-native-international-phone-number';

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
    router.push('/(unauthenticated)/forgot-password/method-selection');
  };
  return (
    // Use this <Animated.View style={styles.inputContainer} entering={FadeIn} exiting={FadeOut}> import it from reanimated package
    <View style={styles.inputContainer}>
      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          {activeTab === 'email' ? 'Email' : 'Phone Number'}
        </CustomText>
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
          <CustomText size={14} weight="regular" style={styles.inputLabel}>
            Password
          </CustomText>
          <TouchableOpacity onPress={handleForgotPassword}>
            <CustomText size={14} weight="regular" style={styles.forgotPassword}>
              Forgot Password
            </CustomText>
          </TouchableOpacity>
        </View>
        <Input variant="password" placeholder="Enter your password" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
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
