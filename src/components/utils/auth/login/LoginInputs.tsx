import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from '~/src/components/base/text';
import { theme } from '~/src/constants/theme';
import { Input } from '~/src/components/textInputs';
import { useState } from 'react';
import PhoneInput, { ICountry } from 'react-native-international-phone-number';

interface LoginInputsProps {
  activeTab: 'email' | 'phone';
}

export default function LoginInputs({ activeTab }: LoginInputsProps) {
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  function onChangeSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }
  const [phoneNumberValue, setPhoneNumberValue] = useState<string>('');
  function onChangePhoneNumber(phoneNumber: string) {
    setPhoneNumberValue(phoneNumber);
  }
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          {activeTab === 'email' ? 'Email' : 'Phone Number'}
        </CustomText>
        {activeTab === 'email' ? (
          <Input variant="email" placeholder="Enter your email" keyboardType="email-address" />
        ) : (
          <View style={styles.phoneInputContainer}>
            <PhoneInput
              value={phoneNumberValue}
              onChangePhoneNumber={onChangePhoneNumber}
              selectedCountry={selectedCountry}
              defaultCountry="LB"
              onChangeSelectedCountry={onChangeSelectedCountry}
              phoneInputStyles={{
                container: {
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  padding: 0,
                },
                flagContainer: {
                  width: 90,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: theme.spacing.sm,
                  paddingHorizontal: theme.spacing.xs,
                  backgroundColor: theme.colors.white.DEFAULT,
                },
                input: {
                  flex: 1,
                  fontSize: theme.typography.fontSizes.sm,
                  fontFamily: 'Montserrat-Regular',
                  color: theme.colors.darkText[100],
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  marginLeft: theme.spacing.xs,
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                },
                flag: {
                  fontSize: 16,
                },
                callingCode: {
                  fontSize: theme.typography.fontSizes.md,
                  fontFamily: 'Montserrat-Regular',
                  color: theme.colors.darkText[100],
                  marginRight: theme.spacing.xs,
                },
              }}
            />
          </View>
        )}
      </View>

      <View style={styles.inputField}>
        <View style={styles.passwordHeader}>
          <CustomText size={14} weight="regular" style={styles.inputLabel}>
            Password
          </CustomText>
          <TouchableOpacity>
            <CustomText size={14} weight="regular" style={styles.forgotPassword}>
              Forgot Password
            </CustomText>
          </TouchableOpacity>
        </View>
        <Input variant="password" placeholder="Enter your password" />
      </View>
    </View>
  );
}

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
  textInput: {},
  eyeIcon: {},
});
