import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '~/src/components/base/text';
import { theme } from '~/src/constants/theme';
import { Input } from '~/src/components/textInputs';
import { ICountry } from 'react-native-international-phone-number';
import { AwareScrollView } from '~/src/components/base';
import PhoneInputComponent from '~/src/components/textInputs/phoneInput';

export default function SignupForm() {
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [phoneNumberValue, setPhoneNumberValue] = useState<string>('');

  function onChangeSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  function onChangePhoneNumber(phoneNumber: string) {
    setPhoneNumberValue(phoneNumber);
  }

  return (
    <AwareScrollView contentContainerStyle={styles.form}>
      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          Full Name*
        </CustomText>
        <Input placeholder="Enter your full name" />
      </View>

      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          Email*
        </CustomText>
        <Input variant="email" placeholder="Enter your email" />
      </View>

      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          Phone Number*
        </CustomText>
        <View style={styles.phoneInputContainer}>
          <PhoneInputComponent
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
        <Input variant="password" placeholder="Enter your password" />
      </View>

      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          Confirm Password*
        </CustomText>
        <Input variant="password" placeholder="Confirm your password" />
      </View>
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
});
