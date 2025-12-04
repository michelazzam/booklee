import * as Notifications from "expo-notifications";

export type NotificationContextType = {
  error: Error | null;
  fcmToken: string | null;
  expoPushToken: string | null;
  isNotificationInitialized: boolean;
  notifications: Notifications.Notification[];
};
