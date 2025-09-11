import { Redirect } from 'expo-router';

const OnboardingIndex = () => {
  return <Redirect href="/(unauthenticated)/onboarding/step1" />;
};

export default OnboardingIndex;
