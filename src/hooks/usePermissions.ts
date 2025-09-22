import { useState, useCallback, useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import * as Location from 'expo-location';

export type LocationPermissionStatus = 'granted' | 'denied' | 'undetermined';

export type UsePermissionsReturn = {
  isLoading: boolean;
  locationPermission: LocationPermissionStatus;
  requestLocationPermission: () => Promise<boolean>;
};

export const usePermissions = (): UsePermissionsReturn => {
  /*** States ***/
  const [isLoading, setIsLoading] = useState(false);
  const [locationPermission, setLocationPermission] =
    useState<LocationPermissionStatus>('undetermined');

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        const permissionStatus: LocationPermissionStatus =
          status === 'granted' ? 'granted' : status === 'denied' ? 'denied' : 'undetermined';

        setLocationPermission(permissionStatus);
      } catch (error) {
        console.error('Error checking location permission:', error);
        setLocationPermission('undetermined');
      }
    };

    checkLocationPermission();
  }, []);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    if (locationPermission === 'granted') {
      return true;
    }

    try {
      setIsLoading(true);

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        setLocationPermission('granted');
        return true;
      } else {
        setLocationPermission('denied');

        // Show alert explaining why location is needed
        Alert.alert(
          'Location Permission Required',
          'Location access is needed to show nearby services and offers. You can enable it later in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationPermission('denied');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [locationPermission]);

  return {
    isLoading,
    locationPermission,
    requestLocationPermission,
  };
};
