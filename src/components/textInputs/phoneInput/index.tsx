import PhoneInput, { getCountryByCca2, ICountry } from 'react-native-international-phone-number';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useEffect, useState, useCallback } from 'react';
import { Platform, View } from 'react-native';

import { styles, inputContainerStyle, modalContainerStyle } from './config';

import Text from '~/src/components/base/text';

export type PhoneInputProps = {
  error?: string;
  value?: string;
  editable?: boolean;
  placeholder: string;
  isRequired?: boolean;
  onChangeText?: (phoneInput: string) => void;
};

const PhoneInputWrapper = ({
  value,
  error,
  isRequired,
  placeholder,
  onChangeText,
  editable = true,
}: PhoneInputProps) => {
  /*** States ***/
  const [phone, setPhone] = useState<string>('');
  const [country, setCountry] = useState<ICountry | null>(null);

  useEffect(() => {
    if (value) {
      const cca2 = value.split('-')[0] || '';
      const countryInfo = getCountryByCca2(cca2) || null;
      const phoneNumber = value.split('-')[1] || '';

      setPhone(phoneNumber);
      setCountry(countryInfo);
    } else {
      const defaultCountry = getCountryByCca2('LB');
      setCountry(defaultCountry || null);
    }
  }, [value]);

  const formateNumber = (phoneNumber: string, country: ICountry | null): string => {
    const selectedCountry = country || getCountryByCca2('LB');

    if (!selectedCountry) {
      return `${phoneNumber}`;
    }

    const cca2 = selectedCountry.cca2;
    const formateNumber = phoneNumber.replace(/ /g, '');

    return `${cca2}-${formateNumber}`;
  };
  const handleInputValue = useCallback(
    (phoneNumber: string) => {
      const formatNumber = formateNumber(phoneNumber, country);

      setPhone(phoneNumber);
      onChangeText?.(formatNumber || '');
    },
    [country, onChangeText]
  );
  const handleSelectedCountry = useCallback(
    (country: ICountry) => {
      const formatNumber = formateNumber(phone, country);

      setCountry(country);
      onChangeText?.(formatNumber || '');
    },
    [phone, onChangeText]
  );

  const renderError = useCallback(() => {
    if (error) {
      return (
        <Animated.Text entering={FadeIn} exiting={FadeOut} style={styles.errorText}>
          {error}
        </Animated.Text>
      );
    }
    return null;
  }, [error]);

  return (
    <View style={{ gap: 4, width: '100%', opacity: editable ? 1 : 0.5 }}>
      <Text size={14} weight="regular">
        {` Phone Number${isRequired ? '*' : ''}`}
      </Text>

      <Animated.View style={styles.inputContainer}>
        <PhoneInput
          value={phone}
          defaultCountry="LB"
          disabled={!editable}
          placeholder={placeholder}
          selectedCountry={country}
          onChangePhoneNumber={handleInputValue}
          onChangeSelectedCountry={handleSelectedCountry}
          modalStyles={{ ...modalContainerStyle.modalStyles }}
          phoneInputStyles={inputContainerStyle.containerStyle}
          modalType={Platform.OS === 'ios' ? 'bottomSheet' : 'popup'}
        />
      </Animated.View>

      {renderError()}
    </View>
  );
};

export default PhoneInputWrapper;
