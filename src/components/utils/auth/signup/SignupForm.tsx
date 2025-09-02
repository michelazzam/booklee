import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomText } from '~/src/components/utils/CustomText';
import { Eye, EyeOff, ChevronDown } from 'lucide-react-native';
import { theme } from '~/src/constants/theme';

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.form}>
      {/* Full Name */}
      <View style={styles.inputField}>
        <CustomText variant="bodyPrimaryBold" style={styles.label}>
          Full Name*
        </CustomText>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your full name"
          placeholderTextColor={theme.colors.lightText}
        />
      </View>

      {/* Email */}
      <View style={styles.inputField}>
        <CustomText variant="bodyPrimaryBold" style={styles.label}>
          Email*
        </CustomText>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your email"
          placeholderTextColor={theme.colors.lightText}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Phone Number */}
      <View style={styles.inputField}>
        <CustomText variant="bodyPrimaryBold" style={styles.label}>
          Phone Number*
        </CustomText>
        <View style={styles.phoneContainer}>
          <View style={styles.countryCodeContainer}>
            <TextInput style={styles.countryCodeInput} value="+961" editable={false} />
            <TouchableOpacity style={styles.chevronButton}>
              <ChevronDown size={16} color={theme.colors.darkText[100]} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="XX XXX XXX"
            placeholderTextColor={theme.colors.lightText}
            keyboardType="phone-pad"
          />
        </View>
        <CustomText variant="bodySecondaryRegular" style={styles.hint}>
          Example: XX XXX XXX
        </CustomText>
      </View>

      {/* Password */}
      <View style={styles.inputField}>
        <CustomText variant="bodyPrimaryBold" style={styles.label}>
          Password
        </CustomText>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={theme.colors.lightText}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            {!showPassword ? (
              <Eye color={theme.colors.darkText[100]} />
            ) : (
              <EyeOff color={theme.colors.darkText[100]} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputField}>
        <CustomText variant="bodyPrimaryBold" style={styles.label}>
          Confirm Password
        </CustomText>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm your password"
            placeholderTextColor={theme.colors.lightText}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            {!showConfirmPassword ? (
              <Eye color={theme.colors.darkText[100]} />
            ) : (
              <EyeOff color={theme.colors.darkText[100]} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  label: {
    color: theme.colors.darkText[100],
    marginBottom: theme.spacing.xs,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    fontFamily: 'Montserrat-Regular',
    backgroundColor: theme.colors.white.DEFAULT,
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  countryCodeInput: {
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    fontFamily: 'Montserrat-Regular',
    color: theme.colors.darkText[100],
    minWidth: 60,
  },
  chevronButton: {
    paddingHorizontal: theme.spacing.sm,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    fontFamily: 'Montserrat-Regular',
    backgroundColor: theme.colors.white.DEFAULT,
  },
  hint: {
    color: theme.colors.lightText,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: theme.spacing.md,
    top: theme.spacing.md,
  },
});
