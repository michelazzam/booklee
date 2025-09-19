import { useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

/**
 * Custom hook for managing location and notification permissions
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const {
 *     permissions,
 *     requestLocationPermission,
 *     requestNotificationPermission,
 *     checkPermissions,
 *     isLoading
 *   } = usePermissions();
 *
 *   const handleRequestLocation = async () => {
 *     const granted = await requestLocationPermission();
 *     if (granted) {
 *       console.log('Location permission granted');
 *     }
 *   };
 *
 *   return (
 *     <Button
 *       title="Request Location"
 *       onPress={handleRequestLocation}
 *       disabled={isLoading}
 *     />
 *   );
 * };
 * ```
 */

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionState {
  location: PermissionStatus;
  notifications: PermissionStatus;
}

export interface UsePermissionsReturn {
  permissions: PermissionState;
  requestLocationPermission: () => Promise<boolean>;
  requestNotificationPermission: () => Promise<boolean>;
  checkPermissions: () => Promise<void>;
  isLoading: boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [permissions, setPermissions] = useState<PermissionState>({
    location: 'undetermined',
    notifications: 'undetermined',
  });
  const [isLoading, setIsLoading] = useState(false);

  const checkPermissions = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check location permission
      const locationStatus = await Location.getForegroundPermissionsAsync();
      const locationPermission: PermissionStatus =
        locationStatus.status === 'granted'
          ? 'granted'
          : locationStatus.status === 'denied'
            ? 'denied'
            : 'undetermined';

      // Check notification permission
      const notificationStatus = await Notifications.getPermissionsAsync();
      const notificationPermission: PermissionStatus =
        notificationStatus.status === 'granted'
          ? 'granted'
          : notificationStatus.status === 'denied'
            ? 'denied'
            : 'undetermined';

      setPermissions({
        location: locationPermission,
        notifications: notificationPermission,
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Check if permission is already granted
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      if (existingStatus === 'granted') {
        setPermissions((prev) => ({ ...prev, location: 'granted' }));
        return true;
      }

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        setPermissions((prev) => ({ ...prev, location: 'granted' }));
        return true;
      } else {
        setPermissions((prev) => ({ ...prev, location: 'denied' }));

        // Show alert explaining why location is needed
        Alert.alert(
          'Location Permission Required',
          'Location access is needed to show nearby services and offers. You can enable it later in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.openSettingsAsync() },
          ]
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setPermissions((prev) => ({ ...prev, location: 'denied' }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Check if permission is already granted
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      if (existingStatus === 'granted') {
        setPermissions((prev) => ({ ...prev, notifications: 'granted' }));
        return true;
      }

      // Request permission
      const { status } = await Notifications.requestPermissionsAsync();

      if (status === 'granted') {
        setPermissions((prev) => ({ ...prev, notifications: 'granted' }));

        // For Android, we need to set the notification channel
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }

        return true;
      } else {
        setPermissions((prev) => ({ ...prev, notifications: 'denied' }));

        // Show alert explaining why notifications are needed
        Alert.alert(
          'Notification Permission Required',
          'Notifications help us remind you about your appointments and keep you updated. You can enable them later in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Notifications.openSettingsAsync() },
          ]
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setPermissions((prev) => ({ ...prev, notifications: 'denied' }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    permissions,
    requestLocationPermission,
    requestNotificationPermission,
    checkPermissions,
    isLoading,
  };
};
