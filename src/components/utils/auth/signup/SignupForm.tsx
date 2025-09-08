import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '~/src/components/base/text';
import { theme } from '~/src/constants/theme';
import { Input } from '~/src/components/textInputs';
import PhoneInput, { ICountry } from 'react-native-international-phone-number';
import { AwareScrollView } from '~/src/components/base';

//Abbas TODO: Please clean the file from the comments it feels AI generated
//Abbas TODO: Since this is not going to be a re-usable component its enough to add this code in the login screen. this way data handling becomes easier
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
    // Add more spacing between the inputs
    <AwareScrollView contentContainerStyle={styles.form}>
      {/* Full Name */}
      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          Full Name*
        </CustomText>
        <Input placeholder="Enter your full name" />
      </View>

      {/* Email */}
      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          Email*
        </CustomText>
        <Input variant="email" placeholder="Enter your email" />
      </View>

      {/* Phone Number */}
      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          Phone Number*
        </CustomText>
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
        <CustomText size={14} weight="regular" style={styles.hint}>
          Example: XX XXX XXX
        </CustomText>
      </View>

      {/* Password */}
      <View style={styles.inputField}>
        <CustomText size={14} weight="regular" style={styles.inputLabel}>
          Password*
        </CustomText>
        <Input variant="password" placeholder="Enter your password" />
      </View>

      {/* Confirm Password */}
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
