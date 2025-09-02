import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SignupHeader, SignupForm, ConfirmButton } from '~/components/auth/signup';
import { theme } from '~/theme/Main';
import { useRouter } from 'expo-router';

export default function SignupPage() {
  const router = useRouter();

  const handleConfirm = () => {
    // Handle signup logic here
    router.push('/authenticated/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <SignupHeader />
      <SignupForm />
      <ConfirmButton onPress={handleConfirm} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white.DEFAULT,
  },
});
