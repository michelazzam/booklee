import { ICountry } from 'react-native-international-phone-number';
import { ViewStyle, TextStyle } from 'react-native';

export interface PhoneInputProps {
  value?: string;
  onChangePhoneNumber?: (phoneNumber: string) => void;
  selectedCountry?: ICountry | null;
  onChangeSelectedCountry?: (country: ICountry) => void;
  defaultCountry?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
  phoneInputStyles?: {
    container?: ViewStyle;
    flagContainer?: ViewStyle;
    input?: TextStyle;
    flag?: TextStyle;
    callingCode?: TextStyle;
  };
}
