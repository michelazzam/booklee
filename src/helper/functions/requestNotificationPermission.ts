import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

type NotificationToken = {
  fcmToken: string;
  expoPushToken: string;
};
export async function requestNotificationPermission(): Promise<NotificationToken | undefined> {
  // On Android 8.0+ you must have at least one notification channel.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      lightColor: '#FF231F7C',
      vibrationPattern: [0, 250, 250, 250],
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // If not already granted, ask the user:
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    throw new Error('Notification permission not granted');
  }

  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

  if (!projectId) {
    throw new Error('Project ID not found');
  }

  try {
    if (Platform.OS === 'ios' && __DEV__) {
      return {
        fcmToken: '',
        expoPushToken: '',
      };
    }

    const { data: fcmToken } = await Notifications.getDevicePushTokenAsync();
    const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    return {
      fcmToken,
      expoPushToken,
    };
  } catch (e: unknown) {
    throw new Error(`${e}`);
  }
}
