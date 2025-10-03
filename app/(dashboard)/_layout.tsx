import { Redirect, Slot } from 'expo-router';
import { useUserProvider } from '~/src/store';
import { AuthServices } from '~/src/services';

const DashboardLayout = () => {
  const { isBusinessMode } = useUserProvider();
  const { data: userData, isLoading } = AuthServices.useGetMe();

  // Wait for user data to load before making redirect decisions
  if (isLoading || !userData) {
    return null;
  }

  const isOwner = userData?.role === 'owner';

  // If user is not an owner, they shouldn't be in dashboard at all
  if (!isOwner) {
    return <Redirect href="/(authenticated)/(tabs)" />;
  }

  // If business mode is off and user is owner, redirect to authenticated tabs
  if (isOwner && !isBusinessMode) {
    return <Redirect href="/(authenticated)/(tabs)" />;
  }

  return <Slot />;
};

export default DashboardLayout;
