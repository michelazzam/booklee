import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PhoneInput, { ICountry } from 'react-native-international-phone-number';
import { theme } from '~/src/constants/theme';
import { PhoneInputProps } from './types';

export default function PhoneInputComponent({
  value = '',
  onChangePhoneNumber,
  selectedCountry = null,
  onChangeSelectedCountry,
  defaultCountry = 'LB',
  placeholder = 'Enter phone number',
  containerStyle,
  phoneInputStyles,
}: PhoneInputProps) {
  const [internalSelectedCountry, setInternalSelectedCountry] = useState<ICountry | null>(
    selectedCountry
  );
  const [internalPhoneNumber, setInternalPhoneNumber] = useState<string>(value);

  const handleCountryChange = (country: ICountry) => {
    setInternalSelectedCountry(country);
    onChangeSelectedCountry?.(country);
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setInternalPhoneNumber(phoneNumber);
    onChangePhoneNumber?.(phoneNumber);
  };

  const defaultPhoneInputStyles = {
    container: {
      flex: 1,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: 'transparent',
      borderWidth: 0,
      padding: 0,
    },
    flagContainer: {
      width: 90,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
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
  };

  return (
    <View style={[styles.phoneInputContainer, containerStyle]}>
      <PhoneInput
        value={internalPhoneNumber}
        onChangePhoneNumber={handlePhoneNumberChange}
        selectedCountry={internalSelectedCountry}
        defaultCountry={defaultCountry as any}
        onChangeSelectedCountry={handleCountryChange}
        phoneInputStyles={phoneInputStyles || defaultPhoneInputStyles}
        placeholder={placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
