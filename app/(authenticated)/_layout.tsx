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

  if (!isOnboardingCompleted && pathname !== '/onboarding') {
    return <Redirect href="/(unauthenticated)/onboarding" />;
  }

  // Check if user is owner
  if (!['user', 'guest'].includes(userData?.role ?? '')) {
    return <Redirect href={'/(dashboard)/(tabs)'} />;
  }

  if (userData && userData.role !== 'guest' && !userData?.phone) {
    return <Redirect href="/(unauthenticated)/phoneNumber" />;
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
