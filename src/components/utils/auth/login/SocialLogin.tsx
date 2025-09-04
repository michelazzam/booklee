import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from '~/src/components/base/text';
import { GoogleIcon } from '~/src/assets/icons';
import { theme } from '~/src/constants/theme';

export default function SocialLogin() {
  return (
    <>
      {/* Separator */}
      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <CustomText size={14} weight="regular" style={styles.separatorText}>
          or sign in with
        </CustomText>
        <View style={styles.separatorLine} />
      </View>

      {/* Google Button */}
      <TouchableOpacity style={styles.googleButton}>
        <View style={styles.googleButtonContent}>
          <View style={styles.googleIcon}>
            <GoogleIcon />
          </View>
          <CustomText size={14} weight="bold" style={styles.googleButtonText}>
            Continue With Google
          </CustomText>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  separatorText: {
    color: theme.colors.lightText,
    marginHorizontal: theme.spacing.md,
  },
  googleButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white.DEFAULT,
    marginBottom: theme.spacing.xl,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: theme.spacing.md,
  },
  googleButtonText: {
    color: theme.colors.darkText[100],
  },
});
