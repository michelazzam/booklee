import { Redirect, Stack, usePathname } from 'expo-router';

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
  if (!userData || (userData.role !== 'guest' && !isAuthenticated)) {
    return <Redirect href="/(unauthenticated)/login" />;
  }

  // If user is not onboarded and is not on onboarding screen, redirect to onboarding
  if (!isOnboardingCompleted && pathname !== '/onboarding') {
    return <Redirect href="/(unauthenticated)/onboarding" />;
  }

  // If user is onboarded and has missing profile data, redirect to complete profile
  if (isOnboardingCompleted && (!userData?.firstName || !userData?.lastName || !userData?.phone)) {
    return <Redirect href="/(unauthenticated)/signup/completeProfile" />;
  }

  // Check if user is owner
  if (!['user', 'guest'].includes(userData?.role ?? '')) {
    return <Redirect href={'/(dashboard)/(tabs)'} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.white.DEFAULT },
      }}
    />
  );
}
