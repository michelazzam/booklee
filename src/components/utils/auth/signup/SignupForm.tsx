import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Text as CustomText } from '~/src/components/base';
import { theme } from '~/src/constants/theme';
import { Input } from '~/src/components/textInputs';
import { ICountry } from 'react-native-international-phone-number';
import { AwareScrollView } from '~/src/components/base';
import { PhoneInput } from '~/src/components/textInputs';
import { authClient } from '~/src/services/auth/auth-client';
import ConfirmButton from './ConfirmButton';

export default function SignupForm() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [phoneNumberValue, setPhoneNumberValue] = useState<string>('');
  const [email, setEmail] = useState<string>('abbaskheiraldeen47@gmail.com');
  const [password, setPassword] = useState<string>('Test12345@');
  const [confirmPassword, setConfirmPassword] = useState<string>('Test12345@');
  const [firstName, setFirstName] = useState<string>('Abbas');
  const [lastName, setLastName] = useState<string>('Kheiraldeen');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  function onChangeSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  function onChangePhoneNumber(phoneNumber: string) {
    setPhoneNumberValue(phoneNumber);
  }

  const handleSignup = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await authClient.signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        phoneNumber: phoneNumberValue,
        role: 'user',
      } as any);

      if (res.data && !res.error) {
        // Navigate to email verification screen
        router.replace('/(unauthenticated)/signup/email-verification');
      } else if (res.error) {
        // Show error message directly from response
        setErrorMessage(res.error.message || 'An error occurred during signup');
      }

      console.log(res);
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AwareScrollView contentContainerStyle={styles.form}>
      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          First Name*
        </CustomText>
        <Input placeholder="Enter your first name" value={firstName} onChangeText={setFirstName} />
      </View>

      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          Last Name*
        </CustomText>
        <Input placeholder="Enter your last name" value={lastName} onChangeText={setLastName} />
      </View>

      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          Email*
        </CustomText>
        <Input
          variant="email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          Phone Number*
        </CustomText>
        <View style={styles.phoneInputContainer}>
          <PhoneInput
            value={phoneNumberValue}
            onChangePhoneNumber={onChangePhoneNumber}
            selectedCountry={selectedCountry}
            onChangeSelectedCountry={onChangeSelectedCountry}
          />
        </View>
        <CustomText size={14} weight="regular" style={styles.hint}>
          Example: XX XXX XXX
        </CustomText>
      </View>

      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          Password*
        </CustomText>
        <Input
          variant="password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          Confirm Password*
        </CustomText>
        <Input
          variant="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Error Message Display */}
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <CustomText size={14} weight="regular" style={styles.errorText}>
            {errorMessage}
          </CustomText>
        </View>
      ) : null}

      <ConfirmButton onPress={handleSignup} isLoading={isLoading} />
    </AwareScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
  },
  inputField: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.xs,
  },
  phoneInputContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.white.DEFAULT,
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  hint: {
    color: theme.colors.lightText,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: theme.radii.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
  },
});
