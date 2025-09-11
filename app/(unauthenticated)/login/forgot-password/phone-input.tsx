import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import CustomText from '~/src/components/base/text';
import { theme } from '~/src/constants/theme';
import { ArrowLeftIcon } from '~/src/assets/icons';
import { AwareScrollView } from '~/src/components/base';
import { Button } from '~/src/components/buttons';
import { ICountry } from 'react-native-international-phone-number';
import PhoneInputComponent from '~/src/components/textInputs/phoneInput';
import { Wrapper } from '~/src/components/utils/UI';

export default function ForgotPasswordPhoneInput() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    if (phoneNumber.trim() && selectedCountry) {
      const fullPhoneNumber = `${selectedCountry.idd.root}${phoneNumber}`;
      router.push({
        pathname: '/(unauthenticated)/forgot-password/otp-verification',
        params: { method: 'phone', contact: fullPhoneNumber },
      });
    }
  };

  return (
    <Wrapper style={styles.container} withBottom={true}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon color={theme.colors.darkText[100]} />
        </TouchableOpacity>
        <CustomText size={16} weight="medium">
          FORGOT PASSWORD
        </CustomText>
        <View style={styles.spacer} />
      </View>

      <AwareScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleContainer}>
          <CustomText size={22} weight="semiBold" style={styles.title}>
            Enter Your Phone Number
          </CustomText>
          <CustomText size={14} weight="regular" style={styles.subtitle}>
            We'll send a verification code to your phone number
          </CustomText>
        </View>

        <View style={styles.inputContainer}>
          <CustomText size={14} weight="regular" style={styles.inputLabel}>
            Phone Number*
          </CustomText>
          <PhoneInputComponent
            value={phoneNumber}
            onChangePhoneNumber={setPhoneNumber}
            selectedCountry={selectedCountry}
            onChangeSelectedCountry={setSelectedCountry}
          />
          <CustomText size={14} weight="regular" style={styles.hint}>
            Example: XX XXX XXX
          </CustomText>
        </View>
      </AwareScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Send Code"
          onPress={handleContinue}
          disabled={!phoneNumber.trim() || !selectedCountry}
        />
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  spacer: {
    width: 40,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
  },
  titleContainer: {
    marginBottom: theme.spacing['3xl'],
  },
  title: {
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.lightText,
    lineHeight: 20,
  },
  inputContainer: {
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
  buttonContainer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
});
