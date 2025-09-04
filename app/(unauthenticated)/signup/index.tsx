import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { theme } from '~/src/constants/theme';

import { SignupHeader, SignupForm, ConfirmButton } from '~/src/components/utils/auth/signup';
import { AwareScrollView } from '~/src/components/base';
import { useAppSafeAreaInsets } from '~/src/hooks/useAppSafeAreaInsets';

export const SignupPage = () => {
  /*** Constants ***/
  const router = useRouter();
  const insets = useAppSafeAreaInsets();

  const handleConfirm = () => {
    // Handle signup logic here
    router.navigate('/(authenticated)/onboarding');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AwareScrollView contentContainerStyle={styles.scrollContent}>
        <SignupHeader />

        <SignupForm />

        <ConfirmButton onPress={handleConfirm} />
      </AwareScrollView>
    </View>
  );
};

export default SignupPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
