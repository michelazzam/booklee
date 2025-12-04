import { Redirect, Stack, usePathname } from 'expo-router';
import { useUserProvider } from '~/src/store';

import { theme } from '~/src/constants/theme';

import { AuthServices } from '~/src/services';

const excludedAuthPaths = ['login', 'signup', 'phoneNumber'];

export default function UnauthenticatedLayout() {
  /*** Constants ***/
  const pathname = usePathname();
  const lastPath = pathname.split('/')[1] || '';
  const { data: userData } = AuthServices.useGetMe();
  const { isOnboardingCompleted } = useUserProvider();
  const { isAuthenticated, user: authUser } = AuthServices.useGetBetterAuthUser();

  // If user is authenticated and has getMe data and is verified, redirect to app
  if (
    isOnboardingCompleted &&
    isAuthenticated &&
    !!userData &&
    authUser?.emailVerified &&
    !excludedAuthPaths.includes(lastPath)
  ) {
    return <Redirect href="/(authenticated)/(tabs)" />;
  }

  if (isOnboardingCompleted && !!userData && userData.role === 'guest') {
    return <Redirect href="/(authenticated)/(tabs)" />;
  }

  // Redirects users to login if they have completed onboarding and are not logged in
  if (isOnboardingCompleted && !isAuthenticated && !excludedAuthPaths.includes(lastPath)) {
    return <Redirect href="/(unauthenticated)/login" />;
  }

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
