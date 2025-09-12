import { Redirect, Stack, usePathname } from 'expo-router';
import { useUserProvider } from '~/src/store';

import { theme } from '~/src/constants/theme';

import { AuthServices } from '~/src/services';

const excludedAuthPaths = ['login', 'signup'];

export default function UnauthenticatedLayout() {
  /*** Constants ***/
  const pathname = usePathname();
  const lastPath = pathname.split('/')[1] || '';
  const { data: user } = AuthServices.useGetMe();
  const { isOnboardingCompleted } = useUserProvider();

  // Redirects users to onboarding if they haven't completed it
  if (!isOnboardingCompleted && !pathname.includes('onboarding')) {
    return <Redirect href="/(unauthenticated)/onboarding" />;
  }

  // Redirects users to login if they have completed onboarding and are not logged in
  if (isOnboardingCompleted && !user && !excludedAuthPaths.includes(lastPath)) {
    return <Redirect href="/(unauthenticated)/login" />;
  }

  if (user) return <Redirect href="/(authenticated)/(tabs)" />;
  console.log('user', user);

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
