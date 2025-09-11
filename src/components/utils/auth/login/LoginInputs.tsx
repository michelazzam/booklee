import { ICountry } from 'react-native-international-phone-number';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { theme } from '~/src/constants/theme';

import { Input, PhoneInput } from '~/src/components/textInputs';
import { Text } from '~/src/components/base';
import { Button } from '~/src/components/buttons';
import { authClient } from '~/src/services/auth/auth-client';

interface LoginInputsProps {
  activeTab: 'email' | 'phone';
}

const LoginInputs = ({ activeTab }: LoginInputsProps) => {
  /*** Constants ***/
  const router = useRouter();

  /*** States ***/
  const [phoneNumberValue, setPhoneNumberValue] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [email, setEmail] = useState<string>('abbaskheiraldeen47@gmail.com');
  const [password, setPassword] = useState<string>('Test12345@');
  const [isLoading, setIsLoading] = useState(false);

  const onChangeSelectedCountry = (country: ICountry) => {
    setSelectedCountry(country);
  };
  const onChangePhoneNumber = (phoneNumber: string) => {
    setPhoneNumberValue(phoneNumber);
  };
  const handleForgotPassword = () => {
    router.push('/(unauthenticated)/login/forgot-password/method-selection');
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.data && !res.error) {
        // Check if email is verified
        if (res.data.user.emailVerified) {
          // Better Auth handles session management automatically
          router.replace('/(authenticated)/(tabs)');
        } else {
          // Email not verified - show alert and navigate to verification screen
          Alert.alert(
            'Email Not Verified',
            'Please check your email and verify your account before logging in.',
            [
              {
                text: 'OK',
              },
            ]
          );
        }
      } else if (res.error) {
        // Handle specific error cases
        if (res.error.code === 'EMAIL_NOT_VERIFIED') {
          Alert.alert(
            'Email Not Verified',
            'Please check your email and verify your account before logging in.',
            [
              {
                text: 'OK',
              },
            ]
          );
        } else {
          Alert.alert('Login Failed', res.error.message || 'An error occurred during login');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputField}>
        <Text size={14} weight="regular" style={styles.inputLabel}>
          {activeTab === 'email' ? 'Email' : 'Phone Number'}
        </Text>

        {activeTab === 'email' ? (
          <Input
            variant="email"
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
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

        <Input
          variant="password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <Button
        title="Next"
        isLoading={isLoading}
        containerStyle={styles.nextButton}
        onPress={() => handleLogin()}
      />
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

  nextButton: {
    marginBottom: theme.spacing.xl,
  },
});

export default LoginInputs;
