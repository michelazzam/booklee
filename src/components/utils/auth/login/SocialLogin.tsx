import { View, StyleSheet } from 'react-native';
import CustomText from '~/src/components/base/text';
import { theme } from '~/src/constants/theme';
import { AuthServices } from '~/src/services';
import { Button } from '~/src/components/buttons';

export default function SocialLogin() {
  const googleLoginMutation = AuthServices.useGoogleLogin();
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
      <Button
        title="Continue With Google"
        onPress={() => googleLoginMutation.mutate()}
        leadingIcon="google"
        isLoading={googleLoginMutation.isPending}
        containerStyle={styles.googleButton}
        variant="outline"
      />
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
