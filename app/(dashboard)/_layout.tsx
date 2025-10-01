import { Redirect, Slot } from 'expo-router';
import { useUserProvider } from '~/src/store';
import { AuthServices } from '~/src/services';

const DashboardLayout = () => {
  const { isBusinessMode } = useUserProvider();
  const { data: userData } = AuthServices.useGetMe();

  const isOwner = userData?.role === 'owner';

  // If business mode is off and user is owner, redirect to authenticated tabs
  if (isOwner && !isBusinessMode) {
    return <Redirect href="/(authenticated)/(tabs)" />;
  }

  return <Slot />;
};

export default DashboardLayout;
