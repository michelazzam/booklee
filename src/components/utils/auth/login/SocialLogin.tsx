import { View, StyleSheet } from 'react-native';
import CustomText from '~/src/components/base/text';
import { theme } from '~/src/constants/theme';
import { authClient } from '~/src/services/auth/auth-client';
import { Button } from '~/src/components/buttons';

export default function SocialLogin() {
  const handleLogin = async () => {
    await authClient.signIn
      .social({
        provider: 'google',
        callbackURL: '/(authenticated)/(tabs)', // this will be converted to a deep link (eg. `myapp://dashboard`) on native
      })
      .then((res) => {
        console.log(res);
      });
  };
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
        onPress={handleLogin}
        leadingIcon="google"
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
