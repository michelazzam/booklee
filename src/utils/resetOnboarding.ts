import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = {
  onboardingCompleted: 'onboardingCompleted',
};

/**
 * Utility function to reset onboarding state for testing purposes
 * This will make the onboarding flow show again on next app launch
 */
export const resetOnboardingState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY.onboardingCompleted);
    console.log('✅ Onboarding state reset successfully');
  } catch (error) {
    console.error('❌ Error resetting onboarding state:', error);
  }
};

/**
 * Utility function to check current onboarding state
 */
export const getOnboardingState = async (): Promise<boolean> => {
  try {
    const onboardingCompleted = await AsyncStorage.getItem(STORAGE_KEY.onboardingCompleted);
    return onboardingCompleted === 'true';
  } catch (error) {
    console.error('❌ Error getting onboarding state:', error);
    return false;
  }
};
