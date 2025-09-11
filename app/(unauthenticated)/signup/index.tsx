import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { theme } from '~/src/constants/theme';

import { SignupHeader, SignupForm, ConfirmButton } from '~/src/components/utils/auth/signup';
import { Wrapper } from '~/src/components/utils/UI';

export const SignupPage = () => {
  /*** Constants ***/
  const router = useRouter();

  const handleConfirm = () => {
    // Handle signup logic here
    router.navigate('/(authenticated)/(tabs)');
  };

  return (
    <Wrapper style={[styles.container]} withBottom={true}>
      {/* Use the already available header component from base folder */}
      <SignupHeader />

      <SignupForm />

      <ConfirmButton onPress={handleConfirm} />
    </Wrapper>
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
