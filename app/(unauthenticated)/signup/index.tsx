import { StyleSheet } from 'react-native';

import { theme } from '~/src/constants/theme';

import { SignupHeader, SignupForm } from '~/src/components/utils/auth/signup';
import { Wrapper } from '~/src/components/utils/UI';

export const SignupPage = () => {
  return (
    <Wrapper style={[styles.container]} withBottom={true}>
      {/* Use the already available header component from base folder */}
      <SignupHeader />

      <SignupForm />
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
