import * as Notifications from 'expo-notifications';

export type NotificationContextType = {
  error: Error | null;
  hasPermission: boolean;
  fcmToken: string | null;
  expoPushToken: string | null;
  isNotificationInitialized: boolean;
  requestPermission: () => Promise<boolean>;
  notifications: Notifications.Notification[];
};
