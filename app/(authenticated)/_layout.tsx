import { Redirect, Stack } from 'expo-router';

import { theme } from '~/src/constants/theme';
import { AuthServices } from '~/src/services';

export default function AuthenticatedLayout() {
  /*** Constants ***/
  const { data: userData } = AuthServices.useGetMe();
  const { isAuthenticated } = AuthServices.useGetBetterAuthUser();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !userData) {
    return <Redirect href="/(unauthenticated)/login" />;
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
