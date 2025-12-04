import { ReactNode, useState, useEffect, useRef } from 'react';
import { type EventSubscription } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';

import { requestNotificationPermission } from '~/src/helper/functions';

import { type NotificationContextType } from './types';
import NotificationContext from './context';

export type NotificationProviderProps = {
  children: ReactNode;
};

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  /*** States ***/
  const [error, setError] = useState<Error | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [isNotificationInitialized, setIsNotificationInitialized] = useState(false);
  const [notifications, setNotifications] = useState<Notifications.Notification[]>([]);

  /*** Refs ***/
  const responseListener = useRef<EventSubscription | null>(null);
  const notificationListener = useRef<EventSubscription | null>(null);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Request notification permissions and get tokens
        const token = await requestNotificationPermission();
        setFcmToken(token?.fcmToken ?? null);
        setExpoPushToken(token?.expoPushToken ?? null);

        // Load delivered notifications
        const deliveredNotifications = await Notifications.getPresentedNotificationsAsync();
        setNotifications(deliveredNotifications);
      } catch (error) {
        setError(error as Error);
        console.log('error', error);
      } finally {
        setIsNotificationInitialized(true);
      }
    };

    initializeNotifications();

    // Listener for when a notification is received while app is active
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotifications((prev) => [notification, ...prev]);

      if (__DEV__) {
        console.info('🔔 Notification Received while app is active: ', notification);
      }
    });

    // Listener for when a user interacts with a notification (tap, action)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      if (__DEV__) {
        console.info(
          '🔔 Notification Response while app is active (tap): ',
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        );
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  const value: NotificationContextType = {
    error,
    fcmToken,
    expoPushToken,
    notifications,
    isNotificationInitialized,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
