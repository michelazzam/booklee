import { getAnalytics, logEvent } from '@react-native-firebase/analytics';

/**
 * Log a screen view event to Firebase Analytics
 * @param screenName - The name of the screen being viewed
 * @param screenClass - Optional class name of the screen
 */
export const logScreenView = async (screenName: string, screenClass?: string) => {
  const analytics = getAnalytics();
  await logEvent(analytics, 'screen_view_event', {
    screen_name: screenName,
    screen_class: screenClass ?? screenName,
  });
};
