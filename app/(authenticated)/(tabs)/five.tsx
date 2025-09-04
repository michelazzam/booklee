import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function five() {
  return (
    <View>
      <Text>five</Text>
      <Link href="/(unauthenticated)/login">
        <Text>Login</Text>
      </Link>
    </View>
  );
}
