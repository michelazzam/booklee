import { Redirect } from 'expo-router';

export default function Index() {
  // Always redirect to unauthenticated flow on app launch (for demo purposes)
  return <Redirect href="/(unauthenticated)/onboarding" />;
}
