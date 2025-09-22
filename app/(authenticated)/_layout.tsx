import { Redirect, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useUserProvider } from '~/src/store';
import { AuthServices } from '~/src/services';

import { theme } from '~/src/constants/theme';

export default function AuthenticatedLayout() {
  /*** Constants ***/
  const pathname = usePathname();
  const { data: userData } = AuthServices.useGetMe();
  const { isOnboardingCompleted } = useUserProvider();
  const { isAuthenticated } = AuthServices.useGetBetterAuthUser();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !userData) {
    return <Redirect href="/(unauthenticated)/login" />;
  }

  if (!isOnboardingCompleted && pathname !== '/onboarding') {
    return <Redirect href="/(unauthenticated)/onboarding" />;
  }

  return (
    <>
      <StatusBar style="auto" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.white.DEFAULT },
        }}
      />
    </>
  );
}
