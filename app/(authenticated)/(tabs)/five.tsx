import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import { useAppSafeAreaInsets } from '~/src/hooks/useAppSafeAreaInsets';

export default function five() {
  const { top } = useAppSafeAreaInsets();
  return (
    <View style={{ paddingTop: top }}>
      <Text>five</Text>
      <Link href="/(unauthenticated)/login">
        <Text>Login</Text>
      </Link>
    </View>
  );
}
