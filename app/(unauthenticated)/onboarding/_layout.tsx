import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <>
      <StatusBar style="light" />

      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
    </>
  );
}
