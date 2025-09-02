import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomText } from '~/src/components/utils/CustomText';
import { Eye, EyeOff } from 'lucide-react-native';
import { theme } from '~/src/constants/theme';

interface LoginInputsProps {
  activeTab: 'email' | 'phone';
  showPassword: boolean;
  onPasswordToggle: () => void;
}

export default function LoginInputs({
  activeTab,
  showPassword,
  onPasswordToggle,
}: LoginInputsProps) {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputField}>
        <CustomText variant="bodyPrimaryRegular" style={styles.inputLabel}>
          {activeTab === 'email' ? 'Email' : 'Phone Number'}
        </CustomText>
        <TextInput
          style={styles.textInput}
          placeholder={activeTab === 'email' ? 'Enter your email' : 'Enter your phone number'}
          placeholderTextColor={theme.colors.lightText}
          keyboardType={activeTab === 'email' ? 'email-address' : 'phone-pad'}
        />
      </View>

      <View style={styles.inputField}>
        <View style={styles.passwordHeader}>
          <CustomText variant="bodyPrimaryRegular" style={styles.inputLabel}>
            Password
          </CustomText>
          <TouchableOpacity>
            <CustomText variant="bodyPrimaryHyperlink" style={styles.forgotPassword}>
              Forgot Password
            </CustomText>
          </TouchableOpacity>
        </View>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={theme.colors.lightText}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={onPasswordToggle}>
            {!showPassword ? (
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
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    fontFamily: 'Montserrat-Regular',
    backgroundColor: theme.colors.white.DEFAULT,
  },
  eyeIcon: {
    position: 'absolute',
    right: theme.spacing.md,
    top: theme.spacing.md,
  },
});
