import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { theme } from '~/src/constants/theme';

import { SignupHeader, SignupForm, ConfirmButton } from '~/src/components/utils/auth/signup';

export const SignupPage = () => {
  /*** Constants ***/
  const router = useRouter();

  const handleConfirm = () => {
    // Handle signup logic here
    // router.navigate("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <SignupHeader />

      <SignupForm />

      <ConfirmButton onPress={handleConfirm} />
    </SafeAreaView>
  );
};

export default SignupPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
});
