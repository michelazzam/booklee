import { Redirect, Stack, usePathname } from 'expo-router';
import { useUserProvider } from '~/src/store';

import { theme } from '~/src/constants/theme';

import { AuthServices } from '~/src/services';

const excludedAuthPaths = ['login', 'signup', 'completeProfile'];

export default function UnauthenticatedLayout() {
  /*** Constants ***/
  const pathname = usePathname();
  const lastPath = pathname.split('/')[1] || '';
  const { data: userData } = AuthServices.useGetMe();
  const { isOnboardingCompleted } = useUserProvider();
  const { isAuthenticated, user: authUser } = AuthServices.useGetBetterAuthUser();

  // If user is authenticated and logged in but has missing profile data, redirect to complete profile
  if (
    isOnboardingCompleted &&
    isAuthenticated &&
    !!userData &&
    authUser?.emailVerified &&
    lastPath !== 'signup' &&
    (!userData.firstName || !userData.lastName || !userData.phone)
  ) {
    return <Redirect href="/(unauthenticated)/signup/completeProfile" />;
  }

  // If user is authenticated and logged in, redirect to app
  if (
    isOnboardingCompleted &&
    isAuthenticated &&
    !!userData &&
    authUser?.emailVerified &&
    !excludedAuthPaths.includes(lastPath)
  ) {
    return <Redirect href="/(authenticated)/(tabs)" />;
  }

  // If user is a guest and has completed onboarding, redirect to app
  if (isOnboardingCompleted && !!userData && userData.role === 'guest') {
    return <Redirect href="/(authenticated)/(tabs)" />;
  }

  // If user is onboarded and not logged in, redirect to login
  if (isOnboardingCompleted && !isAuthenticated && !excludedAuthPaths.includes(lastPath)) {
    return <Redirect href="/(unauthenticated)/login" />;
  }

  // If user is not onboarded and is not on onboarding screen, redirect to onboarding
  if (!isOnboardingCompleted && !pathname.includes('onboarding')) {
    return <Redirect href="/(unauthenticated)/onboarding" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: theme.colors.white.DEFAULT },
      }}
    />
  );
}
