import { Redirect, Slot } from 'expo-router';
import { AuthServices } from '~/src/services';

const DashboardLayout = () => {
  const { data: userData } = AuthServices.useGetMe();
  const { isAuthenticated } = AuthServices.useGetBetterAuthUser();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !userData) {
    return <Redirect href="/(unauthenticated)/login" />;
  }

  // If user is not an owner, they shouldn't be in dashboard
  if (userData?.role === 'user') {
    return <Redirect href="/(authenticated)/(tabs)" />;
  }

  return <Slot />;
};

export default DashboardLayout;
