import { Stack } from 'expo-router';

export default function AuthenticatedLayout() {
  // return <Redirect href="/(unauthenticated)/login" />;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
